import { client } from "../db/configs/pg.config.js";
import { Response } from "../helpers/response-data.js";
import { FileCache } from "../helpers/utils/caches/files.js";
import { paramsToNameFile } from "../helpers/utils/convertion/string.js";

const cache = new FileCache({
    cacheDir: '.cache-local/recommendations',
    ttl: 1800 // 30 minutes
});

/**
 * Get book recommendations based on different algorithms
 * @param {Object} request - Request parameters
 * @param {string} request.user_id - Optional user ID for personalized recommendations
 * @param {string} request.type - Recommendation type: 'similar', 'popular', 'trending', 'personalized'
 * @param {number} request.limit - Number of recommendations to return (default: 10)
 * @param {string} request.category - Optional category filter
 */
export const getRecommendations = async (request) => {
    const { user_id, type = 'popular', limit = 10, category } = request;

    const cacheKey = `recommendations_${paramsToNameFile(request)}`;

    // Try to get data from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
        console.log('Returning cached recommendations data');
        return cachedData;
    }

    try {
        const result = await client.query(
            `SELECT * FROM public.get_book_recommendations($1, $2, $3, $4)`,
            [user_id || null, type, limit, category || null]
        );

        const responseData = Response.success(result.rows, result.rows.length);

        // Cache the successful response
        await cache.set(cacheKey, responseData);

        return responseData;
    } catch (error) {
        console.error('Error getting recommendations:', error);
        return Response.serverError({ message: 'Failed to get recommendations' });
    }
};

/**
 * Add a new recommendation
 * @param {Object} request - Request parameters
 * @param {string} request.user_id - Optional user ID
 * @param {string} request.book_id - Book ID to recommend
 * @param {string} request.recommendation_type - Type of recommendation
 * @param {number} request.recommendation_score - Score between 0 and 1
 * @param {string} request.reason - Reason for recommendation
 */
export const addRecommendation = async (request) => {
    const {
        user_id,
        book_id,
        recommendation_type = 'similar',
        recommendation_score = 0.5,
        reason
    } = request;

    if (!book_id) {
        return Response.insetFailed({ message: "Book ID is required" });
    }

    try {
        const result = await client.query(
            `SELECT public.insert_recommendation($1, $2, $3, $4, $5)`,
            [user_id || null, book_id, recommendation_type, recommendation_score, reason]
        );

        if (result.rows[0].insert_recommendation) {
            // Clear cache after successful insert
            cache.clear();
            return Response.insetSuccess({ message: "Recommendation added successfully" });
        }

        return Response.insetFailed({ message: "Failed to add recommendation" });
    } catch (error) {
        console.error('Error adding recommendation:', error);

        if (error.message.includes('already exists')) {
            return Response.insetFailed({ message: "Recommendation already exists for this user and book" });
        }

        if (error.message.includes('not found')) {
            return Response.insetFailed({ message: error.message });
        }

        return Response.insetFailed({ message: "Failed to add recommendation" });
    }
};

/**
 * Get personalized recommendations for a specific user
 * @param {Object} request - Request parameters
 * @param {string} request.user_id - User ID
 * @param {number} request.limit - Number of recommendations to return
 * @param {string} request.category - Optional category filter
 */
export const getUserRecommendations = async (request) => {
    const { user_id, limit = 10, category } = request;

    if (!user_id) {
        return Response.notFound({ message: "User ID is required" });
    }

    const cacheKey = `user_recommendations_${paramsToNameFile(request)}`;

    // Try to get data from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
        console.log(`Returning cached user recommendations for user: ${user_id}`);
        return cachedData;
    }

    try {
        const result = await client.query(
            `SELECT * FROM public.get_book_recommendations($1, 'personalized', $2, $3)`,
            [user_id, limit, category || null]
        );

        const responseData = Response.success(result.rows, result.rows.length);

        // Cache the successful response
        await cache.set(cacheKey, responseData);
        console.log(`Cached user recommendations for user: ${user_id}`);

        return responseData;
    } catch (error) {
        console.error('Error getting user recommendations:', error);
        return Response.serverError({ message: 'Failed to get user recommendations' });
    }
};

/**
 * Get similar books based on a specific book
 * @param {Object} request - Request parameters
 * @param {string} request.book_id - Book ID to find similar books for
 * @param {number} request.limit - Number of similar books to return
 */
export const getSimilarBooks = async (request) => {
    const { book_id, limit = 10 } = request;

    if (!book_id) {
        return Response.authClient({ message: "Book ID is required" });
    }

    const cacheKey = `similar_books_${book_id}_${limit}`;

    // Try to get data from cache first
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
        console.log(`Returning cached similar books for book: ${book_id}`);
        return cachedData;
    }

    try {
        // First get the book's category
        const bookResult = await client.query(
            `SELECT category FROM public.ebooks WHERE id = $1 AND status = true AND is_deleted = false`,
            [book_id]
        );

        if (bookResult.rows.length === 0) {
            return Response.notFound({ message: "Book not found" });
        }

        const category = bookResult.rows[0].category;

        // Get similar books from the same category
        const result = await client.query(
            `SELECT * FROM public.get_book_recommendations(NULL, 'similar', $1, $2)`,
            [limit, category]
        );

        // Filter out the original book
        const similarBooks = result.rows.filter(book => book.book_id !== book_id);

        const responseData = Response.success(similarBooks, similarBooks.length);

        // Cache the successful response
        await cache.set(cacheKey, responseData);
        console.log(`Cached similar books for book: ${book_id}`);

        return responseData;
    } catch (error) {
        console.error('Error getting similar books:', error);
        return Response.serverError({ message: 'Failed to get similar books' });
    }
};

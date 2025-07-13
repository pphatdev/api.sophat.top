import { client } from "../db/configs/pg.config.js";
import { Response } from "../helpers/response-data.js";
import { query as pagination } from "../helpers/paginations.js";
import { FileCache } from "../helpers/utils/caches/files.js";
import { paramsToNameFile } from "../helpers/utils/convertion/string.js";

const cache = new FileCache({
    cacheDir: '.cache-local/authors',
    ttl: 900 // 15 minutes
});

export const getData = async (request) => {
    const { page, limit, search, sort, nationality } = request
    let searchCondition = "";
    const cacheKey = `authors_list_${paramsToNameFile(request)}`;

    // Try to get data from cache first
    const cachedData = await cache.get(cacheKey)
    if (cachedData) {
        console.log('Returning cached authors data')
        return cachedData
    }

    if (nationality && nationality !== "all") {
        searchCondition = `nationality ilike '%${nationality}%'`;
    }

    if (search && search !== "" && nationality !== "all") {
        searchCondition = searchCondition ? `${searchCondition} AND` : '';
        searchCondition += ` (name ilike '%${search}%' OR biography ilike '%${search}%')`;
    }

    const count = await client.query(
        `SELECT count(id) from public.get_authors ${searchCondition ? `WHERE ${searchCondition}` : ''}`, []
    )
    const total = count.rows[0].count || 0

    const query = pagination({
        table: 'public.get_authors',
        selectColumns: ["*"],
        conditions: {
            operator: 'WHERE',
            value: searchCondition
        },
        page: page,
        limit: limit,
        search: {
            column: ["name", "biography", "nationality"],
            value: search,
            operator: "or",
            withWere: true
        },
        sort: {
            column: [
                "updated_date", "name", "birth_date"
            ],
            value: sort
        },
    })

    return await client.query(query, []).then(
        async result => {
            const responseData = Response.success(result.rows, total)
            // Cache the successful response
            await cache.set(cacheKey, responseData)
            console.log('Cached authors data')
            return responseData
        }
    ).catch(
        reason => console.log(reason)
    )
};

export const getDataDetail = async ({ id }) => {
    const cacheKey = `author_detail_${id}`
    const cachedData = await cache.get(cacheKey)
    if (cachedData) {
        console.log(`Returning cached author detail for ID: ${id}`)
        return cachedData
    }

    return await client.query(
        `SELECT * from public.get_authors where id=$1`, [id]
    ).then(
        async result => {
            const responseData = Response.detailSuccess(result.rows)
            await cache.set(cacheKey, responseData)
            console.log(`Cached author detail for ID: ${id}`)
            return responseData
        }
    ).catch(
        reason => console.log(reason)
    )
};

export const insertData = async (request) => {
    const {
        name, biography, birth_date, death_date, nationality, 
        website, awards, genres, profile_image_url
    } = request;

    // Validate required fields
    if (!name || name.trim().length === 0) {
        return Response.insetFailed({ message: "Author name is required." });
    }

    const profile_image = request.file?.filename || profile_image_url || null;

    return await client.query(
        `SELECT insert_authors($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
            name, biography, birth_date, death_date, nationality,
            website, awards, genres, profile_image
        ]
    ).then(
        result => {
            const success = result.rows[0]?.insert_authors;
            if (!success) {
                return Response.insetFailed({ message: "Failed to insert author. Author with this name may already exist." });
            }

            // Clear cache after successful insert
            cache.clear();
            return Response.insetSuccess({ message: "Insert Success." });
        }
    ).catch(
        reason => {
            console.log("Insert author error:", reason);
            if (reason.code === "23505") {
                return Response.insetFailed({ message: "Author with this name already exists." });
            }
            return Response.insetFailed({ message: "Failed to insert author." });
        }
    );
};

export const updateData = async (request) => {
    const {
        author_id, name, biography, birth_date, death_date, nationality,
        website, awards, genres, profile_image_url
    } = request;

    // Validate required fields
    if (!author_id || !name || name.trim().length === 0) {
        return Response.updateFailed({ message: "Author ID and name are required." });
    }

    const profile_image = request.file?.filename || profile_image_url || null;

    return await client.query(
        `SELECT update_authors($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
            author_id, name, biography, birth_date, death_date, nationality,
            website, awards, genres, profile_image
        ]
    ).then(
        result => {
            const success = result.rows[0]?.update_authors;
            if (!success) {
                return Response.updateFailed({ message: "Failed to update author. Author may not exist or name already taken." });
            }

            // Clear cache after successful update
            cache.clear();
            return Response.updateSuccess({ message: "Update Success." });
        }
    ).catch(
        reason => {
            console.log("Update author error:", reason);
            if (reason.code === "23505") {
                return Response.updateFailed({ message: "Author with this name already exists." });
            }
            return Response.updateFailed({ message: "Failed to update author." });
        }
    );
};

export const deleteData = async ({ id }) => {
    return await client.query(
        `DELETE FROM public.authors WHERE id = $1`, [id]
    ).then(
        result => {
            if (result.rowCount === 0)
                return Response.deleteFailed({ message: "Delete Failed. Data not found." });

            // Clear cache after successful delete
            cache.clear();
            return Response.deleteSuccess({ message: "Delete Success." });
        }
    ).catch(
        reason => {
            console.log(reason);
            return Response.deleteFailed({ message: "Delete Failed. " + reason.message });
        }
    );
};

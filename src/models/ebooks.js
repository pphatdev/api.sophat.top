import { client } from "../db/configs/pg.config.js";
import { Response } from "../helpers/response-data.js";
import { query as pagination } from "../helpers/paginations.js";
import { FileCache } from "../helpers/utils/caches/files.js";
import { paramsToNameFile } from "../helpers/utils/convertion/string.js";


const cache = new FileCache({
    cacheDir: '.cache-local/ebooks',
    ttl: 900 // 15 minutes
});

export const getData = async (request) => {
    const { page, limit, search, sort, category } = request
    let searchCondition = "";
    const cacheKey = `ebooks_list_${paramsToNameFile(request)}`;

    // Try to get data from cache first
    const cachedData = await cache.get(cacheKey)
    if (cachedData) {
        console.log('Returning cached ebooks data')
        return cachedData
    }

    if (category && category !== "all") {
        if (String(category).toLowerCase().includes("recommend")) {
            searchCondition = `rating >= 4`;
        } else {
            searchCondition = `category ilike '%${category}%'`;
        }
    }

    if (search && search !== "" && category !== "all") {
        searchCondition = searchCondition ? `${searchCondition} AND` : '';
        searchCondition += ` (title ilike '%${search}%' OR subtitle ilike '%${search}%')`;
    }

    const count = await client.query(
        `SELECT count(id) from public.get_ebooks ${searchCondition ? `WHERE ${searchCondition}` : ''}`, []
    )
    const total = count.rows[0].count || 0

    const query = pagination({
        table: 'public.get_ebooks',
        selectColumns: ["*"],
        conditions: {
            operator: 'WHERE',
            value: searchCondition
        },
        page: page,
        limit: limit,
        search: {
            column: ["title", "description", "subtitle"],
            value: search,
            operator: "or",
            withWere: true
        },
        sort: {
            column: [
                "updated_date", "title", "subtitle"
            ],
            value: sort
        },
    })

    return await client.query(query, []).then(
        async result => {
            const responseData = Response.success(result.rows, total)
            // Cache the successful response
            await cache.set(cacheKey, responseData)
            console.log('Cached ebooks data')
            return responseData
        }
    ).catch(
        reason => console.log(reason)
    )
};


export const getDataByAuthor = async (request) => {

    const { page, limit, search, sort, category, authorId } = request

    let searchCondition = "";
    const cacheKey = `ebooks_list_${paramsToNameFile(request)}`;

    // Try to get data from cache first
    const cachedData = await cache.get(cacheKey)
    if (cachedData) {
        console.log('Returning cached ebooks data')
        return cachedData
    }

    if (category && category !== "all") {
        if (String(category).toLowerCase().includes("recommend")) {
            searchCondition = `rating >= 4`;
        } else {
            searchCondition = `category ilike '%${category}%'`;
        }
    }

    if (search && search !== "" && category !== "all") {
        searchCondition = searchCondition ? `${searchCondition} AND` : '';
        searchCondition += ` (title ilike '%${search}%' OR subtitle ilike '%${search}%')`;
    }

    const count = await client.query(
        `SELECT count(id) from public.get_ebooks_by_author(${authorId}) ${searchCondition ? `WHERE  ${searchCondition}` : ''}`, []
    )
    const total = count.rows[0].count || 0

    const query = pagination({
        table: `public.get_ebooks_by_author(${authorId})`,
        selectColumns: ["*"],
        conditions: {
            operator: 'WHERE',
            value: searchCondition
        },
        page: page,
        limit: limit,
        search: {
            column: ["title", "description", "subtitle"],
            value: search,
            operator: "or",
            withWere: true
        },
        sort: {
            column: [
                "updated_date", "title", "subtitle"
            ],
            value: sort
        },
    })

    return await client.query(query, []).then(
        async result => {
            const responseData = Response.success(result.rows, total)
            // Cache the successful response
            await cache.set(cacheKey, responseData)
            console.log('Cached ebooks data')
            return responseData
        }
    ).catch(
        reason => console.log(reason)
    )
}


export const getDataDetail = async ({ id }) => {
    const cacheKey = `ebook_detail_${id}`
    const cachedData = await cache.get(cacheKey)
    if (cachedData) {
        console.log(`Returning cached ebook detail for ID: ${id}`)
        return cachedData
    }

    return await client.query(
        `SELECT * from public.get_ebooks where id=$1`, [id]
    ).then(
        async result => {
            const responseData = Response.detailSuccess(result.rows)
            await cache.set(cacheKey, responseData)
            console.log(`Cached ebook detail for ID: ${id}`)
            return responseData
        }
    ).catch(
        reason => console.log(reason)
    )
};


export const insertData = async (request) => {
    const {
        title, subtitle, author, publisher, isbn, description,
        category, language, page_count, price, publication_date, rating = 0
    } = request;

    const file_size_mb = request.file.size / (1024 * 1024);
    const file_path = request.file.path.replaceAll("\\", "/");
    const file_format = request.file.mimetype.split('/')[1];
    const cover_image_url = request.file.filename;

    return await client.query(
        `SELECT insert_ebooks($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
            title, subtitle, author, publisher, isbn, description,
            category, language, page_count, file_size_mb, file_format,
            file_path, cover_image_url, price, publication_date, rating
        ]
    ).then(
        result => {
            if (!result.rows[0].insert_ebooks)
                return result;

            // Clear cache form folder `.cache-local/ebooks/*` after successful insert
            cache.clear();
            return Response.insetSuccess({ message: "Insert Success." });
        }
    ).catch(
        reason => {
            if (reason.code == "23505")
                return Response.insetFailed({ message: reason.detail });
            console.log(reason);
            return reason;
        }
    );
};

export const updateData = async (request) => {
    const {
        book_id, title, subtitle, author, publisher, isbn, description,
        category, language, page_count, price, publication_date, rating = 0
    } = request;

    const file_size_mb = request.file?.size ? request.file.size / (1024 * 1024) : null;
    const file_path = request.file?.path ? request.file.path.replaceAll("\\", "/") : null;
    const file_format = request.file?.mimetype ? request.file.mimetype.split('/')[1] : null;
    const cover_image_url = request.file?.filename || null;

    return await client.query(
        `SELECT update_ebooks($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
            book_id, title, subtitle, author, publisher, isbn, description,
            category, language, page_count, file_size_mb, file_format,
            file_path, cover_image_url, price, publication_date, rating
        ]
    ).then(
        result => {
            if (!result.rows[0].update_ebooks)
                return Response.updateFailed({ message: "Update Failed. Data not found." });

            // Clear cache after successful update
            cache.clear();
            return Response.updateSuccess({ message: "Update Success." });
        }
    ).catch(
        reason => {
            if (reason.code === "23505")
                return Response.updateFailed({ message: reason.detail });
            console.log(reason);
            return reason;
        }
    );
};


export const getRelatedData = async (request) => {
    const { page, limit, search, sort, id } = request
    const cacheKey = `related_ebooks_${id}_${paramsToNameFile(request)}`;

    // Try to get data from cache first
    const cachedData = await cache.get(cacheKey)
    if (cachedData) {
        console.log('Returning cached related ebooks data')
        return cachedData
    }

    // Count total related ebooks
    const count = await client.query(
        `SELECT count(id) from public.get_related_ebooks WHERE reference_book_id = $1`, [id]
    )
    const total = count.rows[0].count || 0

    const query = pagination({
        table: 'public.get_related_ebooks',
        selectColumns: ["*"],
        conditions: {
            operator: 'WHERE',
            value: `reference_book_id = '${id}'`
        },
        page: page,
        limit: limit,
        search: {
            column: ["title", "description", "subtitle", "author"],
            value: search,
            operator: "or",
            withWere: false
        },
        sort: {
            column: [
                "updated_date", "title", "subtitle"
            ],
            value: sort
        },
    })

    return await client.query(query, []).then(
        async result => {
            const responseData = Response.success(result.rows, total)
            // Cache the successful response
            await cache.set(cacheKey, responseData)
            console.log('Cached related ebooks data')
            return responseData
        }
    ).catch(
        reason => console.log(reason)
    )
};

CREATE OR REPLACE FUNCTION public.get_ebooks_by_author(author_id_param INTEGER)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    subtitle VARCHAR,
    authors JSON,
    publisher VARCHAR,
    isbn VARCHAR,
    description TEXT,
    category VARCHAR,
    language VARCHAR,
    page_count INTEGER,
    file_size_mb DECIMAL,
    file_format VARCHAR,
    file_path VARCHAR,
    image VARCHAR,
    price DECIMAL,
    publication_date DATE,
    rating DECIMAL,
    download_count INTEGER,
    status BOOLEAN,
    is_deleted BOOLEAN,
    created_date TIMESTAMP,
    updated_date TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.subtitle,
        array_to_json(array_agg(
            jsonb_build_object(
                'id', a.id,
                'name', a.name,
                'biography', a.biography,
                'nationality', a.nationality,
                'image', a.profile_image_url
            )
        )) as authors,
        e.publisher,
        e.isbn,
        e.description,
        e.category,
        e.language,
        e.page_count,
        e.file_size_mb,
        e.file_format,
        e.file_path,
        concat('/api/v1/files/thumbnails/', e.cover_image_url)::VARCHAR as image,
        e.price,
        e.publication_date,
        e.rating,
        e.download_count,
        e.status,
        e.is_deleted,
        e.created_date,
        e.updated_date
    FROM public.ebooks e
    LEFT JOIN public.authors a ON a.id = e.author_id
    WHERE e.is_deleted = false AND e.author_id = author_id_param
    GROUP BY
        e.id,
        e.title,
        e.subtitle,
        e.publisher,
        e.isbn,
        e.description,
        e.category,
        e.language,
        e.page_count,
        e.file_size_mb,
        e.file_format,
        e.file_path,
        e.cover_image_url,
        e.price,
        e.publication_date,
        e.rating,
        e.download_count,
        e.status,
        e.is_deleted,
        e.created_date,
        e.updated_date;
END;
$$;
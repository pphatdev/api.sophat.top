CREATE OR REPLACE VIEW public.get_ebooks
AS SELECT
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
    concat('/api/v1/files/thumbnails/', e.cover_image_url) as image,
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
WHERE e.is_deleted = false
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
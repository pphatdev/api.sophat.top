CREATE OR REPLACE VIEW public.get_related_ebooks
AS 
SELECT 
    e1.id,
    e1.title,
    e1.subtitle,
    array_to_json(array_agg(
        jsonb_build_object(
            'id', a.id,
            'name', a.name,
            'biography', a.biography,
            'nationality', a.nationality,
            'image', a.profile_image_url
        )
    )) as authors,
    e1.publisher,
    e1.isbn,
    e1.description,
    e1.category,
    e1.language,
    e1.page_count,
    e1.file_size_mb,
    e1.file_format,
    e1.file_path,
    CONCAT('/api/v1/files/thumbnails/', e1.cover_image_url) as image,
    e1.price,
    e1.publication_date,
    e1.rating,
    e1.download_count,
    e1.status,
    e1.is_deleted,
    e1.created_date,
    e1.updated_date,
    e2.id as reference_book_id,
    CASE 
        WHEN e1.author_id = e2.author_id AND e1.category = e2.category THEN 'same_author_category'
        WHEN e1.author_id = e2.author_id THEN 'same_author'
        WHEN e1.category = e2.category THEN 'same_category'
        ELSE 'other'
    END as relationship_type,
    CASE 
        WHEN e1.author_id = e2.author_id AND e1.category = e2.category THEN 3
        WHEN e1.author_id = e2.author_id THEN 2
        WHEN e1.category = e2.category THEN 1
        ELSE 0
    END as relevance_score
FROM public.ebooks e1
CROSS JOIN public.ebooks e2
LEFT JOIN public.authors a ON a.id = e1.author_id
WHERE e1.id != e2.id
    AND e1.is_deleted = false
    AND e2.is_deleted = false
    AND e1.status = true
    AND e2.status = true
    AND (
        e1.author_id = e2.author_id 
        OR e1.category = e2.category
        OR e1.publisher = e2.publisher
    )
GROUP BY
    e1.id,
    e1.title,
    e1.subtitle,
    e1.publisher,
    e1.isbn,
    e1.description,
    e1.category,
    e1.language,
    e1.page_count,
    e1.file_size_mb,
    e1.file_format,
    e1.file_path,
    e1.cover_image_url,
    e1.price,
    e1.publication_date,
    e1.rating,
    e1.download_count,
    e1.status,
    e1.is_deleted,
    e1.created_date,
    e1.updated_date,
    e2.id,
    e2.author_id,
    e2.category;

COMMENT ON VIEW public.get_related_ebooks IS 'View for finding related ebooks based on author, category, or publisher relationships';
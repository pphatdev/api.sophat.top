-- public.get_related_ebooks source

CREATE OR REPLACE VIEW public.get_related_ebooks
AS 
SELECT 
    e1.id,
    e1.title,
    e1.subtitle,
    e1.author,
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
    -- Reference book ID for which we're finding related books
    e2.id as reference_book_id,
    -- Relationship type (same_author, same_category, etc.)
    CASE 
        WHEN e1.author = e2.author AND e1.category = e2.category THEN 'same_author_category'
        WHEN e1.author = e2.author THEN 'same_author'
        WHEN e1.category = e2.category THEN 'same_category'
        ELSE 'other'
    END as relationship_type,
    -- Relevance score for ordering
    CASE 
        WHEN e1.author = e2.author AND e1.category = e2.category THEN 3
        WHEN e1.author = e2.author THEN 2
        WHEN e1.category = e2.category THEN 1
        ELSE 0
    END as relevance_score
FROM public.ebooks e1
CROSS JOIN public.ebooks e2
WHERE e1.id != e2.id
    AND e1.is_deleted = false
    AND e2.is_deleted = false
    AND e1.status = true
    AND e2.status = true
    AND (
        e1.author = e2.author 
        OR e1.category = e2.category
        OR e1.publisher = e2.publisher
    )
ORDER BY e2.id, relevance_score DESC, e1.rating DESC, e1.download_count DESC;

-- Add comment for documentation
COMMENT ON VIEW public.get_related_ebooks IS 'View for finding related ebooks based on author, category, or publisher relationships';
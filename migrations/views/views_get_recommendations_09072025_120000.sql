-- Create view for getting recommendations with book details
CREATE
OR REPLACE VIEW public.get_recommendations AS
SELECT
    r.id,
    r.user_id,
    r.book_id,
    r.recommendation_type,
    r.recommendation_score,
    r.reason,
    r.status,
    r.created_date,
    r.updated_date,
    -- Book details
    e.title,
    e.subtitle,
    e.author,
    e.publisher,
    e.isbn,
    e.description,
    e.category,
    e.language,
    e.page_count,
    e.file_size_mb,
    e.file_format,
    e.cover_image_url,
    e.price,
    e.publication_date,
    e.rating,
    e.download_count
FROM
    public.recommendations r
    INNER JOIN public.ebooks e ON r.book_id = e.id
WHERE
    r.status = true
    AND r.is_deleted = false
    AND e.status = true
    AND e.is_deleted = false;
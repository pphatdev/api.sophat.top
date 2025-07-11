-- public.get_ebooks source
DROP VIEW IF EXISTS public.get_ebooks CASCADE;

CREATE OR REPLACE VIEW public.get_ebooks
AS SELECT
    id,
    title,
    subtitle,
    author,
    publisher,
    isbn,
    description,
    category,
    language,
    page_count,
    file_size_mb,
    file_format,
    file_path,
    concat ('/api/v1/files/thumbnails/', cover_image_url) as image,
    price,
    publication_date,
    rating,
    download_count,
    status,
    is_deleted,
    created_date,
    updated_date
FROM public.ebooks
WHERE is_deleted = false;
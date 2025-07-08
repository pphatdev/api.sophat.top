CREATE OR REPLACE FUNCTION public.insert_ebooks(
    title character varying,
    subtitle character varying,
    author character varying,
    publisher character varying,
    isbn character varying,
    description text,
    category character varying,
    language character varying,
    page_count integer,
    file_size_mb decimal(10,2),
    file_format character varying,
    file_path character varying,
    cover_image_url character varying,
    price decimal(10,2),
    publication_date date,
    rating decimal(3,2) = 0
) RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.ebooks(
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
        cover_image_url,
        price,
        publication_date,
        rating
    ) VALUES (
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
        cover_image_url,
        price,
        publication_date,
        rating
    ) RETURNING id INTO new_id;

    RETURN new_id;
END;
$$ LANGUAGE plpgsql;
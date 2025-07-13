-- filepath: d:\Projects\NodeJs\APIs\apis-with-nodejs-es6\migrations\functions\update_ebooks.sql
CREATE OR REPLACE FUNCTION public.update_ebooks(
    book_id UUID,
    title character varying,
    subtitle character varying,
    author_id integer,
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
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.ebooks SET
        title = update_ebooks.title,
        subtitle = update_ebooks.subtitle,
        author_id = update_ebooks.author_id,
        publisher = update_ebooks.publisher,
        isbn = update_ebooks.isbn,
        description = update_ebooks.description,
        category = update_ebooks.category,
        language = update_ebooks.language,
        page_count = update_ebooks.page_count,
        file_size_mb = update_ebooks.file_size_mb,
        file_format = update_ebooks.file_format,
        file_path = update_ebooks.file_path,
        cover_image_url = update_ebooks.cover_image_url,
        price = update_ebooks.price,
        publication_date = update_ebooks.publication_date,
        rating = update_ebooks.rating,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = book_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
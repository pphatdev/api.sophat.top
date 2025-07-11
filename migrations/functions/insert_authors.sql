-- Function to insert a new author
CREATE OR REPLACE FUNCTION public.insert_authors(
    p_name VARCHAR(255),
    p_biography TEXT DEFAULT NULL,
    p_birth_date DATE DEFAULT NULL,
    p_death_date DATE DEFAULT NULL,
    p_nationality VARCHAR(100) DEFAULT NULL,
    p_website VARCHAR(255) DEFAULT NULL,
    p_awards TEXT DEFAULT NULL,
    p_genres TEXT DEFAULT NULL,
    p_profile_image_url VARCHAR(255) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    author_exists BOOLEAN;
BEGIN
    -- Validate input parameters
    IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Check if author already exists
    SELECT EXISTS(
        SELECT 1 FROM public.authors 
        WHERE LOWER(TRIM(name)) = LOWER(TRIM(p_name))
    ) INTO author_exists;
    
    IF author_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Insert the new author
    INSERT INTO public.authors (
        name, biography, birth_date, death_date, nationality,
        website, awards, genres, profile_image_url
    ) VALUES (
        TRIM(p_name), p_biography, p_birth_date, p_death_date, p_nationality,
        p_website, p_awards, p_genres, p_profile_image_url
    );
    
    RETURN TRUE;
    
EXCEPTION
    WHEN unique_violation THEN
        RETURN FALSE;
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION public.insert_authors IS 'Function to insert a new author with validation';

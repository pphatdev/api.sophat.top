-- Function to update an existing author
CREATE OR REPLACE FUNCTION public.update_authors(
    p_author_id INTEGER,
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
    name_conflict BOOLEAN;
    update_count INTEGER;
BEGIN
    -- Validate input parameters
    IF p_author_id IS NULL OR p_author_id <= 0 THEN
        RETURN FALSE;
    END IF;
    
    IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Check if author exists by ID
    SELECT EXISTS(
        SELECT 1 FROM public.authors 
        WHERE id = p_author_id
    ) INTO author_exists;
    
    IF NOT author_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Check if another author with the same name exists (excluding current author)
    SELECT EXISTS(
        SELECT 1 FROM public.authors 
        WHERE LOWER(TRIM(name)) = LOWER(TRIM(p_name)) AND id != p_author_id
    ) INTO name_conflict;
    
    IF name_conflict THEN
        RETURN FALSE;
    END IF;
    
    -- Update the author
    UPDATE public.authors SET
        name = TRIM(p_name),
        biography = p_biography,
        birth_date = p_birth_date,
        death_date = p_death_date,
        nationality = p_nationality,
        website = p_website,
        awards = p_awards,
        genres = p_genres,
        profile_image_url = CASE 
            WHEN p_profile_image_url IS NOT NULL THEN p_profile_image_url
            ELSE profile_image_url
        END,
        updated_date = CURRENT_TIMESTAMP
    WHERE id = p_author_id;
    
    GET DIAGNOSTICS update_count = ROW_COUNT;
    
    RETURN update_count > 0;
    
EXCEPTION
    WHEN unique_violation THEN
        RETURN FALSE;
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION public.update_authors IS 'Function to update an existing author with validation';

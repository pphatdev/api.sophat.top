-- Create a view for getting authors with formatted data
CREATE OR REPLACE VIEW public.get_authors AS
SELECT 
    a.id,
    a.name,
    a.biography,
    a.birth_date,
    a.death_date,
    a.nationality,
    a.website,
    a.awards,
    a.genres,
    a.profile_image_url,
    a.created_date,
    a.updated_date,
    -- Calculate age if still alive, or age at death
    CASE 
        WHEN a.death_date IS NULL AND a.birth_date IS NOT NULL THEN 
            EXTRACT(YEAR FROM AGE(CURRENT_DATE, a.birth_date))
        WHEN a.death_date IS NOT NULL AND a.birth_date IS NOT NULL THEN 
            EXTRACT(YEAR FROM AGE(a.death_date, a.birth_date))
        ELSE NULL
    END AS age,
    -- Check if author is still alive
    CASE 
        WHEN a.death_date IS NULL THEN true
        ELSE false
    END AS is_alive,
    -- Count of books by this author (if ebooks table exists)
    COALESCE(
        (SELECT COUNT(*) FROM public.ebooks e WHERE e.author ILIKE '%' || a.name || '%'),
        0
    ) AS books_count
FROM public.authors a
ORDER BY a.name;

-- Add comment for documentation
COMMENT ON VIEW public.get_authors IS 'View for retrieving authors with calculated fields like age and book count';

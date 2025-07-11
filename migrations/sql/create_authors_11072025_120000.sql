-- Create authors table
CREATE TABLE IF NOT EXISTS public.authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    biography TEXT,
    birth_date DATE,
    death_date DATE,
    nationality VARCHAR(100),
    website VARCHAR(255),
    awards TEXT,
    genres TEXT,
    profile_image_url VARCHAR(255),
    status BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_authors_name ON public.authors(name);
CREATE INDEX IF NOT EXISTS idx_authors_nationality ON public.authors(nationality);
CREATE INDEX IF NOT EXISTS idx_authors_birth_date ON public.authors(birth_date);
CREATE INDEX IF NOT EXISTS idx_authors_status ON public.authors(status);
CREATE INDEX IF NOT EXISTS idx_authors_is_deleted ON public.authors(is_deleted);

-- Create trigger to update updated_date
CREATE OR REPLACE FUNCTION update_authors_updated_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_authors_updated_date ON public.authors;
CREATE TRIGGER trigger_update_authors_updated_date
    BEFORE UPDATE ON public.authors
    FOR EACH ROW
    EXECUTE FUNCTION update_authors_updated_date();

-- Add comments for documentation
COMMENT ON TABLE public.authors IS 'Table to store book authors information';
COMMENT ON COLUMN public.authors.id IS 'Primary key for authors';
COMMENT ON COLUMN public.authors.name IS 'Full name of the author';
COMMENT ON COLUMN public.authors.biography IS 'Brief biography of the author';
COMMENT ON COLUMN public.authors.birth_date IS 'Date of birth';
COMMENT ON COLUMN public.authors.death_date IS 'Date of death (if applicable)';
COMMENT ON COLUMN public.authors.nationality IS 'Nationality of the author';
COMMENT ON COLUMN public.authors.website IS 'Author official website';
COMMENT ON COLUMN public.authors.awards IS 'Awards and recognitions received';
COMMENT ON COLUMN public.authors.genres IS 'Genres the author writes in';
COMMENT ON COLUMN public.authors.profile_image_url IS 'URL to author profile image';
COMMENT ON COLUMN public.authors.status IS 'Active/inactive status of the author';
COMMENT ON COLUMN public.authors.is_deleted IS 'Soft delete flag';
COMMENT ON COLUMN public.authors.created_date IS 'Record creation timestamp';
COMMENT ON COLUMN public.authors.updated_date IS 'Record last update timestamp';

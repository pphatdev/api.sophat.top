-- public.ebooks definition

-- Drop table

-- DROP TABLE public.ebooks;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.ebooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    author_id INTEGER NOT NULL,
    publisher VARCHAR(255),
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    category VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    page_count INTEGER,
    file_size_mb DECIMAL(10,2),
    file_format VARCHAR(10) DEFAULT 'pdf',
    file_path VARCHAR(500),
    cover_image_url VARCHAR(500),
    price DECIMAL(10,2) DEFAULT 0.00,
    publication_date DATE,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    download_count INTEGER DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_date TIMESTAMP NOT NULL DEFAULT now(),
    updated_date TIMESTAMP DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ebooks_title ON public.ebooks(title);
CREATE INDEX IF NOT EXISTS idx_ebooks_author ON public.ebooks(author);
CREATE INDEX IF NOT EXISTS idx_ebooks_category ON public.ebooks(category);
CREATE INDEX IF NOT EXISTS idx_ebooks_status ON public.ebooks(status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_ebooks_isbn ON public.ebooks(isbn);
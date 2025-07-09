-- public.recommendations definition
-- Drop table
-- DROP TABLE public.recommendations;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE
    IF NOT EXISTS public.recommendations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        user_id BIGINT,
        book_id UUID NOT NULL,
        recommendation_type VARCHAR(50) NOT NULL DEFAULT 'similar', -- 'similar', 'popular', 'trending', 'personalized'
        recommendation_score DECIMAL(3, 2) DEFAULT 0.00 CHECK (
            recommendation_score >= 0
            AND recommendation_score <= 1
        ),
        reason TEXT, -- Why this book is recommended
        "status" BOOLEAN NOT NULL DEFAULT true,
        is_deleted BOOLEAN NOT NULL DEFAULT false,
        created_date TIMESTAMP NOT NULL DEFAULT now (),
        updated_date TIMESTAMP DEFAULT now (),
        CONSTRAINT fk_recommendations_book FOREIGN KEY (book_id) REFERENCES public.ebooks (id) ON DELETE CASCADE,
        CONSTRAINT fk_recommendations_user FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
    );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.recommendations (user_id);

CREATE INDEX IF NOT EXISTS idx_recommendations_book_id ON public.recommendations (book_id);

CREATE INDEX IF NOT EXISTS idx_recommendations_type ON public.recommendations (recommendation_type);

CREATE INDEX IF NOT EXISTS idx_recommendations_score ON public.recommendations (recommendation_score DESC);

CREATE INDEX IF NOT EXISTS idx_recommendations_status ON public.recommendations (status, is_deleted);

CREATE INDEX IF NOT EXISTS idx_recommendations_created ON public.recommendations (created_date DESC);

-- Create a unique constraint to prevent duplicate recommendations
CREATE UNIQUE INDEX IF NOT EXISTS idx_recommendations_unique ON public.recommendations (user_id, book_id, recommendation_type)
WHERE
    status = true
    AND is_deleted = false;
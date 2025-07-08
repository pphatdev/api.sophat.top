-- public.projects definition

-- Drop table

-- DROP TABLE public.projects;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS public.projects CASCADE;

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(255) NOT NULL,
	description TEXT,
	image VARCHAR(255),
	published BOOLEAN NOT NULL DEFAULT true,
	tags TEXT[],
	source JSONB,
	authors JSONB,
	languages TEXT[],
	is_deleted BOOLEAN NOT NULL DEFAULT false,
	status BOOLEAN NOT NULL DEFAULT true,
	created_date TIMESTAMP NOT NULL DEFAULT now(),
	updated_date TIMESTAMP DEFAULT now()
);
-- public.get_projects source
DROP VIEW IF EXISTS public.get_projects CASCADE;

CREATE
OR REPLACE VIEW public.get_projects AS
select
    p.id,
    "name",
    p.description,
    concat ('/api/v1/files/projects/', p.image) as image,
    p.published,
    p.tags,
    p."source",
    p.authors,
    p.languages,
    p.created_date,
    p.status,
    p.is_deleted
from
    projects p;
;
-- public.get_posts source
DROP VIEW IF EXISTS public.get_posts CASCADE;

CREATE OR REPLACE VIEW public.get_posts
AS SELECT p.id,
    p.title,
    p.slug,
    p.description,
    p.thumbnail,
    p.authors,
    p.published,
    p.created_at,
    p.updated_at,
    pc.content
FROM posts p
LEFT JOIN post_contents pc ON p.id = pc.parent_id
WHERE p.status = true AND p.is_deleted = false AND pc.content IS NOT NULL;
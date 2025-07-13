-- DROP FUNCTION public.get_book_recommendations(uuid, varchar, int4, varchar);

CREATE OR REPLACE FUNCTION public.get_book_recommendations(user_id_param uuid DEFAULT NULL::uuid, recommendation_type_param character varying DEFAULT 'similar'::character varying, limit_param integer DEFAULT 10, category_filter character varying DEFAULT NULL::character varying)
 RETURNS TABLE(id uuid, book_id uuid, title character varying, author_id integer, category character varying, rating numeric, recommendation_score numeric, reason text, image character varying, price numeric, authors json)
 LANGUAGE plpgsql
AS $function$
BEGIN
    CASE recommendation_type_param
        WHEN 'popular' THEN
            -- Return most downloaded books
            RETURN QUERY
            SELECT 
                e.id,
                e.id as book_id,
                e.title,
                e.author_id,
                e.category,
                e.rating,
                LEAST(e.download_count::DECIMAL / 1000, 1.0) as recommendation_score,
                'Popular book with high download count' as reason,
                e.cover_image_url as image,
                e.price,
                COALESCE(json_agg(json_build_object('id', a.id, 'name', a.name, 'biography', a.biography, 'image', a.profile_image_url)) FILTER (WHERE a.id IS NOT NULL), '[]'::json) as authors
            FROM public.ebooks e
            LEFT JOIN public.authors a ON a.id = e.author_id
            WHERE e.status = true 
                AND e.is_deleted = false
                AND (category_filter IS NULL OR e.category ILIKE '%' || category_filter || '%')
            GROUP BY e.id, e.title, e.author_id, e.category, e.rating, e.download_count, e.cover_image_url, e.price
            ORDER BY e.download_count DESC, e.rating DESC
            LIMIT limit_param;

        WHEN 'trending' THEN
            -- Return recently published books with good ratings
            RETURN QUERY
            SELECT 
                e.id,
                e.id as book_id,
                e.title,
                e.author_id,
                e.category,
                e.rating,
                LEAST((e.rating / 5.0) * (1.0 - EXTRACT(DAYS FROM (NOW() - e.created_date))::DECIMAL / 365), 1.0) as recommendation_score,
                'Trending book with recent publication and good rating' as reason,
                e.cover_image_url as image,
                e.price,
                COALESCE(json_agg(json_build_object('id', a.id, 'name', a.name, 'biography', a.biography, 'image', a.profile_image_url)) FILTER (WHERE a.id IS NOT NULL), '[]'::json) as authors
            FROM public.ebooks e
            LEFT JOIN public.authors a ON a.id = e.author_id
            WHERE e.status = true 
                AND e.is_deleted = false
                AND e.created_date >= NOW() - INTERVAL '6 months'
                AND (category_filter IS NULL OR e.category ILIKE '%' || category_filter || '%')
            GROUP BY e.id, e.title, e.author_id, e.category, e.rating, e.created_date, e.cover_image_url, e.price
            ORDER BY e.created_date DESC, e.rating DESC
            LIMIT limit_param;

        WHEN 'similar' THEN
            -- Return books from similar categories based on user's reading history or category filter
            RETURN QUERY
            WITH user_categories AS (
                SELECT DISTINCT e.category
                FROM public.ebooks e
                WHERE e.status = true 
                    AND e.is_deleted = false
                    AND (category_filter IS NOT NULL OR user_id_param IS NULL)
                    AND (category_filter IS NULL OR e.category ILIKE '%' || category_filter || '%')
                LIMIT 5
            )
            SELECT 
                e.id,
                e.id as book_id,
                e.title,
                e.author_id,
                e.category,
                e.rating,
                (e.rating / 5.0) as recommendation_score,
                'Similar category recommendation' as reason,
                e.cover_image_url as image,
                e.price,
                COALESCE(json_agg(json_build_object('id', a.id, 'name', a.name, 'biography', a.biography, 'image', a.profile_image_url)) FILTER (WHERE a.id IS NOT NULL), '[]'::json) as authors
            FROM public.ebooks e
            LEFT JOIN public.authors a ON a.id = e.author_id
            WHERE e.status = true 
                AND e.is_deleted = false
                AND (
                    e.category IN (SELECT category FROM user_categories) OR
                    (category_filter IS NOT NULL AND e.category ILIKE '%' || category_filter || '%')
                )
            GROUP BY e.id, e.title, e.author_id, e.category, e.rating, e.download_count, e.cover_image_url, e.price
            ORDER BY e.rating DESC, e.download_count DESC
            LIMIT limit_param;

        WHEN 'personalized' THEN
            -- Return existing recommendations for the user or general recommendations
            RETURN QUERY
            SELECT 
                r.id,
                r.book_id,
                r.title,
                r.author_id,
                r.category,
                r.rating,
                r.recommendation_score,
                r.reason,
                r.cover_image_url as image,
                r.price,
                COALESCE(json_agg(json_build_object('id', a.id, 'name', a.name, 'biography', a.biography, 'image', a.profile_image_url)) FILTER (WHERE a.id IS NOT NULL), '[]'::json) as authors
            FROM public.get_recommendations r
            LEFT JOIN public.authors a ON a.id = r.author_id
            WHERE (user_id_param IS NULL OR r.user_id = user_id_param OR r.user_id IS NULL)
                AND (category_filter IS NULL OR r.category ILIKE '%' || category_filter || '%')
            GROUP BY r.id, r.book_id, r.title, r.author_id, r.category, r.rating, r.recommendation_score, r.reason, r.cover_image_url, r.price, r.created_date
            ORDER BY r.recommendation_score DESC, r.created_date DESC
            LIMIT limit_param;

        ELSE
            -- Default to popular recommendations
            RETURN QUERY
            SELECT 
                e.id,
                e.id as book_id,
                e.title,
                e.author_id,
                e.category,
                e.rating,
                (e.rating / 5.0) as recommendation_score,
                'Default recommendation' as reason,
                e.cover_image_url as image,
                e.price,
                COALESCE(json_agg(json_build_object('id', a.id, 'name', a.name, 'biography', a.biography, 'image', a.profile_image_url)) FILTER (WHERE a.id IS NOT NULL), '[]'::json) as authors
            FROM public.ebooks e
            LEFT JOIN public.authors a ON a.id = e.author_id
            WHERE e.status = true 
                AND e.is_deleted = false
                AND (category_filter IS NULL OR e.category ILIKE '%' || category_filter || '%')
            GROUP BY e.id, e.title, e.author_id, e.category, e.rating, e.download_count, e.cover_image_url, e.price
            ORDER BY e.rating DESC, e.download_count DESC
            LIMIT limit_param;
    END CASE;
END;
$function$
;

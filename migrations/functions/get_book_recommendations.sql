-- Function to generate book recommendations based on different algorithms
CREATE OR REPLACE FUNCTION public.get_book_recommendations(
    user_id_param BIGINT = NULL,
    recommendation_type_param VARCHAR(50) = 'similar',
    limit_param INTEGER = 10,
    category_filter VARCHAR(100) = NULL
) RETURNS TABLE (
    id UUID,
    book_id UUID,
    title VARCHAR(255),
    author VARCHAR(255),
    category VARCHAR(100),
    rating DECIMAL(3,2),
    recommendation_score DECIMAL(3,2),
    reason TEXT,
    cover_image_url VARCHAR(500),
    price DECIMAL(10,2)
) AS $$
BEGIN
    CASE recommendation_type_param
        WHEN 'popular' THEN
            -- Return most downloaded books
            RETURN QUERY
            SELECT 
                gen_random_uuid() as id,
                e.id as book_id,
                e.title,
                e.author,
                e.category,
                e.rating,
                LEAST(e.download_count::DECIMAL / 1000, 1.0) as recommendation_score,
                'Popular book with high download count' as reason,
                e.cover_image_url,
                e.price
            FROM public.ebooks e
            WHERE e.status = true 
                AND e.is_deleted = false
                AND (category_filter IS NULL OR e.category ILIKE '%' || category_filter || '%')
            ORDER BY e.download_count DESC, e.rating DESC
            LIMIT limit_param;

        WHEN 'trending' THEN
            -- Return recently published books with good ratings
            RETURN QUERY
            SELECT 
                gen_random_uuid() as id,
                e.id as book_id,
                e.title,
                e.author,
                e.category,
                e.rating,
                LEAST((e.rating / 5.0) * (1.0 - EXTRACT(DAYS FROM (NOW() - e.created_date))::DECIMAL / 365), 1.0) as recommendation_score,
                'Trending book with recent publication and good rating' as reason,
                e.cover_image_url,
                e.price
            FROM public.ebooks e
            WHERE e.status = true 
                AND e.is_deleted = false
                AND e.created_date >= NOW() - INTERVAL '6 months'
                AND (category_filter IS NULL OR e.category ILIKE '%' || category_filter || '%')
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
                gen_random_uuid() as id,
                e.id as book_id,
                e.title,
                e.author,
                e.category,
                e.rating,
                (e.rating / 5.0) as recommendation_score,
                'Similar category recommendation' as reason,
                e.cover_image_url,
                e.price
            FROM public.ebooks e
            WHERE e.status = true 
                AND e.is_deleted = false
                AND (
                    e.category IN (SELECT category FROM user_categories) OR
                    (category_filter IS NOT NULL AND e.category ILIKE '%' || category_filter || '%')
                )
            ORDER BY e.rating DESC, e.download_count DESC
            LIMIT limit_param;

        WHEN 'personalized' THEN
            -- Return existing recommendations for the user or general recommendations
            RETURN QUERY
            SELECT 
                r.id,
                r.book_id,
                r.title,
                r.author,
                r.category,
                r.rating,
                r.recommendation_score,
                r.reason,
                r.cover_image_url,
                r.price
            FROM public.get_recommendations r
            WHERE (user_id_param IS NULL OR r.user_id = user_id_param OR r.user_id IS NULL)
                AND (category_filter IS NULL OR r.category ILIKE '%' || category_filter || '%')
            ORDER BY r.recommendation_score DESC, r.created_date DESC
            LIMIT limit_param;

        ELSE
            -- Default to popular recommendations
            RETURN QUERY
            SELECT 
                gen_random_uuid() as id,
                e.id as book_id,
                e.title,
                e.author,
                e.category,
                e.rating,
                (e.rating / 5.0) as recommendation_score,
                'Default recommendation' as reason,
                e.cover_image_url,
                e.price
            FROM public.ebooks e
            WHERE e.status = true 
                AND e.is_deleted = false
                AND (category_filter IS NULL OR e.category ILIKE '%' || category_filter || '%')
            ORDER BY e.rating DESC, e.download_count DESC
            LIMIT limit_param;
    END CASE;
END;
$$ LANGUAGE plpgsql;

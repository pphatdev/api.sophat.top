-- Function to insert a new recommendation
CREATE OR REPLACE FUNCTION public.insert_recommendation(
    user_id_param BIGINT,
    book_id_param UUID,
    recommendation_type_param VARCHAR(50) = 'similar',
    recommendation_score_param DECIMAL(3,2) = 0.00,
    reason_param TEXT = NULL
) RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    -- Check if book exists
    IF NOT EXISTS (SELECT 1 FROM public.ebooks WHERE id = book_id_param AND status = true AND is_deleted = false) THEN
        RAISE EXCEPTION 'Book with ID % not found or inactive', book_id_param;
    END IF;

    -- Check if user exists (optional, can be NULL for general recommendations)
    IF user_id_param IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.users WHERE id = user_id_param AND status = true AND is_deleted = false) THEN
        RAISE EXCEPTION 'User with ID % not found or inactive', user_id_param;
    END IF;

    -- Insert the recommendation
    INSERT INTO public.recommendations(
        user_id,
        book_id,
        recommendation_type,
        recommendation_score,
        reason
    ) VALUES (
        user_id_param,
        book_id_param,
        recommendation_type_param,
        recommendation_score_param,
        reason_param
    ) RETURNING id INTO new_id;

    RETURN new_id;
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Recommendation already exists for this user and book';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inserting recommendation: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

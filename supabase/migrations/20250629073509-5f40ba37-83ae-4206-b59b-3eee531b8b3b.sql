
-- تحديث الحالات المسموحة للأنشطة لتشمل "in_progress"
ALTER TABLE public.activities 
DROP CONSTRAINT IF EXISTS activities_status_check;

ALTER TABLE public.activities 
ADD CONSTRAINT activities_status_check 
CHECK (status IN ('preparing', 'in_progress', 'completed', 'cancelled'));

-- تحديث جدول profiles لدعم المستخدمين بدون بريد إلكتروني
ALTER TABLE public.profiles 
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT;

-- تحديث دالة إنشاء المستخدمين لدعم إنشاء المستخدمين بدون بريد إلكتروني
CREATE OR REPLACE FUNCTION public.create_user_without_auth(
    input_username TEXT,
    input_email TEXT DEFAULT NULL,
    input_phone TEXT DEFAULT NULL,
    input_is_admin BOOLEAN DEFAULT false
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id UUID;
    existing_user TEXT;
BEGIN
    -- التحقق من وجود اسم المستخدم
    SELECT username INTO existing_user
    FROM public.profiles 
    WHERE username = input_username;
    
    IF existing_user IS NOT NULL THEN
        RAISE EXCEPTION 'Username % already exists', input_username;
    END IF;
    
    -- التحقق من وجود البريد الإلكتروني إذا تم توفيره
    IF input_email IS NOT NULL THEN
        SELECT username INTO existing_user
        FROM public.profiles 
        WHERE email = input_email;
        
        IF existing_user IS NOT NULL THEN
            RAISE EXCEPTION 'Email % already exists', input_email;
        END IF;
    END IF;
    
    -- توليد معرف فريد جديد
    new_user_id := gen_random_uuid();
    
    -- إنشاء ملف المستخدم في profiles
    INSERT INTO public.profiles (
        id,
        username,
        email,
        phone,
        is_admin,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        input_username,
        input_email,
        input_phone,
        input_is_admin,
        now(),
        now()
    );
    
    RETURN new_user_id;
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'User creation failed: duplicate data found';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'User creation failed: %', SQLERRM;
END;
$$;

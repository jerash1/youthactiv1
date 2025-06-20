
-- تحديث دالة إنشاء المستخدم لتجنب تعارض المفاتيح
CREATE OR REPLACE FUNCTION public.create_user_with_password(
    input_username TEXT,
    input_email TEXT,
    input_password TEXT,
    input_is_admin BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id UUID;
    encrypted_password TEXT;
    existing_user_id UUID;
BEGIN
    -- التحقق من وجود المستخدم بنفس البريد الإلكتروني
    SELECT id INTO existing_user_id
    FROM auth.users 
    WHERE email = input_email;
    
    -- إذا كان المستخدم موجوداً، إرجاع خطأ
    IF existing_user_id IS NOT NULL THEN
        RAISE EXCEPTION 'User with email % already exists', input_email;
    END IF;
    
    -- التحقق من وجود اسم المستخدم
    SELECT id INTO existing_user_id
    FROM public.profiles 
    WHERE username = input_username;
    
    -- إذا كان اسم المستخدم موجوداً، إرجاع خطأ
    IF existing_user_id IS NOT NULL THEN
        RAISE EXCEPTION 'Username % already exists', input_username;
    END IF;
    
    -- توليد معرف فريد جديد
    new_user_id := gen_random_uuid();
    
    -- تشفير كلمة المرور
    encrypted_password := encrypt_password(input_password);
    
    -- إنشاء مستخدم جديد في auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data
    ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        input_email,
        crypt(input_password, gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('username', input_username)
    );
    
    -- إنشاء ملف المستخدم في profiles
    INSERT INTO public.profiles (
        id,
        username,
        is_admin,
        password_hash,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        input_username,
        input_is_admin,
        encrypted_password,
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

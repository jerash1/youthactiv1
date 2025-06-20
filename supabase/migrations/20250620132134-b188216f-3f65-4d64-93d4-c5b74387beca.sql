
-- إضافة عمود password_hash إلى جدول profiles لتخزين كلمات المرور
ALTER TABLE public.profiles ADD COLUMN password_hash TEXT;

-- إنشاء دالة للتحقق من كلمة المرور
CREATE OR REPLACE FUNCTION public.verify_user_password(input_username TEXT, input_password TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
BEGIN
    SELECT id INTO user_id
    FROM public.profiles
    WHERE username = input_username 
    AND password_hash = crypt(input_password, password_hash);
    
    RETURN user_id;
END;
$$;

-- إنشاء دالة لتشفير كلمة المرور
CREATE OR REPLACE FUNCTION public.encrypt_password(password TEXT)
RETURNS TEXT
LANGUAGE sql
AS $$
    SELECT crypt(password, gen_salt('bf'));
$$;

-- إدراج المستخدم المدير الافتراضي
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'khaled@admin.local',
    crypt('k87654321k@', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"khaled"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT DO NOTHING;

-- إدراج ملف المستخدم المدير في جدول profiles
INSERT INTO public.profiles (
    id,
    username,
    is_admin,
    password_hash,
    created_at,
    updated_at
) 
SELECT 
    au.id,
    'khaled',
    true,
    encrypt_password('k87654321k@'),
    now(),
    now()
FROM auth.users au 
WHERE au.email = 'khaled@admin.local'
ON CONFLICT (id) DO UPDATE SET
    is_admin = true,
    password_hash = encrypt_password('k87654321k@');

-- تحديث دالة إنشاء المستخدم الجديد لتتعامل مع كلمة المرور
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
BEGIN
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
        gen_random_uuid(),
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
    ) RETURNING id INTO new_user_id;
    
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
END;
$$;

-- تمكين امتداد pgcrypto إذا لم يكن موجوداً
CREATE EXTENSION IF NOT EXISTS pgcrypto;

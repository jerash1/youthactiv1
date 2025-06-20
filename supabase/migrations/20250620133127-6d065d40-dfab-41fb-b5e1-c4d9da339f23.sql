
-- حذف السياسات الموجودة أولاً
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- إنشاء دالة مساعدة للتحقق من صلاحيات المدير لتجنب التكرار اللانهائي
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT COALESCE(
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
        false
    );
$$;

-- سياسة للسماح للجميع بقراءة الملفات الشخصية (مؤقتاً لحل مشكلة تسجيل الدخول)
CREATE POLICY "Allow read access for authentication" ON public.profiles
    FOR SELECT USING (true);

-- سياسة للسماح بإدراج الملفات الشخصية للمدراء أو عند إنشاء حساب جديد
CREATE POLICY "Allow insert for admins or new users" ON public.profiles
    FOR INSERT WITH CHECK (
        public.is_admin_user() OR auth.uid() = id
    );

-- سياسة للسماح للمدراء بتحديث الملفات الشخصية
CREATE POLICY "Allow update for admins" ON public.profiles
    FOR UPDATE USING (public.is_admin_user());

-- سياسة للسماح للمدراء بحذف المستخدمين
CREATE POLICY "Allow delete for admins" ON public.profiles
    FOR DELETE USING (public.is_admin_user());

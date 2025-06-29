import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";

export type AppUser = {
  id: string;
  username: string;
  isAdmin: boolean;
};

export type Profile = {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

type UserCredentials = {
  username: string;
  password: string;
};

interface AuthContextType {
  user: AppUser | null;
  users: Profile[];
  login: (credentials: UserCredentials) => Promise<boolean>;
  logout: () => void;
  createUser: (username: string, email: string, password: string, isAdmin: boolean) => Promise<boolean>;
  createUserWithoutAuth: (username: string, email?: string, phone?: string, isAdmin?: boolean) => Promise<boolean>;
  updateUser: (id: string, userData: { username: string; password?: string; isAdmin: boolean }) => Promise<boolean>;
  deleteUser: (id: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // جلب بيانات المستخدم من جدول profiles
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // جلب جميع المستخدمين (للمدراء فقط)
  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error("خطأ في جلب بيانات المستخدمين");
        return;
      }

      setUsers(profiles || []);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error("خطأ في جلب بيانات المستخدمين");
    }
  };

  // تسجيل الدخول باستخدام اسم المستخدم
  const login = async (credentials: UserCredentials): Promise<boolean> => {
    try {
      // التحقق من اسم المستخدم وكلمة المرور باستخدام دالة قاعدة البيانات
      const { data, error } = await supabase.rpc('verify_user_password', {
        input_username: credentials.username,
        input_password: credentials.password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error("خطأ في تسجيل الدخول");
        return false;
      }

      if (!data) {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
        return false;
      }

      // جلب بيانات المستخدم
      const profile = await fetchUserProfile(data);
      if (profile) {
        setUser({
          id: profile.id,
          username: profile.username,
          isAdmin: profile.is_admin
        });
        toast.success("تم تسجيل الدخول بنجاح");
        navigate('/');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("خطأ في تسجيل الدخول");
      return false;
    }
  };

  // إنشاء مستخدم جديد (للمدراء فقط)
  const createUser = async (username: string, email: string, password: string, isAdmin: boolean): Promise<boolean> => {
    try {
      // استخدام دالة قاعدة البيانات لإنشاء المستخدم
      const { data, error } = await supabase.rpc('create_user_with_password', {
        input_username: username,
        input_email: email,
        input_password: password,
        input_is_admin: isAdmin
      });

      if (error) {
        console.error('Create user error:', error);
        
        // عرض رسائل خطأ أكثر وضوحاً
        if (error.message.includes('already exists')) {
          if (error.message.includes('email')) {
            toast.error("البريد الإلكتروني مستخدم بالفعل");
          } else if (error.message.includes('Username')) {
            toast.error("اسم المستخدم مستخدم بالفعل");
          } else {
            toast.error("البيانات مستخدمة بالفعل");
          }
        } else if (error.message.includes('duplicate data')) {
          toast.error("البيانات مكررة - يرجى المحاولة ببيانات مختلفة");
        } else {
          toast.error("خطأ في إنشاء المستخدم: " + error.message);
        }
        return false;
      }

      if (data) {
        // تحديث قائمة المستخدمين
        await fetchUsers();
        toast.success("تم إنشاء المستخدم بنجاح");
        return true;
      }

      return false;
    } catch (error) {
      console.error('Create user error:', error);  
      toast.error("خطأ في إنشاء المستخدم");
      return false;
    }
  };

  // إنشاء مستخدم بدون تسجيل دخول (للمدراء فقط)
  const createUserWithoutAuth = async (username: string, email?: string, phone?: string, isAdmin: boolean = false): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('create_user_without_auth', {
        input_username: username,
        input_email: email || null,
        input_phone: phone || null,
        input_is_admin: isAdmin
      });

      if (error) {
        console.error('Create user without auth error:', error);
        
        if (error.message.includes('already exists')) {
          if (error.message.includes('email')) {
            toast.error("البريد الإلكتروني مستخدم بالفعل");
          } else if (error.message.includes('Username')) {
            toast.error("اسم المستخدم مستخدم بالفعل");
          } else {
            toast.error("البيانات مستخدمة بالفعل");
          }
        } else {
          toast.error("خطأ في إنشاء المستخدم: " + error.message);
        }
        return false;
      }

      if (data) {
        await fetchUsers();
        toast.success("تم إنشاء المستخدم بنجاح");
        return true;
      }

      return false;
    } catch (error) {
      console.error('Create user without auth error:', error);
      toast.error("خطأ في إنشاء المستخدم");
      return false;
    }
  };

  // تحديث بيانات مستخدم
  const updateUser = async (id: string, userData: { username: string; password?: string; isAdmin: boolean }): Promise<boolean> => {
    try {
      // تحديث اسم المستخدم والصلاحيات في جدول profiles
      const updateData: any = {
        username: userData.username,
        is_admin: userData.isAdmin,
        updated_at: new Date().toISOString()
      };

      // إذا تم توفير كلمة مرور جديدة، قم بتشفيرها وإضافتها
      if (userData.password && userData.password.trim()) {
        const { data: hashedPassword, error: hashError } = await supabase.rpc('encrypt_password', {
          password: userData.password
        });

        if (hashError) {
          console.error('Password encryption error:', hashError);
          toast.error("خطأ في تشفير كلمة المرور");
          return false;
        }

        updateData.password_hash = hashedPassword;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Update user error:', error);
        
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          toast.error("اسم المستخدم مستخدم بالفعل");
        } else {
          toast.error("خطأ في تحديث بيانات المستخدم: " + error.message);
        }
        return false;
      }

      // تحديث قائمة المستخدمين
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      toast.error("خطأ في تحديث بيانات المستخدم");
      return false;
    }
  };

  // تسجيل الخروج
  const logout = async () => {
    try {
      setUser(null);
      toast.success("تم تسجيل الخروج بنجاح");
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("خطأ في تسجيل الخروج");
    }
  };

  // حذف مستخدم
  const deleteUser = async (id: string) => {
    try {
      if (user?.id === id) {
        toast.error("لا يمكن حذف المستخدم الحالي");
        return;
      }

      // حذف من جدول profiles
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete user error:', error);
        toast.error("خطأ في حذف المستخدم: " + error.message);
        return;
      }

      // تحديث قائمة المستخدمين
      await fetchUsers();
      toast.success("تم حذف المستخدم بنجاح");
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error("خطأ في حذف المستخدم");
    }
  };

  // التحقق من وجود جلسة نشطة عند تحميل التطبيق
  useEffect(() => {
    setLoading(false);
  }, []);

  // جلب المستخدمين عند تسجيل الدخول كمدير
  useEffect(() => {
    if (user?.isAdmin) {
      fetchUsers();
    }
  }, [user?.isAdmin]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      logout, 
      createUser,
      createUserWithoutAuth,
      updateUser,
      deleteUser, 
      fetchUsers, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

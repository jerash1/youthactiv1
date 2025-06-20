
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export type AppUser = {
  id: string;
  username: string;
  isAdmin: boolean;
  email?: string;
};

export type Profile = {
  id: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

type UserCredentials = {
  email: string;
  password: string;
};

interface AuthContextType {
  user: AppUser | null;
  users: Profile[];
  login: (credentials: UserCredentials) => Promise<boolean>;
  logout: () => void;
  createUser: (email: string, password: string, username: string, isAdmin: boolean) => Promise<boolean>;
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

  // تسجيل الدخول
  const login = async (credentials: UserCredentials): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error("خطأ في تسجيل الدخول: " + error.message);
        return false;
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUser({
            id: profile.id,
            username: profile.username,
            isAdmin: profile.is_admin,
            email: data.user.email
          });
          toast.success("تم تسجيل الدخول بنجاح");
          navigate('/');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("خطأ في تسجيل الدخول");
      return false;
    }
  };

  // إنشاء مستخدم جديد (للمدراء فقط)
  const createUser = async (email: string, password: string, username: string, isAdmin: boolean): Promise<boolean> => {
    try {
      // إنشاء المستخدم في Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: {
          username: username
        },
        email_confirm: true // تأكيد البريد الإلكتروني تلقائياً
      });

      if (error) {
        console.error('Create user error:', error);
        toast.error("خطأ في إنشاء المستخدم: " + error.message);
        return false;
      }

      if (data.user) {
        // تحديث صلاحيات المدير إذا لزم الأمر
        if (isAdmin) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Update admin status error:', updateError);
            toast.error("تم إنشاء المستخدم ولكن فشل في تحديث صلاحيات المدير");
          }
        }

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

  // تسجيل الخروج
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error("خطأ في تسجيل الخروج");
        return;
      }

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

      // حذف من جدول profiles سيؤدي إلى حذف المستخدم من auth.users تلقائياً
      const { error } = await supabase.auth.admin.deleteUser(id);

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

  // مراقبة حالة المصادقة
  useEffect(() => {
    let mounted = true;

    // إعداد مستمع تغيير حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile && mounted) {
            setUser({
              id: profile.id,
              username: profile.username,
              isAdmin: profile.is_admin,
              email: session.user.email
            });
          }
        } else {
          if (mounted) {
            setUser(null);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // التحقق من الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profile => {
          if (profile && mounted) {
            setUser({
              id: profile.id,
              username: profile.username,
              isAdmin: profile.is_admin,
              email: session.user.email
            });
          }
          if (mounted) {
            setLoading(false);
          }
        });
      } else {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
      deleteUser, 
      fetchUsers, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type User = {
  id: string;
  username: string;
  isAdmin: boolean;
};

// Create a separate type that includes password for internal use
type UserWithPassword = User & {
  password: string;
};

type UserCredentials = {
  username: string;
  password: string;
};

interface AuthContextType {
  user: User | null;
  users: UserWithPassword[];
  login: (credentials: UserCredentials) => boolean;
  logout: () => void;
  addUser: (user: UserCredentials & { isAdmin?: boolean }) => void;
  deleteUser: (id: string) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserWithPassword[]>(() => {
    const savedUsers = localStorage.getItem("users");
    const initialUsers = savedUsers 
      ? JSON.parse(savedUsers) 
      : [{ id: "1", username: "admin", password: "admin", isAdmin: true }];
    return initialUsers;
  });
  const navigate = useNavigate();

  // حفظ المستخدمين في التخزين المحلي عند تغييرهم
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // تحقق من وجود مستخدم مسجل الدخول عند تحميل التطبيق
  useEffect(() => {
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  // تسجيل الدخول
  const login = (credentials: UserCredentials): boolean => {
    const { username, password } = credentials;
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      // Create a user object without the password
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      toast.success("تم تسجيل الدخول بنجاح");
      navigate('/');
      return true;
    }
    
    toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
    return false;
  };

  // تسجيل الخروج
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    toast.success("تم تسجيل الخروج بنجاح");
    navigate('/login');
  };

  // إضافة مستخدم جديد
  const addUser = (newUser: UserCredentials & { isAdmin?: boolean }) => {
    const userExists = users.some(u => u.username === newUser.username);
    
    if (userExists) {
      toast.error("اسم المستخدم موجود بالفعل");
      return;
    }
    
    const userToAdd = {
      id: Date.now().toString(),
      username: newUser.username,
      password: newUser.password,
      isAdmin: newUser.isAdmin || false
    };
    
    setUsers([...users, userToAdd]);
    toast.success("تم إضافة المستخدم بنجاح");
  };

  // حذف مستخدم
  const deleteUser = (id: string) => {
    if (user?.id === id) {
      toast.error("لا يمكن حذف المستخدم الحالي");
      return;
    }
    
    setUsers(users.filter(u => u.id !== id));
    toast.success("تم حذف المستخدم بنجاح");
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, addUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

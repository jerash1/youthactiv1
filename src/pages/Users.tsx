
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Trash, UserPlus, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";

const Users = () => {
  const { user, users, deleteUser, fetchUsers, loading } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // جلب المستخدمين عند تحميل الصفحة
  useEffect(() => {
    if (user?.isAdmin) {
      fetchUsers();
    }
  }, [user?.isAdmin, fetchUsers]);

  // التحقق من الصلاحيات
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    toast.error("ليس لديك صلاحية للوصول إلى هذه الصفحة");
    return <Navigate to="/" />;
  }

  const handleAddUser = async () => {
    if (!newEmail || !newPassword) {
      toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    
    setCreateLoading(true);
    
    try {
      // إنشاء المستخدم في Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: newEmail,
        password: newPassword,
        user_metadata: {
          username: newUsername || newEmail.split('@')[0]
        },
        email_confirm: true // تأكيد البريد الإلكتروني تلقائياً
      });

      if (error) {
        console.error('Create user error:', error);
        toast.error("خطأ في إنشاء المستخدم: " + error.message);
        return;
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
        
        // إعادة تعيين النموذج
        setNewEmail("");
        setNewPassword("");
        setNewUsername("");
        setIsAdmin(false);
        setDialogOpen(false);
        
        toast.success("تم إنشاء المستخدم بنجاح");
      }
    } catch (error) {
      console.error('Create user error:', error);
      toast.error("خطأ في إنشاء المستخدم");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      await deleteUser(userId);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            <span>إدارة المستخدمين</span>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus size={16} />
                  <span>إضافة مستخدم جديد</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات المستخدم الجديد هنا.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">اسم المستخدم</label>
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="أدخل اسم المستخدم (اختياري)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">كلمة المرور</label>
                    <Input
                      id="password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin" 
                      checked={isAdmin} 
                      onCheckedChange={(checked) => setIsAdmin(checked === true)}
                    />
                    <label htmlFor="admin" className="text-sm font-medium pr-2">
                      مستخدم بصلاحيات إدارية
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleAddUser}
                    disabled={createLoading}
                  >
                    {createLoading ? "جاري الإنشاء..." : "حفظ"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            إدارة حسابات المستخدمين وصلاحياتهم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المستخدم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الصلاحيات</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {profile.is_admin ? (
                      <Shield size={16} className="text-purple-600" />
                    ) : (
                      <User size={16} className="text-green-600" />
                    )}
                    {profile.username}
                  </TableCell>
                  <TableCell>{profile.id}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      profile.is_admin 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {profile.is_admin ? "مدير" : "مستخدم عادي"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(profile.created_at).toLocaleDateString('ar')}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteUser(profile.id)}
                      disabled={profile.id === user.id}
                      className="flex items-center gap-1"
                    >
                      <Trash size={14} />
                      <span>حذف</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t p-4 text-sm text-gray-500">
          لا يمكن حذف المستخدم الحالي الذي تم تسجيل الدخول به.
        </CardFooter>
      </Card>
    </div>
  );
};

export default Users;

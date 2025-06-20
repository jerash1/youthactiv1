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
import { Trash, UserPlus, Shield, User, Eye, EyeOff, Edit } from "lucide-react";
import { toast } from "sonner";
import EditUserDialog from "../components/EditUserDialog";

const Users = () => {
  const { user, users, deleteUser, fetchUsers, createUser, updateUser, loading } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

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
    if (!newEmail || !newPassword || !newUsername) {
      toast.error("يرجى إدخال جميع البيانات المطلوبة");
      return;
    }
    
    setCreateLoading(true);
    
    try {
      const success = await createUser(newUsername, newEmail, newPassword, isAdmin);
      
      if (success) {
        // إعادة تعيين النموذج
        setNewEmail("");
        setNewPassword("");
        setNewUsername("");
        setIsAdmin(false);
        setShowPassword(false);
        setDialogOpen(false);
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      await deleteUser(userId);
    }
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (userData) => {
    setEditLoading(true);
    try {
      if (updateUser) {
        const success = await updateUser(editingUser.id, userData);
        if (success) {
          toast.success("تم تحديث بيانات المستخدم بنجاح");
          await fetchUsers();
        }
      } else {
        toast.error("وظيفة التحديث غير متوفرة حالياً");
      }
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl lg:text-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                      placeholder="أدخل اسم المستخدم"
                      required
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">كلمة المرور</label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">اسم المستخدم</TableHead>
                  <TableHead className="hidden sm:table-cell">البريد الإلكتروني</TableHead>
                  <TableHead>الصلاحيات</TableHead>
                  <TableHead className="hidden md:table-cell">تاريخ الإنشاء</TableHead>
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
                    <TableCell className="hidden sm:table-cell">{profile.id}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        profile.is_admin 
                          ? "bg-purple-100 text-purple-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {profile.is_admin ? "مدير" : "مستخدم عادي"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(profile.created_at).toLocaleDateString('ar')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditUser(profile)}
                          className="flex items-center gap-1 w-full sm:w-auto"
                        >
                          <Edit size={14} />
                          <span>تعديل</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteUser(profile.id)}
                          disabled={profile.id === user.id}
                          className="flex items-center gap-1 w-full sm:w-auto"
                        >
                          <Trash size={14} />
                          <span>حذف</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 text-sm text-gray-500">
          لا يمكن حذف المستخدم الحالي الذي تم تسجيل الدخول به.
        </CardFooter>
      </Card>

      {/* Edit User Dialog */}
      <EditUserDialog
        user={editingUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
        loading={editLoading}
      />
    </div>
  );
};

export default Users;

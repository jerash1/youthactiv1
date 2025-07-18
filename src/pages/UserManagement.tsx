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

const UserManagement = () => {
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

  const adminUsers = users.filter(u => u.is_admin);
  const regularUsers = users.filter(u => !u.is_admin);

  return (
    <div className="container mx-auto py-4 px-4 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي المستخدمين</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-800">{users.length}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">المدراء</p>
                <p className="text-2xl lg:text-3xl font-bold text-purple-800">{adminUsers.length}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">المستخدمين العاديين</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-800">{regularUsers.length}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Card */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-xl lg:text-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span>إدارة المستخدمين والمدراء</span>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg w-full sm:w-auto">
                  <UserPlus size={16} className="ml-2" />
                  <span>إضافة مستخدم جديد</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="text-xl">إضافة مستخدم جديد</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات المستخدم الجديد وحدد صلاحياته.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">اسم المستخدم</label>
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="أدخل اسم المستخدم"
                      className="w-full"
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
                      className="w-full"
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
                        className="w-full pr-10"
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
                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                    <Checkbox 
                      id="admin" 
                      checked={isAdmin} 
                      onCheckedChange={(checked) => setIsAdmin(checked === true)}
                    />
                    <label htmlFor="admin" className="text-sm font-medium pr-2 flex items-center">
                      <Shield size={16} className="ml-2 text-purple-600" />
                      مستخدم بصلاحيات إدارية
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleAddUser}
                    disabled={createLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {createLoading ? "جاري الإنشاء..." : "حفظ المستخدم"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription className="text-blue-100">
            إدارة حسابات المستخدمين وصلاحياتهم في النظام
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-700 min-w-[120px]">اسم المستخدم</TableHead>
                  <TableHead className="font-bold text-gray-700 min-w-[100px]">نوع الحساب</TableHead>
                  <TableHead className="font-bold text-gray-700 min-w-[150px] hidden sm:table-cell">الصلاحيات</TableHead>
                  <TableHead className="font-bold text-gray-700 min-w-[120px] hidden md:table-cell">تاريخ الإنشاء</TableHead>
                  <TableHead className="font-bold text-gray-700 min-w-[120px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((profile) => (
                  <TableRow key={profile.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-800">{profile.username}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {profile.is_admin ? (
                          <>
                            <Shield size={16} className="ml-2 text-purple-600" />
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                              مدير
                            </span>
                          </>
                        ) : (
                          <>
                            <User size={16} className="ml-2 text-green-600" />
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                              مستخدم عادي
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 hidden sm:table-cell">
                      {profile.is_admin ? "إدارة كاملة للنظام" : "عرض وإدارة الأنشطة"}
                    </TableCell>
                    <TableCell className="text-gray-600 hidden md:table-cell">
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
        <CardFooter className="border-t bg-gray-50 p-4 text-sm text-gray-500 rounded-b-lg">
          <div className="flex items-center">
            <Shield size={16} className="ml-2 text-amber-500" />
            <span>لا يمكن حذف المستخدم الحالي الذي تم تسجيل الدخول به.</span>
          </div>
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

export default UserManagement;

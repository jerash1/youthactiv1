
import React, { useState } from "react";
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
import { Trash, UserPlus } from "lucide-react";
import { toast } from "sonner";

const Users = () => {
  const { user, users, addUser, deleteUser } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // إذا لم يكن المستخدم مسجل الدخول أو ليس لديه صلاحيات الإدارة، توجيهه إلى صفحة تسجيل الدخول
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    toast.error("ليس لديك صلاحية للوصول إلى هذه الصفحة");
    return <Navigate to="/" />;
  }

  const handleAddUser = () => {
    if (!newUsername || !newPassword) {
      toast.error("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }
    
    addUser({ username: newUsername, password: newPassword, isAdmin });
    setNewUsername("");
    setNewPassword("");
    setIsAdmin(false);
    setDialogOpen(false);
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
                      placeholder="أدخل اسم المستخدم"
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
                  <Button type="submit" onClick={handleAddUser}>حفظ</Button>
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
                <TableHead>الصلاحيات</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell>{u.isAdmin ? "مدير" : "مستخدم عادي"}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteUser(u.id)}
                      disabled={u.id === user.id}
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

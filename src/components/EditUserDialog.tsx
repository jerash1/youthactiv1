
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { Profile } from "../context/AuthContext";

interface EditUserDialogProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userData: {
    username: string;
    password?: string;
    isAdmin: boolean;
  }) => Promise<void>;
  loading: boolean;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSave,
  loading
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (user) {
      setUsername(user.username);
      setPassword("");
      setIsAdmin(user.is_admin);
    }
  }, [user]);

  const handleSave = async () => {
    const userData = {
      username,
      isAdmin,
      ...(password.trim() && { password })
    };
    
    await onSave(userData);
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">تعديل بيانات المستخدم</DialogTitle>
          <DialogDescription>
            تعديل اسم المستخدم وكلمة المرور والصلاحيات
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-username" className="text-sm font-medium">اسم المستخدم</label>
            <Input
              id="edit-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-password" className="text-sm font-medium">
              كلمة المرور الجديدة (اتركها فارغة إذا لم ترد تغييرها)
            </label>
            <div className="relative">
              <Input
                id="edit-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الجديدة"
                className="w-full pr-10"
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
              id="edit-admin" 
              checked={isAdmin} 
              onCheckedChange={(checked) => setIsAdmin(checked === true)}
            />
            <label htmlFor="edit-admin" className="text-sm font-medium pr-2">
              مستخدم بصلاحيات إدارية
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading || !username.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;

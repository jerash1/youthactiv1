
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock login - in a real app, this would validate against a backend
    if (username === "admin" && password === "admin") {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/");
    } else {
      toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600">برنامج تتبع أنشطة المراكز الشبابية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              اسم المستخدم
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="أدخل اسم المستخدم"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              كلمة المرور
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="أدخل كلمة المرور"
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full bg-primary text-white">
            تسجيل الدخول
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>للتجربة، استخدم:</p>
            <p>اسم المستخدم: admin</p>
            <p>كلمة المرور: admin</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

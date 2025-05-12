
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // إذا كان المستخدم مسجل الدخول بالفعل، توجيهه إلى الصفحة الرئيسية
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">تسجيل الدخول</CardTitle>
          <CardDescription className="text-gray-600">
            برنامج تتبع أنشطة المراكز الشبابية
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

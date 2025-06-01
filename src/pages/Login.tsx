
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  
  const { user, login, signUp, loading } = useAuth();
  const navigate = useNavigate();

  // إذا كان المستخدم مسجل الدخول بالفعل، توجيهه إلى الصفحة الرئيسية
  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      await login({ email: loginEmail, password: loginPassword });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    
    try {
      const success = await signUp({ 
        email: signupEmail, 
        password: signupPassword, 
        username: signupUsername 
      });
      
      if (success) {
        // إعادة تعيين النموذج
        setSignupEmail("");
        setSignupPassword("");
        setSignupUsername("");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            مرحباً بك
          </CardTitle>
          <CardDescription className="text-gray-600">
            برنامج تتبع أنشطة المراكز الشبابية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700">
                    البريد الإلكتروني
                  </label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="أدخل بريدك الإلكتروني"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">
                    كلمة المرور
                  </label>
                  <Input
                    id="loginPassword"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="أدخل كلمة المرور"
                    className="w-full"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white"
                  disabled={loginLoading}
                >
                  {loginLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signupUsername" className="block text-sm font-medium text-gray-700">
                    اسم المستخدم
                  </label>
                  <Input
                    id="signupUsername"
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700">
                    البريد الإلكتروني
                  </label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    placeholder="أدخل بريدك الإلكتروني"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700">
                    كلمة المرور
                  </label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                    className="w-full"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white"
                  disabled={signupLoading}
                >
                  {signupLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

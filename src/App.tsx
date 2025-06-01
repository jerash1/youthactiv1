import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ActivitiesProvider } from "./context/ActivitiesContext";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppSidebar from "./components/AppSidebar";
import Index from "./pages/Index";
import ActivitiesList from "./pages/ActivitiesList";
import AddActivity from "./pages/AddActivity";
import EditActivity from "./pages/EditActivity";
import ViewActivity from "./pages/ViewActivity";
import Reports from "./pages/Reports";
import ImportExport from "./pages/ImportExport";
import Login from "./pages/Login";
import Users from "./pages/Users";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ActivitiesProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </ActivitiesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// مكون محمي للتأكد من تسجيل الدخول
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// المكون الرئيسي للتطبيق
const AppContent = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="bg-gray-100">
            <SidebarRail />
            <main className="flex-grow p-4 flex flex-col">
              <div className="flex-grow">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                  <Route path="/activities" element={<ProtectedRoute><ActivitiesList /></ProtectedRoute>} />
                  <Route path="/add-activity" element={<ProtectedRoute><AddActivity /></ProtectedRoute>} />
                  <Route path="/edit-activity/:id" element={<ProtectedRoute><EditActivity /></ProtectedRoute>} />
                  <Route path="/view-activity/:id" element={<ProtectedRoute><ViewActivity /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                  <Route path="/import-export" element={<ProtectedRoute><ImportExport /></ProtectedRoute>} />
                  <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                  <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default App;

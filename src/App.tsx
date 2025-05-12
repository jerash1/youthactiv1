
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivitiesProvider } from "./context/ActivitiesContext";
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import Navbar from "./components/Navbar";
import AppSidebar from "./components/AppSidebar";
import Index from "./pages/Index";
import ActivitiesList from "./pages/ActivitiesList";
import AddActivity from "./pages/AddActivity";
import EditActivity from "./pages/EditActivity";
import ViewActivity from "./pages/ViewActivity";
import Reports from "./pages/Reports";
import ImportExport from "./pages/ImportExport";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ActivitiesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex flex-col min-h-screen w-full">
              <Navbar />
              <div className="flex flex-1">
                <AppSidebar />
                <SidebarInset className="bg-gray-100">
                  <SidebarRail />
                  <main className="flex-grow p-4">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/activities" element={<ActivitiesList />} />
                      <Route path="/add-activity" element={<AddActivity />} />
                      <Route path="/edit-activity/:id" element={<EditActivity />} />
                      <Route path="/view-activity/:id" element={<ViewActivity />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/import-export" element={<ImportExport />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </SidebarInset>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </ActivitiesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

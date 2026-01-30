import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import OwnerFormPage from "./pages/OwnerFormPage";
import DashboardPage from "./pages/DashboardPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import PrivateOwnerDashboard from "./pages/PrivateOwnerDashboard";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import MessagesPage from "./pages/MessagesPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import MapDemoPage from "./pages/MapDemoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="owner-form" element={<OwnerFormPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="property/:id" element={<PropertyDetailsPage />} />
            <Route path="owner/dashboard" element={<PrivateOwnerDashboard />} />
            <Route path="owner/:ownerId" element={<OwnerDashboardPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="map-demo" element={<MapDemoPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useState } from "react";
import { 
  LayoutDashboard, 
  Home,
  Users,
  FileText,
  Settings,
  Shield,
  Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminProperties from "@/components/admin/AdminProperties";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminBookings from "@/components/admin/AdminBookings";
import AdminSettings from "@/components/admin/AdminSettings";

const navigationItems = [
  { title: "Overview", icon: LayoutDashboard, id: "overview" },
  { title: "Properties", icon: Home, id: "properties" },
  { title: "Users", icon: Users, id: "users" },
  { title: "Bookings", icon: FileText, id: "bookings" },
  { title: "Settings", icon: Settings, id: "settings" },
];

const AdminSidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground font-bold">
            <Shield className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-foreground">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">System Administrator</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeTab === item.id
                        ? "bg-destructive/10 text-destructive font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "properties":
        return <AdminProperties />;
      case "users":
        return <AdminUsers />;
      case "bookings":
        return <AdminBookings />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background pt-16 md:pt-20">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="flex items-center gap-4 mb-8">
            <SidebarTrigger className="md:hidden">
              <Menu className="w-6 h-6" />
            </SidebarTrigger>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                ADMIN DASHBOARD
              </h1>
              <p className="text-muted-foreground">Manage all system resources</p>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboardPage;

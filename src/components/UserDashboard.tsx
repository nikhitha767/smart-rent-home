import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  Settings, 
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  useSidebar,
} from "@/components/ui/sidebar";
import DashboardOverview from "./dashboard/DashboardOverview";
import DashboardMessages from "./dashboard/DashboardMessages";
import DashboardProfile from "./dashboard/DashboardProfile";
import DashboardSettings from "./dashboard/DashboardSettings";

const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Messages", icon: MessageSquare, id: "messages" },
  { title: "Profile", icon: User, id: "profile" },
  { title: "Settings", icon: Settings, id: "settings" },
];

const DashboardSidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            R
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-foreground">RentAI</h2>
              <p className="text-xs text-muted-foreground">Property Owner</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeTab === item.id
                        ? "bg-primary/10 text-primary font-medium"
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

      {/* Help Section */}
      <div className="mt-auto p-4 border-t border-border">
        <div className={`bg-muted rounded-lg p-4 ${collapsed ? "hidden" : ""}`}>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground text-sm">Need Help?</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Contact our support team</p>
          <Button size="sm" variant="outline" className="w-full text-xs">
            Get Support
          </Button>
        </div>
      </div>
    </Sidebar>
  );
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleOwnerClick = (ownerId: string) => {
    navigate(`/owner/${ownerId}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview onOwnerClick={handleOwnerClick} />;
      case "messages":
        return <DashboardMessages />;
      case "profile":
        return <DashboardProfile />;
      case "settings":
        return <DashboardSettings />;
      default:
        return <DashboardOverview onOwnerClick={handleOwnerClick} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background pt-16 md:pt-20">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderContent()}
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;

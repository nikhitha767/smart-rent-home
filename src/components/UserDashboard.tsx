import { useState } from "react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  User, 
  Settings, 
  Eye, 
  MessageCircle, 
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface UserDashboardProps {
  onPropertyClick: (propertyId: string) => void;
}

const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Messages", icon: MessageSquare, id: "messages" },
  { title: "Portfolio", icon: FolderOpen, id: "portfolio" },
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

const DashboardContent = () => {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger className="md:hidden">
          <Menu className="w-6 h-6" />
        </SidebarTrigger>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            STUDIO OVERVIEW
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Profile Completion Alert */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Complete Your Profile</h3>
            <p className="text-sm text-muted-foreground">
              Your profile is 0% complete. Add more details to attract more clients.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profile Views
            </CardTitle>
            <Eye className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">0</div>
            <div className="flex items-center gap-1 text-sm text-primary mt-1">
              <TrendingUp className="w-4 h-4" />
              <span>+0% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Conversations
            </CardTitle>
            <MessageCircle className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">0</div>
            <p className="text-sm text-muted-foreground mt-1">Ongoing client chats</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">0%</div>
            <p className="text-sm text-muted-foreground mt-1">Within 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries Section */}
      <div>
        <h2 className="text-xl font-serif font-bold text-foreground mb-4">
          Recent Inquiries
        </h2>
        <Card className="bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No inquiries yet. Your messages will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UserDashboard = ({ onPropertyClick }: UserDashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background pt-16 md:pt-20">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <DashboardContent />
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;

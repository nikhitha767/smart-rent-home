import { 
  Eye, 
  MessageCircle, 
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Menu
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardOverview = () => {
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

export default DashboardOverview;

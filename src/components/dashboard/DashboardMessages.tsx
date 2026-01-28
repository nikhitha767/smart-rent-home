import { MessageSquare, Search, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardMessages = () => {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger className="md:hidden">
          <Menu className="w-6 h-6" />
        </SidebarTrigger>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Messages
          </h1>
          <p className="text-muted-foreground">Communicate with property owners and renters.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Search messages..." 
          className="pl-10 bg-card border-border"
        />
      </div>

      {/* Messages List */}
      <Card className="bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Messages Yet</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            When you receive inquiries about your properties, they will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMessages;

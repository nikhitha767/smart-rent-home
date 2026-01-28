import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Bell, Database, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();

  const handleClearData = (type: "properties" | "bookings" | "all") => {
    if (type === "properties" || type === "all") {
      localStorage.removeItem("properties");
    }
    if (type === "bookings" || type === "all") {
      localStorage.removeItem("booking_requests");
    }
    
    toast({
      title: "Data Cleared",
      description: `${type === "all" ? "All data" : type.charAt(0).toUpperCase() + type.slice(1)} has been cleared.`,
    });
    
    // Refresh page to reflect changes
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage authentication and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Require AI Verification</Label>
              <p className="text-sm text-muted-foreground">All properties must pass AI verification</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-approve Verified Owners</Label>
              <p className="text-sm text-muted-foreground">Skip manual review for verified owners</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>New Property Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when new properties are listed</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Booking Request Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified for new booking requests</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-card border-destructive/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>Manage system data (use with caution)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
            <div>
              <Label>Clear All Properties</Label>
              <p className="text-sm text-muted-foreground">Remove all property listings</p>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleClearData("properties")}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
            <div>
              <Label>Clear All Bookings</Label>
              <p className="text-sm text-muted-foreground">Remove all booking requests</p>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleClearData("bookings")}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
            <div>
              <Label>Reset All Data</Label>
              <p className="text-sm text-muted-foreground">Clear all system data</p>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleClearData("all")}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;

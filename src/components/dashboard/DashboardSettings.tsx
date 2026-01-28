import { Settings, Bell, Lock, Globe, Trash2, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardSettings = () => {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger className="md:hidden">
          <Menu className="w-6 h-6" />
        </SidebarTrigger>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account preferences.</p>
        </div>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Notifications */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-semibold text-foreground">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive browser notifications</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive text message alerts</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center gap-3">
            <Lock className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-semibold text-foreground">
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Profile Visibility</p>
                <p className="text-sm text-muted-foreground">Make your profile public</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add extra security to your account</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center gap-3">
            <Globe className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-semibold text-foreground">
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Language</p>
                <p className="text-sm text-muted-foreground">Select your preferred language</p>
              </div>
              <Button variant="outline" size="sm">English</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Currency</p>
                <p className="text-sm text-muted-foreground">Select your preferred currency</p>
              </div>
              <Button variant="outline" size="sm">INR (₹)</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-card border-destructive/20">
          <CardHeader className="flex flex-row items-center gap-3">
            <Trash2 className="w-5 h-5 text-destructive" />
            <CardTitle className="text-lg font-semibold text-destructive">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSettings;

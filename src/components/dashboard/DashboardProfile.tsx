import { User, Mail, Phone, MapPin, Edit, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardProfile = () => {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden">
            <Menu className="w-6 h-6" />
          </SidebarTrigger>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              My Profile
            </h1>
            <p className="text-muted-foreground">Manage your personal information.</p>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-card lg:col-span-1">
          <CardContent className="flex flex-col items-center py-8">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4">
              <span className="text-primary-foreground text-3xl font-bold">P</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-1">Property Owner</h3>
            <p className="text-muted-foreground text-sm mb-4">PRO Member</p>
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">nikhithaphanisri@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Add phone number</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Add location</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <p className="text-foreground font-medium">Not provided</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="text-foreground font-medium">nikhithaphanisri@gmail.com</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="text-muted-foreground">Not provided</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Location</label>
                <p className="text-muted-foreground">Not provided</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Bio</label>
              <p className="text-muted-foreground">
                Add a short bio to tell potential renters about yourself.
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-foreground mb-3">Account Statistics</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">Properties</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">Bookings</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardProfile;

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit, Menu, Calendar, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "../../firebase";
import { User as FirebaseUser } from "firebase/auth";

const DashboardProfile = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
            {/* Profile Picture */}
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4">
                <span className="text-primary-foreground text-3xl font-bold">
                  {getInitials(user?.displayName || user?.email || "U")}
                </span>
              </div>
            )}

            {/* User Name */}
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {user?.displayName || "User"}
            </h3>

            {/* Provider Badge */}
            <div className="flex items-center gap-2 mb-4">
              {user?.providerData[0]?.providerId === "google.com" && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs">
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Google</span>
                </div>
              )}
              {user?.emailVerified && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs">
                  <Shield className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground truncate">{user?.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {user?.phoneNumber || "Add phone number"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">
                  Joined {formatDate(user?.metadata.creationTime || null)}
                </span>
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
                <p className="text-foreground font-medium">
                  {user?.displayName || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="text-foreground font-medium">{user?.email || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="text-muted-foreground">
                  {user?.phoneNumber || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email Verified</label>
                <p className={user?.emailVerified ? "text-green-600 font-medium" : "text-muted-foreground"}>
                  {user?.emailVerified ? "✓ Verified" : "Not verified"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Account Provider</label>
              <p className="text-foreground font-medium">
                {user?.providerData[0]?.providerId === "google.com" && "Google Authentication"}
                {user?.providerData[0]?.providerId === "password" && "Email/Password"}
                {!user?.providerData[0]?.providerId && "Not available"}
              </p>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">User ID</label>
              <p className="text-foreground font-mono text-xs break-all">
                {user?.uid || "Not available"}
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

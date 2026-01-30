import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Phone, Calendar, Shield, Edit, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../firebase";
import { User as FirebaseUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

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
      month: "long",
      year: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and settings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-card lg:col-span-1">
            <CardContent className="flex flex-col items-center py-8">
              {/* Profile Picture */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-primary shadow-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-primary-foreground text-4xl font-bold">
                    {getInitials(user.displayName || user.email || "U")}
                  </span>
                </div>
              )}

              {/* User Name */}
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
                {user.displayName || "User"}
              </h3>

              {/* Provider Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                {user.providerData[0]?.providerId === "google.com" && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google</span>
                  </div>
                )}
                {user.emailVerified && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="w-full space-y-4 px-4">
                <div className="flex items-start gap-3 text-sm">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs mb-1">Email</p>
                    <p className="text-foreground font-medium break-all">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs mb-1">Phone</p>
                    <p className="text-foreground">
                      {user.phoneNumber || <span className="text-muted-foreground italic">Not added</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs mb-1">Member Since</p>
                    <p className="text-foreground">{formatDate(user.metadata.creationTime || null)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="bg-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                  <p className="text-foreground font-medium mt-1">
                    {user.displayName || <span className="text-muted-foreground italic">Not set</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <p className="text-foreground font-medium mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Status</label>
                  <p className={`font-medium mt-1 ${user.emailVerified ? "text-green-600" : "text-orange-600"}`}>
                    {user.emailVerified ? "✓ Verified" : "⚠ Not verified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Authentication Method</label>
                  <p className="text-foreground font-medium mt-1">
                    {user.providerData[0]?.providerId === "google.com" && "Google Sign-In"}
                    {user.providerData[0]?.providerId === "password" && "Email/Password"}
                    {!user.providerData[0]?.providerId && "Unknown"}
                  </p>
                </div>
              </div>

              {/* User ID */}
              <div className="pt-4 border-t border-border">
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <p className="text-foreground font-mono text-xs mt-1 break-all bg-muted p-3 rounded-lg">
                  {user.uid}
                </p>
              </div>

              {/* Account Stats */}
              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-foreground mb-4">Activity Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary mb-1">0</p>
                    <p className="text-sm text-muted-foreground">Properties Listed</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary mb-1">0</p>
                    <p className="text-sm text-muted-foreground">Bookings Made</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary mb-1">0</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </div>

              {/* Last Sign In */}
              <div className="pt-4 border-t border-border">
                <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
                <p className="text-foreground mt-1">
                  {formatDate(user.metadata.lastSignInTime || null)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

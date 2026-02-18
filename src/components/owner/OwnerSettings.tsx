import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Bell, Shield, Wallet } from "lucide-react";
import { auth } from "../../firebase";
import { useToast } from "@/hooks/use-toast";

const OwnerSettings = () => {
    const { toast } = useToast();
    const user = auth.currentUser;
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        bookings: true,
        marketing: false
    });
    const [profile, setProfile] = useState({
        displayName: user?.displayName || "",
        phoneNumber: user?.phoneNumber || "",
        email: user?.email || ""
    });

    const handleSaveProfile = () => {
        toast({
            title: "Settings Saved",
            description: "Your profile information has been updated.",
        });
    };

    const handleToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>

            <div className="grid gap-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>Update your personal details and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    value={profile.displayName}
                                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    value={profile.email}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={profile.phoneNumber}
                                    placeholder="+91 98765 43210"
                                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Manage your email and push notification preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="notifications-email" className="flex flex-col space-y-1">
                                <span>Email Notifications</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Receive updates about bookings via email
                                </span>
                            </Label>
                            <Switch
                                id="notifications-email"
                                checked={notifications.email}
                                onCheckedChange={() => handleToggle('email')}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="notifications-bookings" className="flex flex-col space-y-1">
                                <span>New Booking Alerts</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Get notified immediately when a user requests a booking
                                </span>
                            </Label>
                            <Switch
                                id="notifications-bookings"
                                checked={notifications.bookings}
                                onCheckedChange={() => handleToggle('bookings')}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy & Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Privacy & Security
                        </CardTitle>
                        <CardDescription>Manage your password and security settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                            Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OwnerSettings;

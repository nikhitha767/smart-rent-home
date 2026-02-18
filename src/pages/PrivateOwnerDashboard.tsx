import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getRequestsByOwner } from "@/stores/bookingStore";
import {
    LayoutDashboard,
    Home,
    ClipboardList,
    Users,
    Settings,
    Menu,
    LogOut,
    Building
} from "lucide-react";
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
    SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import OwnerOverview from "@/components/owner/OwnerOverview";
import OwnerProperties from "@/components/owner/OwnerProperties";
import OwnerRequests from "@/components/owner/OwnerRequests";
import OwnerSettings from "@/components/owner/OwnerSettings";

// Define Property Interface locally or import if shared (keeping local for now to match established pattern)
interface Property {
    id: string;
    propertyName: string;
    location: string;
    status: string;
    rent: number;
    images?: string[];
    image?: string;
}

const navigationItems = [
    { title: "Overview", icon: LayoutDashboard, id: "overview" },
    { title: "My Properties", icon: Home, id: "properties" },
    { title: "Booking Requests", icon: ClipboardList, id: "requests" },
    { title: "Settings", icon: Settings, id: "settings" },
];

const OwnerSidebar = ({ activeTab, setActiveTab, onLogout }: { activeTab: string; setActiveTab: (tab: string) => void, onLogout: () => void }) => {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";

    return (
        <Sidebar className="border-r border-border bg-card">
            <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        <Building className="w-5 h-5" />
                    </div>
                    {!collapsed && (
                        <div>
                            <h2 className="font-bold text-foreground">Owner Portal</h2>
                            <p className="text-xs text-muted-foreground">Manage your listings</p>
                        </div>
                    )}
                </div>
            </div>

            <SidebarContent className="pt-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${activeTab === item.id
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

            <SidebarFooter className="p-4 border-t border-border">
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={onLogout}>
                    <LogOut className="w-5 h-5 mr-2" />
                    {!collapsed && "Logout"}
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
};

const PrivateOwnerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [user, setUser] = useState(auth.currentUser);
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [requestsCount, setRequestsCount] = useState(0);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((u) => {
            if (u) {
                setUser(u);

                // Real-time listener for booking requests
                const unsubscribeRequests = getRequestsByOwner(u.uid, (reqs) => {
                    setRequestsCount(reqs.length);
                });

                // Real-time listener for properties
                const q = query(collection(db, "properties"), where("uid", "==", u.uid));
                const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                    const props: Property[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        props.push({
                            id: doc.id,
                            propertyName: data.propertyName || "Untitled Property",
                            location: data.city || "Unknown Location",
                            status: data.status || "pending_verification",
                            rent: data.rent || 0,
                            images: data.images || [],
                            image: data.image
                        });
                    });
                    setProperties(props);
                    setIsLoading(false);
                }, (error) => {
                    console.error("Error fetching properties:", error);
                    setIsLoading(false);
                });

                return () => {
                    unsubscribeSnapshot();
                    unsubscribeRequests();
                };
            } else {
                navigate("/");
            }
        });

        return () => unsubscribeAuth();
    }, [navigate]);

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return <OwnerOverview totalProperties={properties.length} totalRequests={requestsCount} />;
            case "properties":
                return <OwnerProperties properties={properties} />;
            case "requests":
                return <OwnerRequests ownerId={user.uid} ownerName={user.displayName || "Owner"} propertyName="" />;

            case "settings":
                // Placeholder for Settings
                return <OwnerSettings />;
            default:
                return <OwnerOverview totalProperties={properties.length} totalRequests={requestsCount} />;
        }
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background pt-16 md:pt-20">
                <OwnerSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
                <div className="flex-1 p-6 md:p-8 overflow-auto">
                    <div className="md:hidden mb-4">
                        <SidebarTrigger>
                            <Menu className="w-6 h-6" />
                        </SidebarTrigger>
                    </div>
                    {renderContent()}
                </div>
            </div>
        </SidebarProvider>
    );
};

export default PrivateOwnerDashboard;

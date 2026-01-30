import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users, Wallet, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface OverviewProps {
    totalProperties: number;
    totalRequests: number;
}

const OwnerOverview = ({ totalProperties, totalRequests }: OverviewProps) => {
    // Mock data for analytics
    const stats = [
        {
            title: "Total Properties",
            value: totalProperties,
            icon: Home,
            change: "+1 new",
            trend: "up",
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            title: "Booking Requests",
            value: totalRequests,
            icon: Users,
            change: "+5 this week",
            trend: "up",
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
        {
            title: "Total Revenue",
            value: "₹85,000",
            icon: Wallet,
            change: "+12% vs last month",
            trend: "up",
            color: "text-green-600",
            bg: "bg-green-100"
        },
        {
            title: "Property Views",
            value: "1,245",
            icon: Eye,
            change: "-2% vs last week",
            trend: "down",
            color: "text-orange-600",
            bg: "bg-orange-100"
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-serif">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome back, here's what's happening with your properties.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                <div className={`p-2 rounded-full ${stat.bg}`}>
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <div>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </div>
                                <div className={`flex items-center text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                    {stat.change}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Mock */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                        <Home className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">New view on "Sunny Villa"</p>
                                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">View</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OwnerOverview;

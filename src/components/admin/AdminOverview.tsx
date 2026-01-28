import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, FileText, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";
import { getProperties } from "@/stores/propertyStore";
import { getBookingRequests } from "@/stores/bookingStore";

const AdminOverview = () => {
  const properties = getProperties();
  const bookings = getBookingRequests();
  
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const approvedBookings = bookings.filter(b => b.status === "approved").length;
  const rejectedBookings = bookings.filter(b => b.status === "rejected").length;

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: Home,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Users",
      value: 0, // Will be updated when auth is added
      icon: Users,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Revenue",
      value: "₹0",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const bookingStats = [
    { label: "Pending", value: pendingBookings, icon: Clock, color: "text-yellow-500" },
    { label: "Approved", value: approvedBookings, icon: CheckCircle, color: "text-green-500" },
    { label: "Rejected", value: rejectedBookings, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Status */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Booking Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {bookingStats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-lg bg-muted/50">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Properties */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Recent Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {properties.length > 0 ? (
            <div className="space-y-3">
              {properties.slice(0, 5).map((property) => (
                <div key={property.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <img 
                      src={property.image} 
                      alt={property.propertyName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{property.propertyName}</p>
                      <p className="text-sm text-muted-foreground">{property.ownerName} • {property.city}</p>
                    </div>
                  </div>
                  <span className="text-primary font-bold">₹{property.rent.toLocaleString()}/mo</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No properties yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;

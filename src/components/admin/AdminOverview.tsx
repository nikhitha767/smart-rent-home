import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, FileText, TrendingUp, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";

interface Property {
  id: string;
  propertyName: string;
  ownerName: string;
  city: string;
  rent: number;
  status: string;
  images?: string[];
  image?: string;
}

const AdminOverview = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for all properties
    const q = query(collection(db, "properties"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const props: Property[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        props.push({
          id: doc.id,
          propertyName: data.propertyName || "Untitled",
          ownerName: data.ownerName || "Unknown",
          city: data.city || "Unknown",
          rent: data.rent || 0,
          status: data.status || "pending_verification",
          images: data.images || [],
          image: data.image || (data.images && data.images[0]) || "",
        });
      });
      setProperties(props);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching properties:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate stats from real data
  const pendingProperties = properties.filter(p => p.status === "pending_verification").length;
  const approvedProperties = properties.filter(p => p.status === "approved").length;
  const rejectedProperties = properties.filter(p => p.status === "rejected").length;
  const totalRevenue = properties
    .filter(p => p.status === "approved")
    .reduce((sum, p) => sum + p.rent, 0);

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: Home,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Approved Properties",
      value: approvedProperties,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pending Approval",
      value: pendingProperties,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Total Revenue Potential",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const propertyStats = [
    { label: "Pending", value: pendingProperties, icon: Clock, color: "text-yellow-500" },
    { label: "Approved", value: approvedProperties, icon: CheckCircle, color: "text-green-500" },
    { label: "Rejected", value: rejectedProperties, icon: XCircle, color: "text-red-500" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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

      {/* Property Status */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Property Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {propertyStats.map((stat) => (
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
                    {property.image ? (
                      <img
                        src={property.image}
                        alt={property.propertyName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Home className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{property.propertyName}</p>
                      <p className="text-sm text-muted-foreground">{property.ownerName} • {property.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-primary font-bold">₹{property.rent.toLocaleString()}/mo</span>
                    <p className={`text-xs mt-1 ${property.status === 'approved' ? 'text-green-500' :
                        property.status === 'rejected' ? 'text-red-500' :
                          'text-yellow-500'
                      }`}>
                      {property.status === 'approved' ? 'Approved' :
                        property.status === 'rejected' ? 'Rejected' :
                          'Pending'}
                    </p>
                  </div>
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

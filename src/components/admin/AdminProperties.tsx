import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, MapPin, BadgeCheck } from "lucide-react";
import { getProperties, Property } from "@/stores/propertyStore";
import { useToast } from "@/hooks/use-toast";

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setProperties(getProperties());
  }, []);

  const handleDelete = (id: string) => {
    const stored = localStorage.getItem("properties");
    if (stored) {
      const props = JSON.parse(stored).filter((p: Property) => p.id !== id);
      localStorage.setItem("properties", JSON.stringify(props));
      setProperties(props);
      toast({
        title: "Property Deleted",
        description: "The property has been removed from the system.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            All Properties
            <Badge variant="secondary">{properties.length} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {properties.length > 0 ? (
            <div className="space-y-4">
              {properties.map((property) => (
                <div 
                  key={property.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={property.image} 
                      alt={property.propertyName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{property.propertyName}</h3>
                        {property.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {property.address}, {property.city}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize">{property.propertyType}</Badge>
                        <span className="text-sm text-muted-foreground">by {property.ownerName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{property.rent.toLocaleString()}/mo</p>
                      <p className="text-sm text-muted-foreground">{property.bedrooms} bed • {property.bathrooms} bath</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties registered yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Properties will appear here when owners submit them.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProperties;

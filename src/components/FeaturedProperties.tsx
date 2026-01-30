import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, limit, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home as HomeIcon, Users, Bath, Maximize, ArrowRight, Loader2 } from "lucide-react";

interface Property {
    id: string;
    propertyName: string;
    propertyType: string;
    rent: number;
    city: string;
    locality: string;
    state: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    images?: string[];
    image?: string;
    ownerName: string;
    description?: string;
}

const FeaturedProperties = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch only approved properties, limit to 6 for homepage
        // Try without orderBy first in case createdAt field doesn't exist
        const q = query(
            collection(db, "properties"),
            where("status", "==", "approved"),
            limit(6)
        );

        console.log("FeaturedProperties: Starting to fetch approved properties...");

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("FeaturedProperties: Snapshot received, size:", snapshot.size);
            const props: Property[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                console.log("Property found:", doc.id, data);
                props.push({
                    id: doc.id,
                    propertyName: data.propertyName || "Untitled Property",
                    propertyType: data.propertyType || "Apartment",
                    rent: data.rent || 0,
                    city: data.city || "",
                    locality: data.locality || "",
                    state: data.state || "",
                    bedrooms: data.bedrooms || 0,
                    bathrooms: data.bathrooms || 0,
                    area: data.area || 0,
                    images: data.images || [],
                    image: data.image || (data.images && data.images[0]) || "",
                    ownerName: data.ownerName || "Owner",
                    description: data.description || "",
                });
            });
            console.log("FeaturedProperties: Total properties loaded:", props.length);
            setProperties(props);
            setIsLoading(false);
        }, (error) => {
            console.error("FeaturedProperties: Error fetching properties:", error);
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleViewProperty = (propertyId: string) => {
        navigate(`/owner/${propertyId}`);
    };

    const handleViewAll = () => {
        navigate("/dashboard");
    };

    if (isLoading) {
        return (
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                </div>
            </section>
        );
    }

    if (properties.length === 0) {
        return (
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="section-title">Featured Properties</h2>
                        <p className="section-subtitle">
                            Discover verified rental properties in your area
                        </p>
                    </div>
                    <div className="text-center py-12">
                        <HomeIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground">No properties available yet. Check back soon!</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12 animate-fade-up">
                    <h2 className="section-title">Featured Properties</h2>
                    <p className="section-subtitle">
                        Discover verified rental properties ready for you to move in
                    </p>
                </div>

                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {properties.map((property, index) => (
                        <Card
                            key={property.id}
                            className="group overflow-hidden hover:shadow-elevated transition-all duration-300 cursor-pointer animate-fade-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => handleViewProperty(property.id)}
                        >
                            {/* Property Image */}
                            <div className="relative h-48 overflow-hidden">
                                {property.image ? (
                                    <img
                                        src={property.image}
                                        alt={property.propertyName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <HomeIcon className="w-12 h-12 text-muted-foreground opacity-20" />
                                    </div>
                                )}

                                {/* Property Type Badge */}
                                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                                    {property.propertyType}
                                </Badge>
                            </div>

                            <CardContent className="p-5">
                                {/* Property Name & Location */}
                                <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                    {property.propertyName}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                                    <MapPin className="w-4 h-4" />
                                    <span className="line-clamp-1">{property.locality}, {property.city}</span>
                                </div>

                                {/* Property Stats */}
                                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                                    {property.bedrooms > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{property.bedrooms} Bed</span>
                                        </div>
                                    )}
                                    {property.bathrooms > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Bath className="w-4 h-4" />
                                            <span>{property.bathrooms} Bath</span>
                                        </div>
                                    )}
                                    {property.area > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Maximize className="w-4 h-4" />
                                            <span>{property.area} sqft</span>
                                        </div>
                                    )}
                                </div>

                                {/* Price & View Button */}
                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div>
                                        <p className="text-2xl font-bold text-primary">₹{property.rent.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">per month</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewProperty(property.id);
                                        }}
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Button
                        size="lg"
                        onClick={handleViewAll}
                        className="group"
                    >
                        View All Properties
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProperties;

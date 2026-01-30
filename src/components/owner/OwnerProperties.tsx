import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Home, Loader2, Trash2, MapPin, BadgeCheck, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property {
    id: string;
    propertyName: string;
    location: string;
    status: string;
    rent: number;
    images?: string[];
    image?: string;
}

interface OwnerPropertiesProps {
    properties: Property[];
}

const OwnerProperties = ({ properties }: OwnerPropertiesProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        try {
            await deleteDoc(doc(db, "properties", id));
            toast({ title: "Property Deleted", description: "Your property listing has been removed." });
        } catch (error) {
            console.error("Error deleting property:", error);
            toast({ title: "Error", description: "Failed to delete property.", variant: "destructive" });
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold font-serif">My Properties</h2>
                    <p className="text-muted-foreground">Manage your listed properties</p>
                </div>
                <Button onClick={() => navigate("/owner-form")} className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Property
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border px-4">
                        <Home className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Properties Listed</h3>
                        <p className="text-muted-foreground mb-6">Start by adding your first property to the platform.</p>
                        <Button onClick={() => navigate("/owner-form")} variant="outline">
                            List Your Property
                        </Button>
                    </div>
                ) : (
                    properties.map((property) => (
                        <Card key={property.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card">
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden bg-muted">
                                {property.images && property.images.length > 0 ? (
                                    <img
                                        src={property.images[0]}
                                        alt={property.propertyName}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : property.image ? (
                                    <img
                                        src={property.image}
                                        alt={property.propertyName}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <Home className="w-12 h-12 opacity-20" />
                                    </div>
                                )}

                                <div className="absolute top-3 right-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md flex items-center gap-1.5 ${property.status === 'approved'
                                        ? 'bg-green-500/90 text-white'
                                        : property.status === 'rejected'
                                            ? 'bg-red-500/90 text-white'
                                            : 'bg-yellow-500/90 text-white'
                                        }`}>
                                        {property.status === 'approved' ? <BadgeCheck className="w-3.5 h-3.5" /> :
                                            property.status === 'rejected' ? <AlertCircle className="w-3.5 h-3.5" /> :
                                                <Clock className="w-3.5 h-3.5" />}
                                        {property.status === 'approved' ? 'Verified' :
                                            property.status === 'rejected' ? 'Rejected' : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl mb-1 line-clamp-1">{property.propertyName}</CardTitle>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-3.5 h-3.5 mr-1" />
                                    {property.location}
                                </div>
                            </CardHeader>

                            <CardContent className="pb-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">Rent</p>
                                        <p className="text-2xl font-bold text-primary">₹{property.rent.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-0 flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => navigate(`/property/${property.id}`)}>
                                    Preview
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(property.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default OwnerProperties;

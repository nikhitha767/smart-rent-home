import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  BadgeCheck,
  Phone,
  Mail,
  Calendar,
  Home,
  Users,
  Bath,
  Maximize,
  ClipboardList,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { addBookingRequest } from "@/stores/bookingStore";
import OwnerRequests from "@/components/owner/OwnerRequests";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

interface PropertyData {
  id: string;
  uid: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  propertyName: string;
  propertyType: string;
  images: string[];
  rent: number;
  city: string;
  locality: string;
  state: string;
  status: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
}

const OwnerDashboardPage = () => {
  const navigate = useNavigate();
  const { ownerId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    moveInDate: "",
    duration: "",
    message: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!ownerId) {
        setIsLoading(false);
        return;
      }

      try {
        const propertyDoc = await getDoc(doc(db, "properties", ownerId));
        if (propertyDoc.exists()) {
          const data = propertyDoc.data();
          setProperty({
            id: propertyDoc.id,
            uid: data.uid || "",
            ownerName: data.ownerName || "Property Owner",
            ownerEmail: data.ownerEmail || "",
            ownerPhone: data.ownerPhone || "",
            propertyName: data.propertyName || "Property",
            propertyType: data.propertyType || "Apartment",
            images: data.images || [],
            rent: data.rent || 0,
            city: data.city || "",
            locality: data.locality || "",
            state: data.state || "",
            status: data.status || "pending_verification",
            description: data.description || "",
            bedrooms: data.bedrooms || 0,
            bathrooms: data.bathrooms || 0,
            area: data.area || 0,
            amenities: data.amenities || [],
          });
        } else {
          toast({
            title: "Property Not Found",
            description: "The property you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Error",
          description: "Failed to load property details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [ownerId, navigate]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!property) return;

    try {
      // Add booking request to Firebase
      await addBookingRequest({
        propertyId: property.id,
        ownerId: property.uid,
        ownerName: property.ownerName,
        propertyName: property.propertyName,
        propertyImage: property.images[0] || "",
        userName: bookingData.name,
        userEmail: bookingData.email,
        userPhone: bookingData.phone,
        moveInDate: bookingData.moveInDate,
        duration: bookingData.duration,
        message: bookingData.message,
      });

      toast({
        title: "Booking Request Sent Successfully! ✓",
        description: "Your booking request has been sent to the property owner. Please wait for 24 hours for the owner's response. You will be contacted via email or phone.",
        className: "bg-green-50 border-green-200",
      });

      // Reset form
      setBookingData({
        name: "",
        email: "",
        phone: "",
        moveInDate: "",
        duration: "",
        message: "",
      });

      // Redirect to owner dashboard after a short delay
      setTimeout(() => {
        navigate(`/owner/${property.uid}`);
      }, 2000);
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: "Failed to send booking request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
          <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const location = `${property.locality}, ${property.city}`;
  const isVerified = property.status === "approved";

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        {/* Tabs for Property Details and Requests */}
        <Tabs defaultValue="property" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="property" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Property Details
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="property">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Property Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Gallery */}
                <Card className="overflow-hidden">
                  <div className="relative h-80 md:h-96">
                    {property.images.length > 0 ? (
                      <img
                        src={property.images[selectedImage]}
                        alt={property.propertyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Home className="w-16 h-16 text-muted-foreground opacity-20" />
                      </div>
                    )}
                    {isVerified && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                        <BadgeCheck className="w-4 h-4" />
                        Verified Property
                      </div>
                    )}
                  </div>
                  {property.images.length > 1 && (
                    <div className="flex gap-2 p-4">
                      {property.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-transparent"
                            }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Property Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-serif">{property.propertyName}</CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{property.rent.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Home className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="font-semibold">{property.propertyType}</p>
                        <p className="text-xs text-muted-foreground">Type</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="font-semibold">{property.bedrooms || 0}</p>
                        <p className="text-xs text-muted-foreground">Bedrooms</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Bath className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="font-semibold">{property.bathrooms || 0}</p>
                        <p className="text-xs text-muted-foreground">Bathrooms</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Maximize className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="font-semibold">{property.area || 0}</p>
                        <p className="text-xs text-muted-foreground">Sq. Ft.</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">{property.description || "No description available."}</p>
                    </div>

                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Owner Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Property Owner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
                        {property.ownerName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{property.ownerName}</h3>
                        <div className="flex gap-4 mt-2">
                          {property.ownerPhone && (
                            <a href={`tel:${property.ownerPhone}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                              <Phone className="w-4 h-4" />
                              {property.ownerPhone}
                            </a>
                          )}
                          {property.ownerEmail && (
                            <a href={`mailto:${property.ownerEmail}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                              <Mail className="w-4 h-4" />
                              {property.ownerEmail}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Booking Form */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Book This Property
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Your Name</Label>
                        <Input
                          placeholder="Enter your name"
                          value={bookingData.name}
                          onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={bookingData.email}
                          onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Move-in Date</Label>
                        <Input
                          type="date"
                          value={bookingData.moveInDate}
                          onChange={(e) => setBookingData({ ...bookingData, moveInDate: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Select
                          value={bookingData.duration}
                          onValueChange={(value) => setBookingData({ ...bookingData, duration: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border z-50">
                            <SelectItem value="6">6 Months</SelectItem>
                            <SelectItem value="12">12 Months</SelectItem>
                            <SelectItem value="24">24 Months</SelectItem>
                            <SelectItem value="36">36 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Message (Optional)</Label>
                        <Textarea
                          placeholder="Any specific requirements or questions?"
                          value={bookingData.message}
                          onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Send Booking Request
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        The owner will contact you within 24-48 hours
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <div className="max-w-2xl">
              <OwnerRequests
                ownerId={property.uid}
                ownerName={property.ownerName}
                propertyName={property.propertyName}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;

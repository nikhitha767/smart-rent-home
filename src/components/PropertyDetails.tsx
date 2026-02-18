import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Shield,
  Star,
  Phone,
  Mail,
  Calendar,
  Check,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useToast } from "@/hooks/use-toast";

interface PropertyDetailsProps {
  propertyId: string;
  onBack: () => void;
}

const PropertyDetails = ({ propertyId, onBack }: PropertyDetailsProps) => {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    moveInDate: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", propertyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such document!");
          toast({
            title: "Error",
            description: "Property not found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Error",
          description: "Failed to load property details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, toast]);


  const nextImage = () => {
    if (!property?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (!property?.images?.length) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to book a property.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const bookingRef = collection(db, "bookings");
      await addDoc(bookingRef, {
        propertyId: property.id,
        propertyName: property.propertyName,
        propertyImage: images[0] || "",
        ownerId: property.uid || property.ownerUid || "",
        ownerName: property.ownerName || "",
        tenantId: user.uid,
        userName: bookingData.name,
        userPhone: bookingData.phone,
        userEmail: bookingData.email,
        moveInDate: bookingData.moveInDate,
        message: bookingData.message,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Booking Requested",
        description: "Your booking request has been sent to the owner.",
      });
      setIsBookingOpen(false);
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: "Failed to submit booking request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold">Property not found</p>
        <Button onClick={onBack}>Back to Dashboard</Button>
      </div>
    );
  }

  // Helper to ensure images array exists
  const images = property.images && property.images.length > 0
    ? property.images
    : property.image ? [property.image] : ["https://placehold.co/600x400?text=No+Image"];


  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Button>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden animate-fade-up">
              <img
                src={images[currentImageIndex]}
                alt={property.propertyName}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-foreground" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-foreground" />
                  </button>
                </>
              )}

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                        ? "w-6 bg-primary"
                        : "bg-card/60"
                        }`}
                    />
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                  <Heart className="w-5 h-5 text-foreground" />
                </button>
                <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                  <Share2 className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Verified Badge */}
              {property.status === 'approved' && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-xs font-medium text-white flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-up animation-delay-100">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase">
                    {property.propertyType}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-2">
                    {property.propertyName}
                  </h1>
                  <div className="flex items-center gap-1 text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}, {property.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">
                      ₹{property.rent?.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Deposit: ₹{property.securityDeposit?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-6 py-4 border-y border-border">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bed className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold text-foreground">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bath className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold text-foreground">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Square className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-semibold text-foreground">{property.area || 0} sqft</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">About this property</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {property.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-up animation-delay-200">
                <h2 className="text-lg font-semibold text-foreground mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                    >
                      <Check className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Owner Card */}
              <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-up animation-delay-100">
                <h2 className="text-lg font-semibold text-foreground mb-4">Property Owner</h2>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold uppercase overflow-hidden">
                    {/* {property.ownerImage ? (
                             <img
                             src={property.ownerImage}
                             alt={property.ownerName}
                             className="w-full h-full object-cover"
                           />
                        ) : (
                            property.ownerName?.[0] || "O"
                        )} */}
                    {property.ownerName?.[0] || "O"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {property.ownerName || "Unknown Owner"}
                      </h3>
                      {property.status === 'approved' && (
                        <Shield className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    {/* <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-medium">4.8</span>
                      <span className="text-muted-foreground">rating</span>
                    </div> */}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 truncate" title={property.email}>
                  Email: {property.email}
                </p>

                <div className="space-y-3">
                  <Button className="w-full btn-primary" onClick={() => setIsBookingOpen(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Owner
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>

              {/* Location Map Placeholder */}
              <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-up animation-delay-200">
                <h2 className="text-lg font-semibold text-foreground mb-4">Location</h2>
                <div className="aspect-video rounded-lg bg-muted flex flex-col items-center justify-center p-4 text-center">
                  <MapPin className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-foreground font-medium">
                    {property.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {property.city}, {property.state} {property.zipCode && `- ${property.zipCode}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsBookingOpen(false)}
          />

          <div className="relative w-full max-w-md mx-4 bg-card rounded-2xl shadow-prominent animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-serif font-bold text-foreground mb-2">
                Book This Property
              </h2>
              <p className="text-muted-foreground mb-6">
                Fill in your details to send a booking request to {property.ownerName}
              </p>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-name">Full Name</Label>
                  <Input
                    id="booking-name"
                    placeholder="Enter your name"
                    value={bookingData.name}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, name: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-phone">Phone Number</Label>
                  <Input
                    id="booking-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={bookingData.phone}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, phone: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-email">Email</Label>
                  <Input
                    id="booking-email"
                    type="email"
                    placeholder="your@email.com"
                    value={bookingData.email}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, email: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-date">Preferred Move-in Date</Label>
                  <Input
                    id="booking-date"
                    type="date"
                    value={bookingData.moveInDate}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, moveInDate: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-message">Message (Optional)</Label>
                  <Textarea
                    id="booking-message"
                    placeholder="Any specific requirements..."
                    value={bookingData.message}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, message: e.target.value })
                    }
                    className="input-field min-h-[80px] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsBookingOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Request"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PropertyDetailsProps {
  propertyId: string;
  onBack: () => void;
}

const propertyData = {
  id: "1",
  name: "Sunrise Apartments",
  type: "Apartment",
  images: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200",
  ],
  rent: 25000,
  deposit: 75000,
  bedrooms: 2,
  bathrooms: 2,
  area: 1200,
  location: "Koramangala, Bangalore",
  address: "123, 4th Cross, Koramangala 4th Block, Bangalore - 560034",
  owner: {
    name: "Raj Kumar",
    phone: "+91 98765 43210",
    email: "raj.kumar@email.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    isVerified: true,
    rating: 4.8,
    responseTime: "Usually responds within 2 hours",
  },
  description:
    "Beautiful 2BHK apartment in the heart of Koramangala. Fully furnished with modern amenities. Close to restaurants, shopping malls, and IT parks. Ideal for working professionals and families.",
  amenities: [
    "24/7 Security",
    "Power Backup",
    "Covered Parking",
    "Gym",
    "Swimming Pool",
    "Clubhouse",
    "Lift",
    "Intercom",
    "Fire Safety",
    "CCTV",
  ],
  nearbyPlaces: [
    { name: "Forum Mall", distance: "0.5 km" },
    { name: "Metro Station", distance: "1.2 km" },
    { name: "Hospital", distance: "0.8 km" },
    { name: "School", distance: "1.0 km" },
  ],
};

const PropertyDetails = ({ propertyId, onBack }: PropertyDetailsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    moveInDate: "",
    message: "",
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + propertyData.images.length) % propertyData.images.length
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    alert("Booking request submitted successfully!");
    setIsBookingOpen(false);
  };

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
                src={propertyData.images[currentImageIndex]}
                alt={propertyData.name}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />

              {/* Navigation Arrows */}
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

              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {propertyData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "w-6 bg-primary"
                        : "bg-card/60"
                    }`}
                  />
                ))}
              </div>

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
              {propertyData.owner.isVerified && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent/90 backdrop-blur-sm text-xs font-medium text-accent-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  AI Verified
                </span>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-up animation-delay-100">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {propertyData.type}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-2">
                    {propertyData.name}
                  </h1>
                  <div className="flex items-center gap-1 text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{propertyData.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">
                      ₹{propertyData.rent.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Deposit: ₹{propertyData.deposit.toLocaleString()}
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
                    <p className="font-semibold text-foreground">{propertyData.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bath className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold text-foreground">{propertyData.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Square className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-semibold text-foreground">{propertyData.area} sqft</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">About this property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {propertyData.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-up animation-delay-200">
              <h2 className="text-lg font-semibold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {propertyData.amenities.map((amenity, index) => (
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

            {/* Nearby Places */}
            <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-up animation-delay-300">
              <h2 className="text-lg font-semibold text-foreground mb-4">Nearby Places</h2>
              <div className="grid grid-cols-2 gap-4">
                {propertyData.nearbyPlaces.map((place, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <span className="text-foreground">{place.name}</span>
                    <span className="text-sm text-muted-foreground">{place.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Owner Card */}
              <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-up animation-delay-100">
                <h2 className="text-lg font-semibold text-foreground mb-4">Property Owner</h2>

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={propertyData.owner.image}
                    alt={propertyData.owner.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {propertyData.owner.name}
                      </h3>
                      {propertyData.owner.isVerified && (
                        <Shield className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-medium">{propertyData.owner.rating}</span>
                      <span className="text-muted-foreground">rating</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {propertyData.owner.responseTime}
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
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  {propertyData.location}
                </p>
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
                Fill in your details to send a booking request
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
                  <Button type="submit" className="flex-1 btn-primary">
                    Send Request
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

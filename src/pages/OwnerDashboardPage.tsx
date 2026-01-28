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
  ClipboardList
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
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { addBookingRequest } from "@/stores/bookingStore";
import OwnerRequests from "@/components/owner/OwnerRequests";

const ownerDetails: Record<string, {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  type: string;
  image: string;
  images: string[];
  rent: number;
  location: string;
  isVerified: boolean;
  rating: number;
  properties: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
}> = {
  "1": {
    id: "1",
    name: "Raj Kumar",
    email: "raj.kumar@email.com",
    phone: "+91 98765 43210",
    propertyName: "Sunrise Apartments",
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    rent: 25000,
    location: "Koramangala, Bangalore",
    isVerified: true,
    rating: 4.8,
    properties: 3,
    description: "Beautiful 2BHK apartment with modern amenities, located in the heart of Koramangala. Close to IT parks, restaurants, and shopping centers.",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ["WiFi", "AC", "Parking", "Gym", "Swimming Pool", "Security"],
  },
  "2": {
    id: "2",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43211",
    propertyName: "Green Valley Villa",
    type: "Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    rent: 75000,
    location: "Whitefield, Bangalore",
    isVerified: true,
    rating: 4.9,
    properties: 2,
    description: "Luxurious 4BHK villa with private garden and premium interiors. Perfect for families looking for spacious living.",
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    amenities: ["WiFi", "AC", "Parking", "Garden", "Security", "Power Backup"],
  },
  "3": {
    id: "3",
    name: "Amit Verma",
    email: "amit.verma@email.com",
    phone: "+91 98765 43212",
    propertyName: "City Heights",
    type: "House",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    rent: 35000,
    location: "Indiranagar, Bangalore",
    isVerified: true,
    rating: 4.6,
    properties: 1,
    description: "Spacious 3BHK independent house in prime Indiranagar location. Walking distance to metro station.",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    amenities: ["WiFi", "Parking", "Power Backup", "Water Supply"],
  },
  "4": {
    id: "4",
    name: "Meera Patel",
    email: "meera.patel@email.com",
    phone: "+91 98765 43213",
    propertyName: "Student's Haven PG",
    type: "PG",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    rent: 8000,
    location: "HSR Layout, Bangalore",
    isVerified: false,
    rating: 4.3,
    properties: 5,
    description: "Affordable PG accommodation for students and working professionals. Includes meals and laundry service.",
    bedrooms: 1,
    bathrooms: 1,
    area: 150,
    amenities: ["WiFi", "Meals", "Laundry", "Housekeeping"],
  },
  "5": {
    id: "5",
    name: "Suresh Reddy",
    email: "suresh.reddy@email.com",
    phone: "+91 98765 43214",
    propertyName: "Lake View Apartment",
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    rent: 45000,
    location: "Electronic City, Bangalore",
    isVerified: true,
    rating: 4.7,
    properties: 4,
    description: "Premium 3BHK apartment with lake view. Fully furnished with modern appliances.",
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    amenities: ["WiFi", "AC", "Parking", "Gym", "Clubhouse", "Security"],
  },
  "6": {
    id: "6",
    name: "Anita Desai",
    email: "anita.desai@email.com",
    phone: "+91 98765 43215",
    propertyName: "Modern Studio PG",
    type: "PG",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    ],
    rent: 12000,
    location: "Koramangala, Bangalore",
    isVerified: true,
    rating: 4.5,
    properties: 2,
    description: "Modern PG with private rooms and attached bathrooms. Best for working professionals.",
    bedrooms: 1,
    bathrooms: 1,
    area: 250,
    amenities: ["WiFi", "AC", "Meals", "Housekeeping", "Laundry"],
  },
};

const OwnerDashboardPage = () => {
  const navigate = useNavigate();
  const { ownerId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    moveInDate: "",
    duration: "",
    message: "",
  });

  const owner = ownerDetails[ownerId || "1"] || ownerDetails["1"];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add booking request to store
    addBookingRequest({
      ownerId: owner.id,
      ownerName: owner.name,
      propertyName: owner.propertyName,
      propertyImage: owner.image,
      userName: bookingData.name,
      userEmail: bookingData.email,
      userPhone: bookingData.phone,
      moveInDate: bookingData.moveInDate,
      duration: bookingData.duration,
      message: bookingData.message,
    });

    toast({
      title: "Booking Request Sent! ✓",
      description: `Your booking request for ${owner.propertyName} has been sent to ${owner.name}. Check the owner's Requests tab to see your pending request.`,
    });
    setBookingData({
      name: "",
      email: "",
      phone: "",
      moveInDate: "",
      duration: "",
      message: "",
    });
  };

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
                    <img 
                      src={owner.images[selectedImage]} 
                      alt={owner.propertyName}
                      className="w-full h-full object-cover"
                    />
                    {owner.isVerified && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                        <BadgeCheck className="w-4 h-4" />
                        Verified Property
                      </div>
                    )}
                  </div>
                  {owner.images.length > 1 && (
                    <div className="flex gap-2 p-4">
                      {owner.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImage === index ? "border-primary" : "border-transparent"
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
                        <CardTitle className="text-2xl font-serif">{owner.propertyName}</CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{owner.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{owner.rent.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Home className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="font-semibold">{owner.type}</p>
                        <p className="text-xs text-muted-foreground">Type</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="font-semibold">{owner.bedrooms}</p>
                        <p className="text-xs text-muted-foreground">Bedrooms</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Bath className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="font-semibold">{owner.bathrooms}</p>
                        <p className="text-xs text-muted-foreground">Bathrooms</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <Maximize className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="font-semibold">{owner.area}</p>
                        <p className="text-xs text-muted-foreground">Sq. Ft.</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">{owner.description}</p>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h3 className="font-semibold mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {owner.amenities.map((amenity) => (
                          <span 
                            key={amenity}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
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
                        {owner.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{owner.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{owner.rating} rating</span>
                          <span className="mx-2">•</span>
                          <span>{owner.properties} properties</span>
                        </div>
                        <div className="flex gap-4 mt-2">
                          <a href={`tel:${owner.phone}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                            <Phone className="w-4 h-4" />
                            {owner.phone}
                          </a>
                          <a href={`mailto:${owner.email}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                            <Mail className="w-4 h-4" />
                            {owner.email}
                          </a>
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
                          onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input 
                          type="email"
                          placeholder="Enter your email"
                          value={bookingData.email}
                          onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input 
                          type="tel"
                          placeholder="Enter your phone number"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Move-in Date</Label>
                        <Input 
                          type="date"
                          value={bookingData.moveInDate}
                          onChange={(e) => setBookingData({...bookingData, moveInDate: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Select 
                          value={bookingData.duration} 
                          onValueChange={(value) => setBookingData({...bookingData, duration: value})}
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
                          onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
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
                ownerId={owner.id} 
                ownerName={owner.name} 
                propertyName={owner.propertyName} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;

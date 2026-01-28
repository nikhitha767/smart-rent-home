import { useState } from "react";
import { 
  Menu,
  Search,
  MapPin,
  Home,
  Building2,
  Users,
  Castle,
  Star,
  BadgeCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserBookingConfirmations from "./UserBookingConfirmations";

const states = [
  { id: "karnataka", name: "Karnataka", cities: ["Bangalore", "Mysore", "Mangalore"] },
  { id: "maharashtra", name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur"] },
  { id: "tamil-nadu", name: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai"] },
  { id: "telangana", name: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad"] },
  { id: "delhi", name: "Delhi", cities: ["New Delhi", "Noida", "Gurgaon"] },
  { id: "gujarat", name: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara"] },
];

const cityAreas: Record<string, string[]> = {
  Bangalore: ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "Electronic City"],
  Mumbai: ["Andheri", "Bandra", "Powai", "Juhu", "Thane"],
  Chennai: ["T. Nagar", "Anna Nagar", "Adyar", "Velachery", "OMR"],
  Hyderabad: ["Hitech City", "Gachibowli", "Banjara Hills", "Jubilee Hills", "Kondapur"],
  Pune: ["Koregaon Park", "Hinjewadi", "Kothrud", "Viman Nagar", "Baner"],
  Mysore: ["Vijayanagar", "Kuvempunagar", "Saraswathipuram"],
  Mangalore: ["Hampankatta", "Kadri", "Bejai"],
  Nagpur: ["Dharampeth", "Sitabuldi", "Civil Lines"],
  Coimbatore: ["RS Puram", "Gandhipuram", "Saibaba Colony"],
  Madurai: ["Anna Nagar", "KK Nagar", "Tallakulam"],
  Warangal: ["Hanamkonda", "Kazipet", "Subedari"],
  Nizamabad: ["Armoor Road", "Vinayak Nagar", "Dichpally"],
  "New Delhi": ["Connaught Place", "Karol Bagh", "Dwarka"],
  Noida: ["Sector 62", "Sector 18", "Sector 137"],
  Gurgaon: ["DLF Phase 1", "Cyber City", "Sohna Road"],
  Ahmedabad: ["Navrangpura", "Satellite", "Vastrapur"],
  Surat: ["Adajan", "Vesu", "Athwa"],
  Vadodara: ["Alkapuri", "Fatehgunj", "Manjalpur"],
};

const propertyTypes = [
  { id: "house", label: "Houses", icon: Home },
  { id: "apartment", label: "Apartments", icon: Building2 },
  { id: "pg", label: "PGs", icon: Users },
  { id: "villa", label: "Villas", icon: Castle },
];

const sampleOwners = [
  {
    id: "1",
    name: "Raj Kumar",
    propertyName: "Sunrise Apartments",
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    rent: 25000,
    location: "Koramangala, Bangalore",
    isVerified: true,
    rating: 4.8,
    properties: 3,
  },
  {
    id: "2",
    name: "Priya Sharma",
    propertyName: "Green Valley Villa",
    type: "Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    rent: 75000,
    location: "Whitefield, Bangalore",
    isVerified: true,
    rating: 4.9,
    properties: 2,
  },
  {
    id: "3",
    name: "Amit Verma",
    propertyName: "City Heights",
    type: "House",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    rent: 35000,
    location: "Indiranagar, Bangalore",
    isVerified: true,
    rating: 4.6,
    properties: 1,
  },
  {
    id: "4",
    name: "Meera Patel",
    propertyName: "Student's Haven PG",
    type: "PG",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    rent: 8000,
    location: "HSR Layout, Bangalore",
    isVerified: false,
    rating: 4.3,
    properties: 5,
  },
  {
    id: "5",
    name: "Suresh Reddy",
    propertyName: "Lake View Apartment",
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    rent: 45000,
    location: "Electronic City, Bangalore",
    isVerified: true,
    rating: 4.7,
    properties: 4,
  },
  {
    id: "6",
    name: "Anita Desai",
    propertyName: "Modern Studio PG",
    type: "PG",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    rent: 12000,
    location: "Koramangala, Bangalore",
    isVerified: true,
    rating: 4.5,
    properties: 2,
  },
];

interface DashboardOverviewProps {
  onOwnerClick?: (ownerId: string) => void;
}

const DashboardOverview = ({ onOwnerClick }: DashboardOverviewProps) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredOwners, setFilteredOwners] = useState(sampleOwners);

  const availableCities = states.find((s) => s.id === selectedState)?.cities || [];
  const availableAreas = selectedCity ? cityAreas[selectedCity] || [] : [];

  const isFormComplete = selectedState && selectedCity && selectedArea && selectedType;

  const handleSearch = () => {
    if (!isFormComplete) return;
    
    // Filter owners based on selected type
    const filtered = sampleOwners.filter((owner) => {
      if (selectedType && owner.type.toLowerCase() !== selectedType) {
        return false;
      }
      return true;
    });
    
    setFilteredOwners(filtered);
    setHasSearched(true);
  };

  const handleOwnerClick = (ownerId: string) => {
    if (onOwnerClick) {
      onOwnerClick(ownerId);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger className="md:hidden">
          <Menu className="w-6 h-6" />
        </SidebarTrigger>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            USER DASHBOARD
          </h1>
          <p className="text-muted-foreground">Find properties by location and type</p>
        </div>
      </div>

      {/* Booking Confirmations */}
      <UserBookingConfirmations />

      {/* Search Form */}
      <Card className="mb-8 bg-card">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Search Properties
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* State */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">State</Label>
              <Select value={selectedState} onValueChange={(value) => {
                setSelectedState(value);
                setSelectedCity("");
                setSelectedArea("");
                setHasSearched(false);
              }}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">City</Label>
              <Select
                value={selectedCity}
                onValueChange={(value) => {
                  setSelectedCity(value);
                  setSelectedArea("");
                  setHasSearched(false);
                }}
                disabled={!selectedState}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Area</Label>
              <Select
                value={selectedArea}
                onValueChange={(value) => {
                  setSelectedArea(value);
                  setHasSearched(false);
                }}
                disabled={!selectedCity}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {availableAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Property Type</Label>
              <Select value={selectedType} onValueChange={(value) => {
                setSelectedType(value);
                setHasSearched(false);
              }}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={!isFormComplete}
            className="w-full md:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Properties
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {hasSearched && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-foreground">
              Available Properties
            </h2>
            <p className="text-muted-foreground text-sm">
              {filteredOwners.length} owner{filteredOwners.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredOwners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOwners.map((owner) => (
                <Card 
                  key={owner.id}
                  className="bg-card overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  onClick={() => handleOwnerClick(owner.id)}
                >
                  <div className="relative h-48">
                    <img 
                      src={owner.image} 
                      alt={owner.propertyName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      {owner.isVerified && (
                        <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                        {owner.type}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {owner.propertyName}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{owner.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-foreground">{owner.rating}</span>
                      </div>
                      <span className="text-primary font-bold">
                        ₹{owner.rent.toLocaleString()}/mo
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {owner.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{owner.name}</p>
                          <p className="text-xs text-muted-foreground">{owner.properties} properties</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No properties found for the selected criteria. Try different filters.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Initial State - No Search Yet */}
      {!hasSearched && (
        <Card className="bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Search for Properties</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Select your preferred state, city, area, and property type to find available properties and their owners.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardOverview;

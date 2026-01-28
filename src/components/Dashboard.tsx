import { useState } from "react";
import { Search, Filter, MapPin, Home, Building2, Users, Castle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyCard from "./PropertyCard";

interface DashboardProps {
  onPropertyClick: (propertyId: string) => void;
}

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
};

const sampleProperties = [
  {
    id: "1",
    name: "Sunrise Apartments",
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    rent: 25000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    location: "Koramangala, Bangalore",
    owner: "Raj Kumar",
    isVerified: true,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Green Valley Villa",
    type: "Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    rent: 75000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    location: "Whitefield, Bangalore",
    owner: "Priya Sharma",
    isVerified: true,
    rating: 4.9,
  },
  {
    id: "3",
    name: "City Heights",
    type: "House",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    rent: 35000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    location: "Indiranagar, Bangalore",
    owner: "Amit Verma",
    isVerified: true,
    rating: 4.6,
  },
  {
    id: "4",
    name: "Student's Haven PG",
    type: "PG",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    rent: 8000,
    bedrooms: 1,
    bathrooms: 1,
    area: 150,
    location: "HSR Layout, Bangalore",
    owner: "Meera Patel",
    isVerified: false,
    rating: 4.3,
  },
  {
    id: "5",
    name: "Lake View Apartment",
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    rent: 45000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    location: "Electronic City, Bangalore",
    owner: "Suresh Reddy",
    isVerified: true,
    rating: 4.7,
  },
  {
    id: "6",
    name: "Modern Studio PG",
    type: "PG",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    rent: 12000,
    bedrooms: 1,
    bathrooms: 1,
    area: 250,
    location: "Koramangala, Bangalore",
    owner: "Anita Desai",
    isVerified: true,
    rating: 4.5,
  },
];

const propertyTypes = [
  { id: "all", label: "All Types", icon: Home },
  { id: "house", label: "Houses", icon: Home },
  { id: "apartment", label: "Apartments", icon: Building2 },
  { id: "pg", label: "PGs", icon: Users },
  { id: "villa", label: "Villas", icon: Castle },
];

const Dashboard = ({ onPropertyClick }: DashboardProps) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const availableCities = states.find((s) => s.id === selectedState)?.cities || [];
  const availableAreas = selectedCity ? cityAreas[selectedCity] || [] : [];

  const filteredProperties = sampleProperties.filter((property) => {
    if (selectedType !== "all" && property.type.toLowerCase() !== selectedType) {
      return false;
    }
    if (searchQuery && !property.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSelectedState("");
    setSelectedCity("");
    setSelectedArea("");
    setSelectedType("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            Find Your Perfect Home
          </h1>
          <p className="text-muted-foreground">
            Browse AI-verified properties across India
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 animate-fade-up animation-delay-100">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search properties by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 input-field"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4 gap-2"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-card rounded-2xl p-6 shadow-card animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Filter Properties</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* State */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">State</Label>
                <Select value={selectedState} onValueChange={(value) => {
                  setSelectedState(value);
                  setSelectedCity("");
                  setSelectedArea("");
                }}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
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
                  }}
                  disabled={!selectedState}
                >
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
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
                  onValueChange={setSelectedArea}
                  disabled={!selectedCity}
                >
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
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
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Property Type Quick Filters */}
        <div className="flex flex-wrap gap-3 mb-8 animate-fade-up animation-delay-200">
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            const isActive = selectedType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:border-primary/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="mb-6 animate-fade-up animation-delay-300">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <div
              key={property.id}
              className="animate-fade-up"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <PropertyCard
                property={property}
                onClick={() => onPropertyClick(property.id)}
              />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-16 animate-fade-up">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Properties Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

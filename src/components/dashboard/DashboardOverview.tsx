import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserBookingConfirmations from "./UserBookingConfirmations";
import { Property, getPropertyRating, getPropertyRatingCount } from "@/stores/propertyStore";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

import { locationData } from "../../services/locationData";

const propertyTypes = [
  { id: "house", label: "Houses", icon: Home },
  { id: "apartment", label: "Apartments", icon: Building2 },
  { id: "pg", label: "PGs", icon: Users },
  { id: "villa", label: "Villas", icon: Castle },
];

interface DashboardOverviewProps {
  onOwnerClick?: (ownerId: string) => void;
}

const DashboardOverview = ({ onOwnerClick }: DashboardOverviewProps) => {
  const [searchParams] = useSearchParams();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Fetch verified properties from Firestore
  // Listen for verified properties from Firestore
  useEffect(() => {
    const q = query(collection(db, "properties"), where("status", "==", "approved"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setAllProperties(props);
    }, (error) => {
      console.error("Error fetching properties:", error);
    });

    return () => unsubscribe();
  }, []);

  // Check for type from URL params (from category buttons)
  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl && allProperties.length > 0) {
      setSelectedType(typeFromUrl);
      // Auto-search with just the type
      const filtered = allProperties.filter((p) => p.propertyType === typeFromUrl);
      setFilteredProperties(filtered);
      setHasSearched(true);
    }
  }, [searchParams, allProperties]);

  const availableCities = locationData.find((s) => s.id === selectedState)?.cities || [];


  // Allow search if at least ONE filter is active
  const isFormComplete = selectedState || selectedCity || selectedArea || selectedType;

  const handleSearch = () => {
    if (!isFormComplete) {
      // Ideally show all properties if search is clicked without filters, but sticking to "isFormComplete" for now.
      // Actually, let's allow "Search" to show all if nothing selected? 
      // User prompt implies "details filling after clock search property not displaying".
      // Let's stick to requiring at least one input for now to avoid accidental "show all" overload, 
      // but definitely relax the "State AND City" requirement.
      console.log("Search requires at least one filter");
      return;
    }

    console.log("Searching with:", { selectedState, selectedCity, selectedArea, selectedType });
    console.log("Total properties available:", allProperties.length);

    // Filter from fetched allProperties
    const filtered = allProperties.filter((property) => {
      // Type filter (optional)
      if (selectedType && property.propertyType !== selectedType) {
        return false;
      }

      // State filter (optional)
      if (selectedState && property.state !== selectedState) {
        return false;
      }

      // City filter (optional)
      if (selectedCity && property.city !== selectedCity) {
        return false;
      }

      // Area/Locality filter (optional, partial match)
      if (selectedArea) {
        const areaFilter = selectedArea.toLowerCase();
        const propertyLocality = (property.locality || "").toLowerCase();
        const propertyAddress = (property.address || "").toLowerCase();

        // Search in both locality and address
        if (!propertyLocality.includes(areaFilter) && !propertyAddress.includes(areaFilter)) {
          return false;
        }
      }

      return true;
    });

    console.log("Filtered properties:", filtered.length, filtered);
    setFilteredProperties(filtered);
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
                  {locationData.map((state) => (
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
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Area / Locality</Label>
              <Input
                placeholder="Enter area (e.g. Koramangala)"
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  setHasSearched(false);
                }}
                className="bg-background border-border"
              />
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
              {filteredProperties.length} propert{filteredProperties.length !== 1 ? 'ies' : 'y'} found
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card
                  key={property.id}
                  className="bg-card overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  onClick={() => handleOwnerClick(property.id)}
                >
                  <div className="relative h-48">
                    <img
                      src={
                        property.image
                          ? (Array.isArray(property.image) ? property.image[0] : property.image)
                          : (property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800")
                      }
                      alt={property.propertyName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      {property.status === 'approved' && (
                        <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" />
                          AI Verified
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium capitalize">
                        {property.propertyType}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {property.propertyName}
                    </h3>

                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{property.address}, {property.city}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-foreground">
                          {getPropertyRating(property.id) > 0
                            ? getPropertyRating(property.id).toFixed(1)
                            : "New"}
                        </span>
                        {getPropertyRatingCount(property.id) > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({getPropertyRatingCount(property.id)})
                          </span>
                        )}
                      </div>
                      <span className="text-primary font-bold">
                        ₹{property.rent.toLocaleString()}/mo
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {property.ownerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{property.ownerName}</p>
                          <p className="text-xs text-muted-foreground">{property.bedrooms} bed • {property.bathrooms} bath</p>
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

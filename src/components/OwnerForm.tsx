import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Home, MapPin, Phone, User, FileText, IndianRupee, Bed, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OwnerFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

const OwnerForm = ({ onBack, onSubmit }: OwnerFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: "",
    phone: "",
    propertyType: "",
    propertyName: "",
    address: "",
    city: "",
    state: "",
    rent: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
  });

  useEffect(() => {
    // Trigger zoom-in animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              List Your Property
            </h1>
            <p className="text-muted-foreground">
              Fill in the details below to list your property. Our AI will verify your 
              information to build trust with potential tenants.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Owner Information */}
            <div 
              className={`bg-card rounded-xl p-4 shadow-card transition-all duration-500 ease-out ${
                isVisible 
                  ? "opacity-100 scale-100 translate-y-0" 
                  : "opacity-0 scale-75 translate-y-8"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Owner Info
              </h2>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="ownerName" className="text-xs">Full Name</Label>
                  <Input
                    id="ownerName"
                    placeholder="Your full name"
                    value={formData.ownerName}
                    onChange={(e) => handleChange("ownerName", e.target.value)}
                    className="input-field h-9 text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="pl-9 input-field h-9 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Documents</Label>
                  <div className="border border-dashed border-border rounded-lg p-3 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      ID proof, property docs
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div 
              className={`bg-card rounded-xl p-4 shadow-card transition-all duration-500 ease-out ${
                isVisible 
                  ? "opacity-100 scale-100 translate-y-0" 
                  : "opacity-0 scale-75 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Home className="w-4 h-4 text-primary" />
                Property
              </h2>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="propertyType" className="text-xs">Type</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleChange("propertyType", value)}
                  >
                    <SelectTrigger className="input-field h-9 text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="pg">PG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="propertyName" className="text-xs">Name</Label>
                  <Input
                    id="propertyName"
                    placeholder="Property name"
                    value={formData.propertyName}
                    onChange={(e) => handleChange("propertyName", e.target.value)}
                    className="input-field h-9 text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="bedrooms" className="text-xs">Beds</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="2"
                      value={formData.bedrooms}
                      onChange={(e) => handleChange("bedrooms", e.target.value)}
                      className="input-field h-9 text-sm text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bathrooms" className="text-xs">Baths</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="1"
                      value={formData.bathrooms}
                      onChange={(e) => handleChange("bathrooms", e.target.value)}
                      className="input-field h-9 text-sm text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="area" className="text-xs">Sqft</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="1200"
                      value={formData.area}
                      onChange={(e) => handleChange("area", e.target.value)}
                      className="input-field h-9 text-sm text-center"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="rent" className="text-xs">Rent (₹/month)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="rent"
                      type="number"
                      placeholder="25000"
                      value={formData.rent}
                      onChange={(e) => handleChange("rent", e.target.value)}
                      className="pl-9 input-field h-9 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div 
              className={`bg-card rounded-xl p-4 shadow-card transition-all duration-500 ease-out ${
                isVisible 
                  ? "opacity-100 scale-100 translate-y-0" 
                  : "opacity-0 scale-75 translate-y-8"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Location
              </h2>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="state" className="text-xs">State</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleChange("state", value)}
                  >
                    <SelectTrigger className="input-field h-9 text-sm">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="telangana">Telangana</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="city" className="text-xs">City</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => handleChange("city", value)}
                  >
                    <SelectTrigger className="input-field h-9 text-sm">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address" className="text-xs">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Full address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="input-field min-h-[60px] resize-none text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description & Images */}
            <div 
              className={`bg-card rounded-xl p-4 shadow-card transition-all duration-500 ease-out ${
                isVisible 
                  ? "opacity-100 scale-100 translate-y-0" 
                  : "opacity-0 scale-75 translate-y-8"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Details
              </h2>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-xs">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Property details..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="input-field min-h-[60px] resize-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Images</Label>
                  <div className="border border-dashed border-border rounded-lg p-3 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      Upload images
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div 
            className={`mt-6 flex justify-center gap-3 transition-all duration-500 ease-out ${
              isVisible 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-90 translate-y-4"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <Button type="button" variant="outline" onClick={onBack} size="sm" className="px-6">
              Cancel
            </Button>
            <Button type="submit" className="btn-primary px-6" size="sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit for Verification"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerForm;

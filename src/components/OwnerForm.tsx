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
    <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-up text-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              List Your Property
            </h1>
            <p className="text-muted-foreground">
              Fill in the details below to list your property. Our AI will verify your 
              information to build trust with potential tenants.
            </p>
          </div>
        </div>

        {/* Form - Single Card */}
        <form onSubmit={handleSubmit} className="flex justify-center">
          <div 
            className={`bg-card rounded-2xl p-6 md:p-8 shadow-card w-full max-w-2xl transition-all duration-500 ease-out ${
              isVisible 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-90 translate-y-8"
            }`}
          >
            <div className="space-y-6">
              {/* Owner Information Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <User className="w-5 h-5 text-primary" />
                  Owner Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ownerName">Full Name</Label>
                    <Input
                      id="ownerName"
                      placeholder="Enter your full name"
                      value={formData.ownerName}
                      onChange={(e) => handleChange("ownerName", e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="pl-10 input-field"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Upload Documents</Label>
                  <div className="border border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">ID proof, property documents (PDF, JPG, PNG)</p>
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <Home className="w-5 h-5 text-primary" />
                  Property Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => handleChange("propertyType", value)}
                    >
                      <SelectTrigger className="input-field">
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
                  <div className="space-y-1.5">
                    <Label htmlFor="propertyName">Property Name</Label>
                    <Input
                      id="propertyName"
                      placeholder="e.g., Sunrise Apartments"
                      value={formData.propertyName}
                      onChange={(e) => handleChange("propertyName", e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="2"
                      value={formData.bedrooms}
                      onChange={(e) => handleChange("bedrooms", e.target.value)}
                      className="input-field text-center"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="1"
                      value={formData.bathrooms}
                      onChange={(e) => handleChange("bathrooms", e.target.value)}
                      className="input-field text-center"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="area">Area (sqft)</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="1200"
                      value={formData.area}
                      onChange={(e) => handleChange("area", e.target.value)}
                      className="input-field text-center"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rent">Monthly Rent (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="rent"
                      type="number"
                      placeholder="25000"
                      value={formData.rent}
                      onChange={(e) => handleChange("rent", e.target.value)}
                      className="pl-10 input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleChange("state", value)}
                    >
                      <SelectTrigger className="input-field">
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
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => handleChange("city", value)}
                    >
                      <SelectTrigger className="input-field">
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
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter complete address with landmark"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="input-field min-h-[80px] resize-none"
                    required
                  />
                </div>
              </div>

              {/* Description & Images Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Description & Images
                </h2>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Property Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, amenities, nearby facilities..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="input-field min-h-[80px] resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Property Images</Label>
                  <div className="border border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Upload up to 10 images (JPG, PNG)</p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-primary" disabled={isLoading}>
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerForm;

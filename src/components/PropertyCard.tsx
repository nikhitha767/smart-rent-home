import { MapPin, Bed, Bath, Square, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    type: string;
    image: string;
    rent: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    location: string;
    owner: string;
    isVerified: boolean;
    rating: number;
  };
  onClick: () => void;
}

const PropertyCard = ({ property, onClick }: PropertyCardProps) => {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Type Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground">
          {property.type}
        </span>

        {/* Verified Badge */}
        {property.isVerified && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-accent/90 backdrop-blur-sm text-xs font-medium text-accent-foreground flex items-center gap-1">
            <Shield className="w-3 h-3" />
            AI Verified
          </span>
        )}

        {/* Rent Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary-foreground">
              ₹{property.rent.toLocaleString()}
            </span>
            <span className="text-sm text-primary-foreground/70">/month</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Location */}
        <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
          {property.name}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{property.area} sqft</span>
          </div>
        </div>

        {/* Owner & Rating */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {property.owner.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{property.owner}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{property.rating}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button onClick={onClick} className="w-full mt-4 btn-primary">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default PropertyCard;

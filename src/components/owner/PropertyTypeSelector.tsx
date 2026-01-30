import { Building2, Home, Castle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PropertyTypeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const propertyTypes = [
    {
        id: "house",
        label: "House",
        icon: Home,
        description: "Independent house with private entrance"
    },
    {
        id: "apartment",
        label: "Apartment",
        icon: Building2,
        description: "Flat in a multi-story building"
    },
    {
        id: "villa",
        label: "Villa",
        icon: Castle,
        description: "Luxury standalone property"
    },
    {
        id: "pg",
        label: "PG",
        icon: Users,
        description: "Paying guest accommodation"
    }
];

const PropertyTypeSelector = ({ value, onChange }: PropertyTypeSelectorProps) => {
    return (
        <div className="space-y-3">
            <label className="text-sm font-medium">Property Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {propertyTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = value === type.id;

                    return (
                        <Card
                            key={type.id}
                            className={cn(
                                "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                                isSelected
                                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                                    : "border-border hover:border-primary/50"
                            )}
                            onClick={() => onChange(type.id)}
                        >
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                                        isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={cn("font-semibold text-sm", isSelected && "text-primary")}>
                                        {type.label}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default PropertyTypeSelector;

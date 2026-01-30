import { useState, useEffect } from "react";
import { Home, Building2, Users, Castle } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const categoryConfig = [
  {
    id: "house",
    label: "Houses",
    icon: Home,
    description: "Independent houses with gardens",
    countKey: "houses",
    firestoreType: "House",
  },
  {
    id: "apartment",
    label: "Apartments",
    icon: Building2,
    description: "Modern flats in prime locations",
    countKey: "apartments",
    firestoreType: "Apartment",
  },
  {
    id: "pg",
    label: "PGs",
    icon: Users,
    description: "Paying guest accommodations",
    countKey: "pgs",
    firestoreType: "PG",
  },
  {
    id: "villa",
    label: "Villas",
    icon: Castle,
    description: "Luxury villas with amenities",
    countKey: "villas",
    firestoreType: "Villa",
  },
];

interface CategoryButtonsProps {
  onCategorySelect?: (category: string) => void;
}

const CategoryButtons = ({ onCategorySelect }: CategoryButtonsProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({
    houses: 0,
    apartments: 0,
    pgs: 0,
    villas: 0,
  });

  useEffect(() => {
    // Fetch real-time counts for each property type
    const unsubscribers: (() => void)[] = [];

    categoryConfig.forEach((category) => {
      const q = query(
        collection(db, "properties"),
        where("status", "==", "approved"),
        where("propertyType", "==", category.firestoreType)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setCounts((prev) => ({
          ...prev,
          [category.countKey]: snapshot.size,
        }));
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
    onCategorySelect?.(categoryId);
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="section-title">Explore Property Types</h2>
          <p className="section-subtitle">
            Choose from a variety of rental options that fit your lifestyle and budget
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categoryConfig.map((category, index) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            const count = counts[category.countKey] || 0;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`group relative p-6 md:p-8 rounded-2xl transition-all duration-300 animate-fade-up ${isActive
                    ? "bg-primary shadow-elevated -translate-y-2"
                    : "bg-card shadow-card hover:shadow-elevated hover:-translate-y-1"
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${isActive
                      ? "bg-primary-foreground/20"
                      : "bg-primary/10 group-hover:bg-primary/20"
                    }`}
                >
                  <Icon
                    className={`w-7 h-7 transition-colors duration-300 ${isActive ? "text-primary-foreground" : "text-primary"
                      }`}
                  />
                </div>

                {/* Label */}
                <h3
                  className={`text-lg font-semibold mb-1 transition-colors duration-300 ${isActive ? "text-primary-foreground" : "text-foreground"
                    }`}
                >
                  {category.label}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm mb-3 transition-colors duration-300 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                >
                  {category.description}
                </p>

                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {count} available
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45 rounded-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryButtons;

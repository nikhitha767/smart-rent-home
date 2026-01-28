// Property store using localStorage for persistence
import { getRatingsByProperty } from "./ratingStore";

export interface Property {
  id: string;
  ownerName: string;
  phone: string;
  propertyType: string; // house, apartment, villa, pg
  propertyName: string;
  address: string;
  city: string;
  state: string;
  rent: number;
  securityDeposit: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  image: string;
  isVerified: boolean;
  createdAt: string;
}

const STORAGE_KEY = "properties";

// Default placeholder images for different property types
const defaultImages: Record<string, string> = {
  house: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  apartment: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
  pg: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
};

export const getProperties = (): Property[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addProperty = (
  propertyData: Omit<Property, "id" | "isVerified" | "createdAt" | "image">
): Property => {
  const properties = getProperties();
  const newProperty: Property = {
    ...propertyData,
    id: Date.now().toString(),
    image: defaultImages[propertyData.propertyType] || defaultImages.house,
    isVerified: true, // AI verified
    createdAt: new Date().toISOString(),
  };
  properties.push(newProperty);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  return newProperty;
};

export const getPropertyById = (id: string): Property | undefined => {
  return getProperties().find((p) => p.id === id);
};

export const getPropertyRating = (propertyId: string): number => {
  const ratings = getRatingsByProperty(propertyId);
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

export const getPropertyRatingCount = (propertyId: string): number => {
  return getRatingsByProperty(propertyId).length;
};

export const getPropertiesByType = (type: string): Property[] => {
  return getProperties().filter((p) => p.propertyType === type);
};

export const getPropertiesByLocation = (
  state?: string,
  city?: string,
  type?: string
): Property[] => {
  let properties = getProperties();
  
  if (state) {
    properties = properties.filter((p) => p.state.toLowerCase() === state.toLowerCase());
  }
  if (city) {
    properties = properties.filter((p) => p.city.toLowerCase() === city.toLowerCase());
  }
  if (type) {
    properties = properties.filter((p) => p.propertyType === type);
  }
  
  return properties;
};

export const getPropertyTypeCounts = (): Record<string, number> => {
  const properties = getProperties();
  return {
    houses: properties.filter((p) => p.propertyType === "house").length,
    apartments: properties.filter((p) => p.propertyType === "apartment").length,
    pgs: properties.filter((p) => p.propertyType === "pg").length,
    villas: properties.filter((p) => p.propertyType === "villa").length,
  };
};

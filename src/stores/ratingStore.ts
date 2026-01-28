// Rating store using localStorage for persistence

export interface PropertyRating {
  id: string;
  propertyId: string;
  bookingId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5 stars
  review: string;
  createdAt: string;
}

const STORAGE_KEY = "property_ratings";

export const getRatings = (): PropertyRating[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addRating = (
  rating: Omit<PropertyRating, "id" | "createdAt">
): PropertyRating => {
  const ratings = getRatings();
  
  // Check if user already rated this booking
  const existing = ratings.find(r => r.bookingId === rating.bookingId);
  if (existing) {
    // Update existing rating
    existing.rating = rating.rating;
    existing.review = rating.review;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    return existing;
  }
  
  const newRating: PropertyRating = {
    ...rating,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  ratings.push(newRating);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  return newRating;
};

export const getRatingsByProperty = (propertyId: string): PropertyRating[] => {
  return getRatings().filter(r => r.propertyId === propertyId);
};

export const getAverageRating = (propertyId: string): number => {
  const ratings = getRatingsByProperty(propertyId);
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return sum / ratings.length;
};

export const hasUserRatedBooking = (bookingId: string): boolean => {
  return getRatings().some(r => r.bookingId === bookingId);
};

export const getRatingByBooking = (bookingId: string): PropertyRating | undefined => {
  return getRatings().find(r => r.bookingId === bookingId);
};

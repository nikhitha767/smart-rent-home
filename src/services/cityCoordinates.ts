/**
 * Simple Geocoding Service using OpenStreetMap Nominatim
 * With proper error handling and fallback
 */

// City coordinates database for common Indian cities
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
    // Andhra Pradesh
    'vijayawada': { lat: 16.5062, lng: 80.6480 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'guntur': { lat: 16.3067, lng: 80.4365 },
    'tirupati': { lat: 13.6288, lng: 79.4192 },

    // Telangana
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'warangal': { lat: 17.9689, lng: 79.5941 },
    'nizamabad': { lat: 18.6725, lng: 78.0941 },

    // Karnataka
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'bengaluru': { lat: 12.9716, lng: 77.5946 },
    'mysore': { lat: 12.2958, lng: 76.6394 },
    'mangalore': { lat: 12.9141, lng: 74.8560 },

    // Tamil Nadu
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'madurai': { lat: 9.9252, lng: 78.1198 },

    // Maharashtra
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },

    // Delhi NCR
    'delhi': { lat: 28.7041, lng: 77.1025 },
    'new delhi': { lat: 28.6139, lng: 77.2090 },
    'noida': { lat: 28.5355, lng: 77.3910 },
    'gurgaon': { lat: 28.4595, lng: 77.0266 },
    'gurugram': { lat: 28.4595, lng: 77.0266 },

    // Gujarat
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'surat': { lat: 21.1702, lng: 72.8311 },
    'vadodara': { lat: 22.3072, lng: 73.1812 },

    // West Bengal
    'kolkata': { lat: 22.5726, lng: 88.3639 },

    // Rajasthan
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'udaipur': { lat: 24.5854, lng: 73.7125 },

    // Kerala
    'kochi': { lat: 9.9312, lng: 76.2673 },
    'thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },

    // Punjab
    'chandigarh': { lat: 30.7333, lng: 76.7794 },
    'ludhiana': { lat: 30.9010, lng: 75.8573 },
};

/**
 * Get coordinates for a city from the database
 */
export const getCityCoordinates = (cityName: string): { lat: number; lng: number } | null => {
    const normalizedCity = cityName.toLowerCase().trim();
    return CITY_COORDINATES[normalizedCity] || null;
};

/**
 * Search for city by partial name
 */
export const searchCityByName = (searchTerm: string): string[] => {
    const normalized = searchTerm.toLowerCase().trim();
    if (!normalized) return [];

    return Object.keys(CITY_COORDINATES)
        .filter(city => city.includes(normalized))
        .map(city => city.charAt(0).toUpperCase() + city.slice(1));
};

/**
 * Get all available cities
 */
export const getAllCities = (): string[] => {
    return Object.keys(CITY_COORDINATES)
        .map(city => city.charAt(0).toUpperCase() + city.slice(1))
        .sort();
};

/**
 * Check if a city exists in the database
 */
export const isCityAvailable = (cityName: string): boolean => {
    const normalized = cityName.toLowerCase().trim();
    return normalized in CITY_COORDINATES;
};

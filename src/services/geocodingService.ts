/**
 * Geocoding service using OpenStreetMap Nominatim API
 * Free and no API key required
 */

interface GeocodingResult {
    lat: number;
    lng: number;
    displayName?: string;
}

interface ReverseGeocodingResult {
    city: string;
    address: string;
    country?: string;
    state?: string;
}

/**
 * Convert address and city to coordinates
 * @param address - Street address
 * @param city - City name
 * @returns Coordinates and display name
 */
export const geocodeAddress = async (
    address: string,
    city: string
): Promise<GeocodingResult> => {
    try {
        const query = `${address}, ${city}`.trim();
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
        )}&format=json&limit=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'RentAI-App/1.0' // Required by Nominatim
            }
        });

        if (!response.ok) {
            throw new Error('Geocoding request failed');
        }

        const data = await response.json();

        if (data.length === 0) {
            throw new Error('Location not found');
        }

        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name
        };
    } catch (error) {
        // Silently fail - geocoding is optional
        throw error;
    }
};

/**
 * Convert coordinates to address
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Address components
 */
export const reverseGeocode = async (
    lat: number,
    lng: number
): Promise<ReverseGeocodingResult> => {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'RentAI-App/1.0'
            }
        });

        if (!response.ok) {
            throw new Error('Reverse geocoding request failed');
        }

        const data = await response.json();

        return {
            city: data.address?.city || data.address?.town || data.address?.village || '',
            address: data.display_name || '',
            country: data.address?.country || '',
            state: data.address?.state || ''
        };
    } catch (error) {
        // Silently fail - reverse geocoding is optional
        throw error;
    }
};

/**
 * Search for cities matching a query
 * @param query - Search query
 * @returns Array of city suggestions
 */
export const searchCities = async (query: string): Promise<string[]> => {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
        )}&format=json&limit=5&addressdetails=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'RentAI-App/1.0'
            }
        });

        if (!response.ok) {
            throw new Error('City search failed');
        }

        const data = await response.json();

        // Extract unique city names
        const cities: string[] = data
            .map((item: any) => {
                return item.address?.city || item.address?.town || item.address?.village;
            })
            .filter((city: string | undefined): city is string => city !== undefined);

        return [...new Set(cities)]; // Remove duplicates
    } catch (error) {
        // Silently fail - city search is optional
        return [];
    }
};

/**
 * Debounce function for geocoding requests
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

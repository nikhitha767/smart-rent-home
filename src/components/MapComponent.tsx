import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    height?: string;
    markers?: Array<{
        lat: number;
        lng: number;
        popup?: string;
    }>;
}

const MapComponent = ({
    latitude = 51.505,
    longitude = -0.09,
    zoom = 13,
    height = '400px',
    markers = []
}: MapComponentProps) => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize map only once
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], zoom);

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);

            // Add default marker at center
            L.marker([latitude, longitude])
                .addTo(mapRef.current)
                .bindPopup('Default Location')
                .openPopup();

            // Add custom markers if provided
            markers.forEach(marker => {
                if (mapRef.current) {
                    const leafletMarker = L.marker([marker.lat, marker.lng]).addTo(mapRef.current);
                    if (marker.popup) {
                        leafletMarker.bindPopup(marker.popup);
                    }
                }
            });
        }

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [latitude, longitude, zoom, markers]);

    return (
        <div
            ref={mapContainerRef}
            style={{
                height,
                width: '100%',
                borderRadius: '8px',
                overflow: 'hidden'
            }}
        />
    );
};

export default MapComponent;

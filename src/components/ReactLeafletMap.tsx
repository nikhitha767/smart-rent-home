import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MarkerData {
    lat: number;
    lng: number;
    popup?: string;
}

interface ReactLeafletMapProps {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    height?: string;
    markers?: MarkerData[];
}

const ReactLeafletMap = ({
    latitude = 51.505,
    longitude = -0.09,
    zoom = 13,
    height = '400px',
    markers = []
}: ReactLeafletMapProps) => {
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={zoom}
            style={{
                height,
                width: '100%',
                borderRadius: '8px',
                overflow: 'hidden'
            }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Default marker at center */}
            <Marker position={[latitude, longitude]}>
                <Popup>
                    Default Location
                </Popup>
            </Marker>

            {/* Custom markers */}
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lng]}>
                    {marker.popup && <Popup>{marker.popup}</Popup>}
                </Marker>
            ))}
        </MapContainer>
    );
};

export default ReactLeafletMap;

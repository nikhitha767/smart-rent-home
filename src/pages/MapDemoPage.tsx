import ReactLeafletMap from '@/components/ReactLeafletMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MapDemoPage = () => {
    // Example markers for properties
    const propertyMarkers = [
        {
            lat: 51.51,
            lng: -0.1,
            popup: '🏠 Beautiful 2BR Apartment - $2000/month'
        },
        {
            lat: 51.5,
            lng: -0.08,
            popup: '🏡 Cozy Studio - $1200/month'
        },
        {
            lat: 51.515,
            lng: -0.095,
            popup: '🏢 Modern 3BR Penthouse - $3500/month'
        }
    ];

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold">Map Integration Demo</h1>
                <p className="text-muted-foreground">
                    Interactive maps using Leaflet for property locations
                </p>
            </div>

            <div className="grid gap-6">
                {/* Basic Map */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Map</CardTitle>
                        <CardDescription>
                            Simple map with default location marker
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ReactLeafletMap
                            latitude={51.505}
                            longitude={-0.09}
                            zoom={13}
                            height="400px"
                        />
                    </CardContent>
                </Card>

                {/* Map with Multiple Property Markers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Property Locations</CardTitle>
                        <CardDescription>
                            Map showing multiple rental properties with details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ReactLeafletMap
                            latitude={51.505}
                            longitude={-0.09}
                            zoom={14}
                            height="500px"
                            markers={propertyMarkers}
                        />
                    </CardContent>
                </Card>

                {/* Usage Instructions */}
                <Card>
                    <CardHeader>
                        <CardTitle>How to Use</CardTitle>
                        <CardDescription>
                            Integration guide for the map component
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Basic Usage:</h3>
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                {`import ReactLeafletMap from '@/components/ReactLeafletMap';

<ReactLeafletMap 
  latitude={51.505}
  longitude={-0.09}
  zoom={13}
  height="400px"
/>`}
                            </pre>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">With Custom Markers:</h3>
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                {`const markers = [
  { lat: 51.51, lng: -0.1, popup: 'Property 1' },
  { lat: 51.5, lng: -0.08, popup: 'Property 2' }
];

<ReactLeafletMap 
  latitude={51.505}
  longitude={-0.09}
  zoom={14}
  height="500px"
  markers={markers}
/>`}
                            </pre>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Props:</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li><code>latitude</code> - Center latitude (default: 51.505)</li>
                                <li><code>longitude</code> - Center longitude (default: -0.09)</li>
                                <li><code>zoom</code> - Zoom level (default: 13)</li>
                                <li><code>height</code> - Map height (default: '400px')</li>
                                <li><code>markers</code> - Array of marker objects with lat, lng, and optional popup</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MapDemoPage;

# Leaflet Map Integration Guide

## ✅ Issues Fixed

### 1. PostCSS Error - RESOLVED
**Problem:** `Cannot find module 'caniuse-lite/dist/unpacker/agents'`

**Solution:** 
- Deleted `node_modules` folder
- Reinstalled all dependencies with `npm install`
- The error was caused by corrupted or incomplete node modules

### 2. Leaflet Integration - COMPLETED
**Added:**
- Leaflet CSS and JS CDN links to `index.html`
- Created two map components for different use cases
- Added demo page with examples

---

## 🗺️ Map Components Created

### 1. `MapComponent.tsx` (Vanilla Leaflet)
- Uses plain Leaflet library
- More control over map instance
- Good for complex custom interactions

### 2. `ReactLeafletMap.tsx` (React-Leaflet) ⭐ RECOMMENDED
- Uses react-leaflet wrapper
- More React-friendly
- Easier to use and maintain
- Better for most use cases

---

## 🚀 How to Use

### Basic Usage
```tsx
import ReactLeafletMap from '@/components/ReactLeafletMap';

<ReactLeafletMap 
  latitude={51.505}
  longitude={-0.09}
  zoom={13}
  height="400px"
/>
```

### With Custom Markers (For Properties)
```tsx
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
  }
];

<ReactLeafletMap 
  latitude={51.505}
  longitude={-0.09}
  zoom={14}
  height="500px"
  markers={propertyMarkers}
/>
```

---

## 📍 Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `latitude` | number | 51.505 | Center latitude |
| `longitude` | number | -0.09 | Center longitude |
| `zoom` | number | 13 | Zoom level (1-18) |
| `height` | string | '400px' | Map container height |
| `markers` | array | [] | Array of marker objects |

### Marker Object Structure
```typescript
{
  lat: number;      // Latitude
  lng: number;      // Longitude
  popup?: string;   // Optional popup text
}
```

---

## 🎯 Demo Page

Visit the demo page to see examples:
**URL:** http://localhost:8080/map-demo

The demo page shows:
- Basic map with default marker
- Map with multiple property markers
- Usage examples and code snippets

---

## 🔧 Integration in Your Rent-AI App

### Example: Property Details Page
```tsx
import ReactLeafletMap from '@/components/ReactLeafletMap';

const PropertyDetailsPage = () => {
  const property = {
    latitude: 51.505,
    longitude: -0.09,
    address: "123 Main St, London"
  };

  return (
    <div>
      <h1>Property Location</h1>
      <ReactLeafletMap 
        latitude={property.latitude}
        longitude={property.longitude}
        zoom={15}
        height="400px"
      />
    </div>
  );
};
```

### Example: Properties List with Map
```tsx
const PropertiesMapView = ({ properties }) => {
  const markers = properties.map(prop => ({
    lat: prop.latitude,
    lng: prop.longitude,
    popup: `${prop.title} - $${prop.price}/month`
  }));

  return (
    <ReactLeafletMap 
      latitude={properties[0]?.latitude || 51.505}
      longitude={properties[0]?.longitude || -0.09}
      zoom={12}
      height="600px"
      markers={markers}
    />
  );
};
```

---

## 📦 Dependencies Already Installed

✅ `leaflet@1.9.4` - Core Leaflet library
✅ `react-leaflet@4.2.1` - React wrapper for Leaflet
✅ `@types/leaflet@1.9.21` - TypeScript definitions

---

## 🌐 CDN Links Added to index.html

```html
<!-- Leaflet CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
      crossorigin="" />

<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" 
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" 
        crossorigin=""></script>
```

---

## 🎨 Styling Tips

The map components come with basic styling, but you can customize:

```tsx
<ReactLeafletMap 
  latitude={51.505}
  longitude={-0.09}
  zoom={13}
  height="500px"  // Adjust height
  // The component already has rounded corners and overflow hidden
/>
```

For more custom styling, wrap the component in a div:

```tsx
<div className="shadow-lg rounded-xl overflow-hidden">
  <ReactLeafletMap {...props} />
</div>
```

---

## 🔍 Getting Coordinates

To get latitude/longitude for your properties:
1. Go to https://www.latlong.net/
2. Enter the address
3. Copy the coordinates
4. Use them in your map component

---

## ✨ Next Steps

1. **Add maps to property listings** - Show location on each property card
2. **Property details page** - Display full map with property location
3. **Search by location** - Allow users to search properties on map
4. **Owner dashboard** - Show all owner's properties on a single map
5. **Custom markers** - Use custom icons for different property types

---

## 🐛 Troubleshooting

### Map not displaying?
- Check browser console for errors
- Ensure Leaflet CSS is loaded
- Verify coordinates are valid numbers

### Markers not showing?
- Check marker icon fix is applied (already done in components)
- Verify marker coordinates are within valid range

### Map container has no height?
- Always specify a height prop
- Parent container must have defined height

---

## 📚 Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [React-Leaflet Documentation](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)

---

**Server Status:** ✅ Running at http://localhost:8080/
**Demo Page:** http://localhost:8080/map-demo

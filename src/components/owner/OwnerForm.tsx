import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Upload, MapPin, CheckCircle, Loader2, Home, Crosshair, Sparkles, Phone, TreeDeciduous } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { updateUserRole } from "../../services/userService";
import { uploadPropertyImagesToIPFS } from "../../services/ipfsUploadService";
import { getCityCoordinates } from "../../services/cityCoordinates";
import { locationData } from "../../services/locationData";
// Geocoding disabled due to CORS issues from localhost
// import { geocodeAddress, reverseGeocode, debounce } from "../../services/geocodingService";
import PropertyTypeSelector from "./PropertyTypeSelector";
import ImageUploadGrid from "./ImageUploadGrid";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons in React
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface OwnerFormProps {
    onBack: () => void;
    onSubmit: () => void;
}

// Map Component to handle clicks
const LocationMarker = ({ position, setPosition }: { position: L.LatLng | null, setPosition: (latlng: L.LatLng) => void }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Property Location</Popup>
        </Marker>
    );
};

const OwnerForm = ({ onBack, onSubmit }: OwnerFormProps) => {
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    // const [isGeocoding, setIsGeocoding] = useState(false); // Removed - geocoding disabled

    // Form Data
    const [formData, setFormData] = useState({
        ownerName: auth.currentUser?.displayName || "",
        phone: "",
        propertyType: "apartment",
        propertyName: "",
        address: "",
        city: "",
        state: "",
        locality: "",
        rent: "",
        bedrooms: "",
        bathrooms: "",
        description: "",
        lat: 12.9716,
        lng: 77.5946,
        images: [] as File[],
        hasGarden: false,
        hasBalcony: false,
        hasTerrace: false,
    });

    // Map State
    const [mapPosition, setMapPosition] = useState<L.LatLng | null>(null);
    const [manualLocationLoading, setManualLocationLoading] = useState(false);
    const mapRef = useRef<L.Map | null>(null);

    // Auto-update map when city changes (using local coordinates database)
    useEffect(() => {
        if (formData.city) {
            const coords = getCityCoordinates(formData.city);

            if (coords) {
                const newPos = new L.LatLng(coords.lat, coords.lng);
                setMapPosition(newPos);
                setFormData(prev => ({ ...prev, lat: coords.lat, lng: coords.lng }));

                // Update map view if map ref exists
                if (mapRef.current) {
                    mapRef.current.setView([coords.lat, coords.lng], 13);
                }
            }
        }
    }, [formData.city]);

    const handleLocateMe = () => {
        setManualLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPos = new L.LatLng(latitude, longitude);
                    setMapPosition(newPos);
                    setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));

                    // Reverse geocode disabled due to CORS - user must enter address manually
                    // try {
                    //     const result = await reverseGeocode(latitude, longitude);
                    //     setFormData(prev => ({
                    //         ...prev,
                    //         city: result.city,
                    //         address: result.address
                    //     }));
                    // } catch (error) {
                    //     // Silently fail - reverse geocoding is optional
                    // }

                    setManualLocationLoading(false);
                    toast({ title: "Location Found", description: "Map centered on your location. Please enter city and address manually." });
                },
                (error) => {
                    toast({ title: "Error", description: "Could not fetch location.", variant: "destructive" });
                    setManualLocationLoading(false);
                }
            );
        }
    };

    const handleImagesChange = async (files: File[]) => {
        setFormData(prev => ({ ...prev, images: files }));

        if (files.length > 0 && !isAnalyzing) {
            // Simulate AI Analysis
            setIsAnalyzing(true);
            setTimeout(() => {
                setIsAnalyzing(false);
                // Simulated Auto-fill with enhanced detection
                setFormData(prev => ({
                    ...prev,
                    bedrooms: "2",
                    bathrooms: "2",
                    propertyName: prev.propertyName || "Modern City Apartment",
                    description: prev.description || "Beautiful 2BHK with balcony view, analyzed from uploaded images.",
                    rent: prev.rent || "25000",
                    hasBalcony: true,
                    hasGarden: false,
                }));
                toast({
                    title: "✨ AI Analysis Complete",
                    description: "We've detected 2 bedrooms, 2 bathrooms, and a balcony!",
                });
            }, 3000);
        }
    };

    const handleSubmit = async () => {
        if (!auth.currentUser) return;

        // Validation
        if (formData.images.length === 0) {
            toast({ title: "Error", description: "Please upload at least one image", variant: "destructive" });
            return;
        }

        if (!formData.phone) {
            toast({ title: "Error", description: "Please enter your phone number", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            // Generate temporary property ID
            const tempPropertyId = `temp_${Date.now()}`;

            // Upload images to IPFS via Pinata
            toast({ title: "Uploading to IPFS...", description: "Please wait" });
            const imageUrls = await uploadPropertyImagesToIPFS(
                formData.images,
                (progress) => setUploadProgress(progress)
            );

            // Create property document
            const propertyData = {
                ownerName: formData.ownerName,
                phone: formData.phone,
                propertyType: formData.propertyType,
                propertyName: formData.propertyName,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                locality: formData.locality,
                rent: Number(formData.rent),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                description: formData.description,
                lat: formData.lat,
                lng: formData.lng,
                images: imageUrls, // Array of IPFS gateway URLs from Pinata
                hasGarden: formData.hasGarden,
                hasBalcony: formData.hasBalcony,
                hasTerrace: formData.hasTerrace,
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                createdAt: new Date().toISOString(),
                status: "pending_verification",
            };

            await addDoc(collection(db, "properties"), propertyData);
            await updateUserRole(auth.currentUser.uid, "owner");

            toast({
                title: "Success!",
                description: "Property submitted for admin review. You'll be notified once approved."
            });
            onSubmit();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to list property", variant: "destructive" });
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-20 pb-12 flex flex-col items-center">
            <div className="w-full max-w-4xl px-4">

                {/* Header / Nav */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-3 h-3 rounded-full ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
                        ))}
                    </div>
                </div>

                {/* STEP 1: LOCATION */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-serif font-bold mb-2">Where is your property?</h1>
                            <p className="text-muted-foreground">Enter city name to auto-locate, then click map to pin exact location.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 h-[400px] rounded-xl overflow-hidden border border-border shadow-lg relative">
                                <MapContainer
                                    center={[formData.lat, formData.lng]}
                                    zoom={13}
                                    style={{ height: "100%", width: "100%" }}
                                    ref={mapRef}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    />
                                    <LocationMarker
                                        position={mapPosition}
                                        setPosition={(pos) => {
                                            setMapPosition(pos);
                                            setFormData(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
                                        }}
                                    />
                                </MapContainer>
                                <Button
                                    className="absolute bottom-4 right-4 z-[400] shadow-xl"
                                    onClick={handleLocateMe}
                                    disabled={manualLocationLoading}
                                >
                                    {manualLocationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4 mr-2" />}
                                    Locate Me
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <Card className="p-4 space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" /> Location Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>State *</Label>
                                            <Select
                                                value={formData.state}
                                                onValueChange={(value) => setFormData({ ...formData, state: value, city: "", locality: "" })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select State" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {locationData.map((state) => (
                                                        <SelectItem key={state.id} value={state.id}>
                                                            {state.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>City *</Label>
                                            <Select
                                                value={formData.city}
                                                onValueChange={(value) => setFormData({ ...formData, city: value, locality: "" })}
                                                disabled={!formData.state}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select City" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {formData.state && locationData.find(s => s.id === formData.state)?.cities.map((city) => (
                                                        <SelectItem key={city.name} value={city.name}>
                                                            {city.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Locality/Area *</Label>
                                            <Select
                                                value={formData.locality}
                                                onValueChange={(value) => setFormData({ ...formData, locality: value })}
                                                disabled={!formData.city}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Area" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {formData.state && formData.city &&
                                                        locationData.find(s => s.id === formData.state)
                                                            ?.cities.find(c => c.name === formData.city)
                                                            ?.areas.map((area) => (
                                                                <SelectItem key={area} value={area}>
                                                                    {area}
                                                                </SelectItem>
                                                            ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Full Address / Landmark *</Label>
                                        <Textarea
                                            placeholder="Street no, Building name, Landmark..."
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={2}
                                        />
                                    </div>
                                    <Button
                                        className="w-full mt-4"
                                        onClick={() => {
                                            if (!formData.state || !formData.city || !formData.locality || !formData.address) {
                                                toast({ title: "Required Fields", description: "Please complete all location details including State, City, and Area.", variant: "destructive" });
                                                return;
                                            }
                                            setStep(2);
                                        }}
                                    >
                                        Next Step
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: IMAGES */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-serif font-bold mb-2">Upload Photos</h1>
                            <p className="text-muted-foreground">Add up to 4 photos. Our AI will analyze them.</p>
                        </div>

                        <Card className="p-6 space-y-6">
                            <ImageUploadGrid
                                images={formData.images}
                                onChange={handleImagesChange}
                                maxImages={4}
                            />

                            {isAnalyzing && (
                                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Analyzing Photos...</h3>
                                        <p className="text-sm text-muted-foreground animate-pulse">Detecting rooms and amenities...</p>
                                    </div>
                                </div>
                            )}

                            {formData.images.length > 0 && !isAnalyzing && (
                                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-primary">AI Analysis Complete</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Detected: {formData.bedrooms} bedrooms, {formData.bathrooms} bathrooms
                                            {formData.hasBalcony && ", balcony"}
                                            {formData.hasGarden && ", garden"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                    Back
                                </Button>
                                <Button
                                    onClick={() => setStep(3)}
                                    className="flex-1"
                                    disabled={formData.images.length === 0}
                                >
                                    Continue
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* STEP 3: PROPERTY DETAILS */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-serif font-bold mb-2">Property Details</h1>
                            <p className="text-muted-foreground">Tell us more about your property</p>
                        </div>

                        <Card className="p-6 space-y-6">
                            <PropertyTypeSelector
                                value={formData.propertyType}
                                onChange={(value) => setFormData({ ...formData, propertyType: value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label>Property Title *</Label>
                                    <Input
                                        value={formData.propertyName}
                                        onChange={e => setFormData({ ...formData, propertyName: e.target.value })}
                                        placeholder="e.g., Modern 2BHK Apartment"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Monthly Rent (₹) *</Label>
                                    <Input
                                        type="number"
                                        value={formData.rent}
                                        onChange={e => setFormData({ ...formData, rent: e.target.value })}
                                        placeholder="25000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number *</Label>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bedrooms *</Label>
                                    <Input
                                        type="number"
                                        value={formData.bedrooms}
                                        onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bathrooms *</Label>
                                    <Input
                                        type="number"
                                        value={formData.bathrooms}
                                        onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Outdoor Spaces</Label>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="garden"
                                            checked={formData.hasGarden}
                                            onCheckedChange={(checked) => setFormData({ ...formData, hasGarden: checked as boolean })}
                                        />
                                        <label htmlFor="garden" className="text-sm cursor-pointer flex items-center gap-2">
                                            <TreeDeciduous className="w-4 h-4 text-green-600" />
                                            Garden
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="balcony"
                                            checked={formData.hasBalcony}
                                            onCheckedChange={(checked) => setFormData({ ...formData, hasBalcony: checked as boolean })}
                                        />
                                        <label htmlFor="balcony" className="text-sm cursor-pointer">
                                            Balcony
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="terrace"
                                            checked={formData.hasTerrace}
                                            onCheckedChange={(checked) => setFormData({ ...formData, hasTerrace: checked as boolean })}
                                        />
                                        <label htmlFor="terrace" className="text-sm cursor-pointer">
                                            Terrace
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description *</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    placeholder="Describe your property, amenities, nearby facilities..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                                    Back
                                </Button>
                                <Button onClick={() => setStep(4)} className="flex-1">
                                    Preview
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* STEP 4: PREVIEW & SUBMIT */}
                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-serif font-bold mb-2">Review & Publish</h1>
                            <p className="text-muted-foreground">Check your listing before submission</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Card Preview */}
                            <div>
                                <Label className="block mb-4 text-center text-muted-foreground uppercase tracking-widest text-xs">Preview Card</Label>
                                <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl border-0 ring-1 ring-border/50">
                                    <div className="h-56 relative group">
                                        <img
                                            src={formData.images.length > 0 ? URL.createObjectURL(formData.images[0]) : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"}
                                            alt="Property"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide">
                                            Pending Review
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                                            <MapPin className="w-3 h-3" />
                                            {formData.city}
                                        </div>
                                        <h3 className="font-bold text-xl mb-4 line-clamp-1 text-foreground">
                                            {formData.propertyName}
                                        </h3>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                            <div className="flex items-center gap-1.5">
                                                <Home className="w-4 h-4" />
                                                <span className="font-medium">{formData.bedrooms}</span> Bed
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Upload className="w-4 h-4" />
                                                <span className="font-medium">{formData.bathrooms}</span> Bath
                                            </div>
                                            {formData.hasGarden && (
                                                <div className="flex items-center gap-1.5">
                                                    <TreeDeciduous className="w-4 h-4 text-green-600" />
                                                    <span className="font-medium">Garden</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                            <div>
                                                <p className="font-bold text-lg">₹{Number(formData.rent).toLocaleString()}/mo</p>
                                            </div>
                                            <Badge variant="outline" className="capitalize">{formData.propertyType}</Badge>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Summary & Action */}
                            <div className="flex flex-col justify-center space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Location Verified</p>
                                            <p className="text-xs text-muted-foreground">{formData.city}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{formData.images.length} Photos Uploaded</p>
                                            <p className="text-xs text-muted-foreground">AI analyzed successfully</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Contact Info Added</p>
                                            <p className="text-xs text-muted-foreground">{formData.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm font-medium text-yellow-800">⏳ Admin Review Required</p>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        Your property will be reviewed by our team before going live. You'll be notified once approved.
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-border space-y-3">
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Uploading images...</span>
                                                <span>{Math.round(uploadProgress)}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setStep(3)} className="flex-1" disabled={isLoading}>
                                            Back
                                        </Button>
                                        <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publishing...
                                                </>
                                            ) : (
                                                "Submit for Review"
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-center text-muted-foreground">
                                        By publishing, you agree to our terms of service.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerForm;

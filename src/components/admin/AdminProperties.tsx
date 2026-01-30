import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, MapPin, BadgeCheck, BrainCircuit, X, Check } from "lucide-react";
// import { getProperties, Property } from "@/stores/propertyStore"; // REMOVE MOCK
import { useToast } from "@/hooks/use-toast";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import AIAnalysisModal from "./AIAnalysisModal";
import { analyzeProperty, AIAnalysisResult } from "@/services/aiService";

// Define Property Interface matching Firestore
interface Property {
  id: string;
  propertyName: string;
  propertyType: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  image?: string; // or images array
  images?: string[]; // Array of image URLs
  ownerName: string;
  email?: string;
  status?: "pending_verification" | "approved" | "rejected";
  uid: string;
  description?: string;
  securityDeposit?: number;
}

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // AI Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Real-time listener
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const props: Property[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Property));
      setProperties(props);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching properties:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "properties", id));
      toast({
        title: "Property Deleted",
        description: "The property has been removed permanently.",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async (property: Property) => {
    setSelectedProperty(property);
    setIsAnalyzing(true);
    setIsAIModalOpen(true); // Open immediately to show loading if we want, or wait

    try {
      const result = await analyzeProperty(property);
      setAiResult(result);
    } catch (error) {
      console.error("Analysis failed", error);
      toast({ title: "Analysis Failed", variant: "destructive" });
      setIsAIModalOpen(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateDoc(doc(db, "properties", id), { status });
      toast({
        title: `Property ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The property has been ${status}.`,
      });
      setIsAIModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({ title: "Update Failed", variant: "destructive" });
    }
  };

  const pendingProperties = properties.filter(p => p.status === 'pending_verification');
  const verifiedProperties = properties.filter(p => !p.status || p.status === 'approved'); // Treat missing status as approved (legacy)

  return (
    <div className="space-y-8">
      {/* Pending Reviews Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-primary">
          <BrainCircuit className="w-6 h-6" /> Pending Approvals
          <Badge variant="secondary" className="ml-2">{pendingProperties.length}</Badge>
        </h2>

        {pendingProperties.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending properties to review.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingProperties.map(property => (
              <Card key={property.id} className="bg-card border-l-4 border-l-yellow-500">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : property.image ? (
                        <img src={property.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <HomeIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{property.propertyName}</h3>
                      <p className="text-sm text-muted-foreground">{property.address}, {property.city}</p>
                      <p className="text-xs text-muted-foreground mt-1">Owner: {property.ownerName}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      className="flex-1 md:flex-none gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => handleAnalyze(property)}
                    >
                      <BrainCircuit className="w-4 h-4" /> AI Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Verified Properties List */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Verified Properties
            <Badge variant="outline">{verifiedProperties.length} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verifiedProperties.length > 0 ? (
            <div className="space-y-4">
              {verifiedProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : property.image ? (
                        <img src={property.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <HomeIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{property.propertyName}</h3>
                        <BadgeCheck className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {property.address}, {property.city}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize">{property.propertyType}</Badge>
                        <span className="text-sm text-muted-foreground">by {property.ownerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{property.rent.toLocaleString()}/mo</p>
                      <p className="text-sm text-muted-foreground">{property.bedrooms} bed • {property.bathrooms} bath</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No verified properties found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AIAnalysisModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        data={aiResult}
        property={selectedProperty}
        onApprove={(id) => updateStatus(id, 'approved')}
        onReject={(id) => updateStatus(id, 'rejected')}
        isProcessing={isAnalyzing} // close enough, re-using state for simplicity
      />
    </div>
  );
};

const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
)

export default AdminProperties;

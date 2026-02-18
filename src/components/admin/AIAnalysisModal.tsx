import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, UserCheck, DollarSign, Activity } from "lucide-react";
import { AIAnalysisResult } from "@/services/aiService";


// Define a local interface that matches what we need, compatible with both Firestore and Store properties
export interface AnalyzableProperty {
    id: string;
    propertyName: string;
    ownerName: string;
    [key: string]: any; // Allow other properties
}

interface AIAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: AIAnalysisResult | null;
    property: AnalyzableProperty | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    isProcessing: boolean;
}

const CircularProgress = ({ value, label, subLabel, color = "text-primary" }: { value: number; label: string; subLabel?: string; color?: string }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-muted/20"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="64"
                        cy="64"
                    />
                    <circle
                        className={color}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="64"
                        cy="64"
                        style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className={`text-2xl font-bold ${color}`}>{value}%</span>
                </div>
            </div>
            <p className="font-medium mt-2 text-sm">{label}</p>
            {subLabel && <p className="text-xs text-muted-foreground">{subLabel}</p>}
        </div>
    );
};

const AIAnalysisModal = ({ isOpen, onClose, data, property, onApprove, onReject, isProcessing }: AIAnalysisModalProps) => {
    if (!data || !property) return null;

    const trustColor = data.trustScore > 80 ? "text-green-500" : data.trustScore > 60 ? "text-yellow-500" : "text-destructive";
    const riskColor = data.riskAssessment.level === "Low" ? "bg-green-100 text-green-700" : data.riskAssessment.level === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <DialogTitle className="text-2xl font-serif">AI Property Analysis Report</DialogTitle>
                        <Badge variant="outline" className="px-3 py-1">
                            {new Date().toLocaleDateString()}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Analysis for <span className="font-semibold text-foreground">{property.propertyName}</span> by <span className="font-semibold text-foreground">{property.ownerName}</span>
                    </p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                    {/* Main Scores */}
                    <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-muted/30 rounded-xl border border-border">
                        <CircularProgress
                            value={data.trustScore}
                            label="Trust Score"
                            subLabel="Overall Reliability"
                            color={trustColor}
                        />
                        <div className="w-full mt-6 space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Completeness</span>
                                    <span>{data.completenessScore}%</span>
                                </div>
                                <Progress value={data.completenessScore} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Responsiveness</span>
                                    <span>{data.ownerMetrics.responsiveness}%</span>
                                </div>
                                <Progress value={data.ownerMetrics.responsiveness} className="h-2" />
                            </div>
                        </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Owner Dashboard Card */}
                        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                            <h3 className="font-semibold flex items-center gap-2 mb-4">
                                <UserCheck className="w-5 h-5 text-primary" />
                                Owner Performance Dashboard
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-muted/50 rounded-lg text-center">
                                    <p className="text-xs text-muted-foreground uppercase">Verification</p>
                                    <p className="font-bold text-foreground">{data.ownerMetrics.verificationLevel}</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg text-center">
                                    <p className="text-xs text-muted-foreground uppercase">Tenant Satisfaction</p>
                                    <div className="flex items-center justify-center gap-1 font-bold">
                                        {data.ownerMetrics.tenantSatisfaction} <span className="text-yellow-500">★</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price & Risk */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-border rounded-xl">
                                <h4 className="text-sm font-medium flex items-center gap-2 mb-2 text-muted-foreground">
                                    <DollarSign className="w-4 h-4" /> Price Analysis
                                </h4>
                                <p className={`text-lg font-bold ${data.priceAnalysis.rating === 'Fair' ? 'text-green-600' : 'text-foreground'}`}>
                                    {data.priceAnalysis.rating}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 leading-tight">
                                    {data.priceAnalysis.marketComparison}
                                </p>
                            </div>
                            <div className="p-4 border border-border rounded-xl">
                                <h4 className="text-sm font-medium flex items-center gap-2 mb-2 text-muted-foreground">
                                    <AlertTriangle className="w-4 h-4" /> Risk Assessment
                                </h4>
                                <Badge variant="secondary" className={`${riskColor} border-none mb-2`}>
                                    {data.riskAssessment.level} Risk
                                </Badge>
                                <ul className="text-xs text-muted-foreground list-disc list-inside">
                                    {data.riskAssessment.factors.map((factor, i) => (
                                        <li key={i}>{factor}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* AI Recommendation */}
                        <div className={`p-4 rounded-xl border ${data.recommendation === 'Approve' ? 'bg-green-50/50 border-green-200' : 'bg-yellow-50/50 border-yellow-200'}`}>
                            <h4 className="text-sm font-bold flex items-center gap-2 mb-1">
                                <Activity className="w-4 h-4" />
                                AI Recommendation
                            </h4>
                            <p className="text-foreground font-medium">{data.recommendation}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-3 sm:gap-0">
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Cancel
                    </Button>
                    <div className="flex w-full sm:w-auto gap-3">
                        <Button
                            variant="destructive"
                            className="flex-1 sm:flex-none gap-2"
                            onClick={() => onReject(property.id)}
                            disabled={isProcessing}
                        >
                            <XCircle className="w-4 h-4" /> Reject
                        </Button>
                        <Button
                            className="flex-1 sm:flex-none gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => onApprove(property.id)}
                            disabled={isProcessing}
                        >
                            <CheckCircle className="w-4 h-4" /> Approve
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AIAnalysisModal;

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  getRequestsByOwner, 
  updateRequestStatus, 
  BookingRequest 
} from "@/stores/bookingStore";

interface OwnerRequestsProps {
  ownerId: string;
  ownerName: string;
  propertyName: string;
}

const OwnerRequests = ({ ownerId, ownerName, propertyName }: OwnerRequestsProps) => {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);

  useEffect(() => {
    loadRequests();
  }, [ownerId]);

  const loadRequests = () => {
    const ownerRequests = getRequestsByOwner(ownerId);
    setRequests(ownerRequests);
  };

  const handleApprove = (request: BookingRequest) => {
    const updated = updateRequestStatus(request.id, "approved");
    if (updated) {
      toast({
        title: "Booking Approved! ✓",
        description: `You have approved the booking request from ${request.userName}. A confirmation has been sent to ${request.userEmail}.`,
      });
      loadRequests();
      setSelectedRequest(null);
    }
  };

  const handleReject = (request: BookingRequest) => {
    const updated = updateRequestStatus(request.id, "rejected");
    if (updated) {
      toast({
        title: "Booking Rejected",
        description: `The booking request from ${request.userName} has been rejected.`,
        variant: "destructive",
      });
      loadRequests();
      setSelectedRequest(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">Pending</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-500/20 text-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-500/20 text-red-600">Rejected</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (selectedRequest) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Request Details
            </CardTitle>
            <Button variant="ghost" onClick={() => setSelectedRequest(null)}>
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{selectedRequest.userName}</h3>
            {getStatusBadge(selectedRequest.status)}
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{selectedRequest.userEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{selectedRequest.userPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Move-in: {formatDate(selectedRequest.moveInDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Duration: {selectedRequest.duration} Months</span>
            </div>
          </div>

          {selectedRequest.message && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Message</span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedRequest.message}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Requested on: {formatDate(selectedRequest.createdAt)}
          </p>

          {selectedRequest.status === "pending" && (
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={() => handleApprove(selectedRequest)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Booking
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleReject(selectedRequest)}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          )}

          {selectedRequest.status === "approved" && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">This booking has been approved</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Confirmation sent to {selectedRequest.userEmail}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          Booking Requests
          {requests.filter(r => r.status === "pending").length > 0 && (
            <Badge className="ml-2">{requests.filter(r => r.status === "pending").length} New</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <ClipboardList className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No Booking Requests</h3>
            <p className="text-sm text-muted-foreground">
              When users request to book your property, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div 
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                      {request.userName.charAt(0)}
                    </div>
                    <span className="font-medium">{request.userName}</span>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Move-in: {formatDate(request.moveInDate)} • {request.duration} months</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnerRequests;

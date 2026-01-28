import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, FileText } from "lucide-react";
import { getBookingRequests, updateRequestStatus, BookingRequest } from "@/stores/bookingStore";
import { useToast } from "@/hooks/use-toast";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setBookings(getBookingRequests());
  }, []);

  const handleStatusUpdate = (id: string, status: "approved" | "rejected") => {
    updateRequestStatus(id, status);
    setBookings(getBookingRequests());
    toast({
      title: status === "approved" ? "Booking Approved" : "Booking Rejected",
      description: `The booking request has been ${status}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-green-500 border-green-500"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-red-500 border-red-500"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            All Booking Requests
            <Badge variant="secondary">{bookings.length} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-4 rounded-lg border border-border bg-background"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={booking.propertyImage} 
                        alt={booking.propertyName}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">{booking.propertyName}</h3>
                        <p className="text-sm text-muted-foreground">Owner: {booking.ownerName}</p>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground">Requested by</p>
                      <p className="font-medium text-foreground">{booking.userName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{booking.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Move-in Date</p>
                      <p className="font-medium text-foreground">{booking.moveInDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">{booking.duration}</p>
                    </div>
                  </div>

                  {booking.message && (
                    <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded mb-3">
                      "{booking.message}"
                    </p>
                  )}

                  {booking.status === "pending" && (
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate(booking.id, "approved")}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleStatusUpdate(booking.id, "rejected")}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No booking requests yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Booking requests will appear here when users submit them.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;

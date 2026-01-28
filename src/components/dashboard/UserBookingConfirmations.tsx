import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Home, Calendar, Clock, MapPin } from "lucide-react";
import { getBookingRequests, BookingRequest } from "@/stores/bookingStore";

const UserBookingConfirmations = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  useEffect(() => {
    // Get all approved bookings - in a real app, filter by logged-in user
    const allBookings = getBookingRequests();
    const approvedBookings = allBookings.filter(b => b.status === "approved");
    setBookings(approvedBookings);
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (bookings.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-green-500/30 bg-green-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          Booking Confirmations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              className="p-4 bg-background rounded-lg border border-green-500/20"
            >
              <div className="flex items-start gap-4">
                <img 
                  src={booking.propertyImage} 
                  alt={booking.propertyName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{booking.propertyName}</h4>
                    <Badge className="bg-green-600">Confirmed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Owner: {booking.ownerName}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Move-in: {formatDate(booking.moveInDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{booking.duration} Months</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 p-3 bg-green-500/10 rounded-md">
                <p className="text-sm text-green-700">
                  🎉 Congratulations! Your booking has been approved. The owner will contact you at {booking.userEmail} with further details.
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBookingConfirmations;

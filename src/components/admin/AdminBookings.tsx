import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Loader2, Home, CheckCircle, XCircle } from "lucide-react";
import { BookingRequest } from "@/stores/bookingStore";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for all bookings
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsList: BookingRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        bookingsList.push({
          id: doc.id,
          propertyId: data.propertyId || "",
          ownerId: data.ownerId || "",
          ownerName: data.ownerName || "",
          propertyName: data.propertyName || "",
          propertyImage: data.propertyImage || "",
          userName: data.userName || "",
          userEmail: data.userEmail || "",
          userPhone: data.userPhone || "",
          moveInDate: data.moveInDate || "",
          duration: data.duration || "",
          message: data.message || "",
          status: data.status || "pending",
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        });
      });
      setBookings(bookingsList);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-green-500 border-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-red-500 border-red-500"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                      {booking.propertyImage ? (
                        <img
                          src={booking.propertyImage}
                          alt={booking.propertyName}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                          <Home className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
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
                      <p className="font-medium text-foreground">{booking.duration} months</p>
                    </div>
                  </div>

                  {booking.message && (
                    <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded mb-3">
                      "{booking.message}"
                    </p>
                  )}

                  {/* Admin view-only - owners manage bookings */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">
                      📌 Note: Property owners manage booking approvals from their dashboard.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground font-medium">No booking requests yet.</p>
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

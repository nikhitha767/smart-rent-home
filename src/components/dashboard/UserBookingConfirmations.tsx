import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, Star } from "lucide-react";
import { getApprovedBookingsForUser, BookingRequest } from "@/stores/bookingStore";
import { hasUserRatedBooking, getRatingByBooking } from "@/stores/ratingStore";
import RatingForm from "@/components/RatingForm";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const UserBookingConfirmations = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [ratedBookings, setRatedBookings] = useState<Set<string>>(new Set());
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
        setBookings([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const unsubscribeBookings = getApprovedBookingsForUser(userEmail, (approvedBookings) => {
      setBookings(approvedBookings);

      // Check which bookings have been rated
      const rated = new Set<string>();
      approvedBookings.forEach(b => {
        if (hasUserRatedBooking(b.id)) {
          rated.add(b.id);
        }
      });
      setRatedBookings(rated);
    });

    return () => unsubscribeBookings();
  }, [userEmail]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleRateClick = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setShowRatingForm(true);
  };

  const handleRatingSubmit = () => {
    // loadBookings(); // No need to reload, real-time listener handles updates if any
    setShowRatingForm(false);
  };

  const getBookingRating = (bookingId: string) => {
    const rating = getRatingByBooking(bookingId);
    return rating?.rating || 0;
  };

  if (bookings.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mb-6 border-green-500/30 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Booking Confirmations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isRated = ratedBookings.has(booking.id);
              const userRating = getBookingRating(booking.id);

              return (
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

                  {/* Rating Section */}
                  <div className="mt-4 pt-4 border-t border-border">
                    {isRated ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Your Rating:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= userRating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{userRating}/5</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRateClick(booking)}
                        >
                          Update Rating
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          How was your experience? Rate this property!
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleRateClick(booking)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate Property
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rating Form Modal */}
      {selectedBooking && (
        <RatingForm
          isOpen={showRatingForm}
          onClose={() => {
            setShowRatingForm(false);
            setSelectedBooking(null);
          }}
          bookingId={selectedBooking.id}
          propertyId={selectedBooking.ownerId}
          propertyName={selectedBooking.propertyName}
          userName={selectedBooking.userName}
          userEmail={selectedBooking.userEmail}
          onRatingSubmit={handleRatingSubmit}
        />
      )}
    </>
  );
};

export default UserBookingConfirmations;

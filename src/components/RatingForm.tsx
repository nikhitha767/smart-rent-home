import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { addRating } from "@/stores/ratingStore";
import { useToast } from "@/hooks/use-toast";

interface RatingFormProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  propertyId: string;
  propertyName: string;
  userName: string;
  userEmail: string;
  onRatingSubmit: () => void;
}

const RatingForm = ({
  isOpen,
  onClose,
  bookingId,
  propertyId,
  propertyName,
  userName,
  userEmail,
  onRatingSubmit,
}: RatingFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Click on the stars to rate the property.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    addRating({
      propertyId,
      bookingId,
      userName,
      userEmail,
      rating,
      review: review.trim(),
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    
    toast({
      title: "Thank you for your rating!",
      description: "Your feedback helps other users find great properties.",
    });

    setIsSubmitting(false);
    setRating(0);
    setReview("");
    onRatingSubmit();
    onClose();
  };

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Rate Your Experience</DialogTitle>
          <DialogDescription>
            How was your experience with <span className="font-medium text-foreground">{propertyName}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= displayRating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-lg font-medium text-foreground">
                {displayRating > 0 ? displayRating : "-"} / 5
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review">Your Review (Optional)</Label>
            <Textarea
              id="review"
              placeholder="Share your experience with this property..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[100px] resize-none bg-background border-border"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {review.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="flex-1 btn-primary"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingForm;

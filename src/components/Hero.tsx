import { Search, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-house.jpg";

interface HeroProps {
  onNavigate: (page: string) => void;
}

const Hero = ({ onNavigate }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful modern home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/60 to-charcoal/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
      </div>

      {/* Animated Decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-300" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 flex flex-col items-center text-center">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-4 animate-fade-up">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary-foreground font-medium">
              AI-Powered Verification
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary-foreground mb-4 animate-fade-up animation-delay-100">
            Find Your Perfect <span className="text-primary">Rental Home</span>
            <span className="block">With AI Trust</span>
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base text-primary-foreground/80 mb-6 max-w-lg mx-auto animate-fade-up animation-delay-200">
            Our AI-powered platform verifies property owners, ensuring you find legitimate, 
            trustworthy rental properties. No middlemen, no fraud—just secure home rentals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up animation-delay-300">
            <Button
              onClick={() => onNavigate("dashboard")}
              className="btn-primary flex items-center gap-2 text-sm h-11 px-6"
            >
              <Search className="w-4 h-4" />
              Find Properties
            </Button>
            <Button
              onClick={() => onNavigate("owner-form")}
              variant="outline"
              className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground h-11 px-6 text-sm"
            >
              List Your Property
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center animate-fade-up animation-delay-400">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs">AI Verified Owners</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">500+</span>
              </div>
              <span className="text-xs">Properties Listed</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <div className="w-8 h-8 rounded-full bg-sky/20 flex items-center justify-center">
                <span className="text-sm font-bold text-sky">98%</span>
              </div>
              <span className="text-xs">Trust Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

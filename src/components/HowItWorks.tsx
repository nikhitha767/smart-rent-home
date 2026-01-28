import { UserPlus, Search, Shield, Key } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: UserPlus,
    title: "Create Account",
    description:
      "Sign up as a tenant or property owner. Our simple registration takes less than 2 minutes.",
    color: "bg-sky-light text-sky",
  },
  {
    id: 2,
    icon: Search,
    title: "Search Properties",
    description:
      "Browse verified properties by location, type, and budget. Filter to find your perfect match.",
    color: "bg-primary/10 text-primary",
  },
  {
    id: 3,
    icon: Shield,
    title: "AI Verification",
    description:
      "Our AI system verifies owner authenticity by analyzing profiles, documents, and behavioral patterns.",
    color: "bg-sage-light text-accent",
  },
  {
    id: 4,
    icon: Key,
    title: "Book Securely",
    description:
      "Connect with verified owners and complete your booking with confidence. Move in hassle-free.",
    color: "bg-secondary text-secondary-foreground",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="section-title">Simple Steps to Your New Home</h2>
          <p className="section-subtitle">
            Our AI-powered platform makes finding and renting a home secure and effortless
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-sky via-primary to-accent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className="relative animate-fade-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Step Card */}
                  <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                    {/* Step Number */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-soft">
                      {step.id}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-5`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (Mobile/Tablet) */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <div className="w-0.5 h-8 bg-border" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-up animation-delay-500">
          {[
            { value: "1000+", label: "Happy Tenants" },
            { value: "500+", label: "Verified Owners" },
            { value: "98%", label: "Trust Score" },
            { value: "24/7", label: "AI Support" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-card shadow-soft"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

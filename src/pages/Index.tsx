import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryButtons from "@/components/CategoryButtons";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import OwnerForm from "@/components/OwnerForm";
import Dashboard from "@/components/Dashboard";
import PropertyDetails from "@/components/PropertyDetails";

type PageType = "home" | "owner-form" | "dashboard" | "property-details" | "profile";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setCurrentPage("property-details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOwnerFormSubmit = () => {
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "owner-form":
        return (
          <OwnerForm
            onBack={() => handleNavigate("home")}
            onSubmit={handleOwnerFormSubmit}
          />
        );
      case "dashboard":
        return <Dashboard onPropertyClick={handlePropertyClick} />;
      case "property-details":
        return (
          <PropertyDetails
            propertyId={selectedPropertyId || "1"}
            onBack={() => handleNavigate("dashboard")}
          />
        );
      case "profile":
        return (
          <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
                My Profile
              </h1>
              <p className="text-muted-foreground">Profile page coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <CategoryButtons onCategorySelect={(cat) => {
              handleNavigate("dashboard");
            }} />
            <HowItWorks />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      {renderPage()}
      {currentPage === "home" && <Footer />}
    </div>
  );
};

export default Index;

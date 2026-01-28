import Hero from "@/components/Hero";
import CategoryButtons from "@/components/CategoryButtons";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    navigate(`/${page === "home" ? "" : page}`);
  };

  return (
    <>
      <Hero onNavigate={handleNavigate} />
      <CategoryButtons onCategorySelect={(category) => navigate(`/dashboard?type=${category}`)} />
      <HowItWorks />
      <Footer />
    </>
  );
};

export default Home;

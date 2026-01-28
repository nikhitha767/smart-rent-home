import UserDashboard from "@/components/UserDashboard";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return <UserDashboard onPropertyClick={handlePropertyClick} />;
};

export default DashboardPage;

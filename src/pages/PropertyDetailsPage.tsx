import PropertyDetails from "@/components/PropertyDetails";
import { useNavigate, useParams } from "react-router-dom";

const PropertyDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <PropertyDetails
      propertyId={id || "1"}
      onBack={() => navigate("/dashboard")}
    />
  );
};

export default PropertyDetailsPage;

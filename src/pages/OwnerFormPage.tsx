import OwnerForm from "@/components/owner/OwnerForm";
import { useNavigate } from "react-router-dom";

const OwnerFormPage = () => {
  const navigate = useNavigate();

  return (
    <OwnerForm
      onBack={() => navigate("/")}
      onSubmit={() => navigate("/owner/dashboard")}
    />
  );
};

export default OwnerFormPage;

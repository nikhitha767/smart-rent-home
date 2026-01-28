import OwnerForm from "@/components/OwnerForm";
import { useNavigate } from "react-router-dom";

const OwnerFormPage = () => {
  const navigate = useNavigate();

  return (
    <OwnerForm
      onBack={() => navigate("/")}
      onSubmit={() => navigate("/dashboard")}
    />
  );
};

export default OwnerFormPage;

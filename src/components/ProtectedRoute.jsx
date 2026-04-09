import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { isLoaded, userId } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500 w-12 h-12" />
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

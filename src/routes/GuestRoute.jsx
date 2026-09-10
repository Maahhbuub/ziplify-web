import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import AuthLoader from "../components/AuthLoader";

const GuestRoute = ({ children }) => {
    const { user, authLoading } = useAuth();

    if (authLoading) return <AuthLoader />;
    if (user) return <Navigate to="/dashboard" replace />;

    return children;
};
export default GuestRoute;

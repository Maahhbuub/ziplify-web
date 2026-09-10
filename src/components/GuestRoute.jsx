import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";

const GuestRoute = ({ children }) => {
    const { user, authLoading } = useAuth();
    if (authLoading)
        return <h2>Checking authentication...</h2>;
    if (user)
        return <Navigate to="/dashboard" replace />;

    return children;
};
export default GuestRoute;

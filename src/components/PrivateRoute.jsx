import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";

const PrivateRoute = ({ children }) => {
    const { user, authLoading } = useAuth();
    if (authLoading)
        return <h2>Checking authentication...</h2>;
    if (!user)
        return <Navigate to="/auth/login" replace />;

    return children;
};
export default PrivateRoute;
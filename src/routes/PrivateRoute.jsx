import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import AuthLoader from "../components/AuthLoader";

const PrivateRoute = ({ children }) => {
    const { user, authLoading } = useAuth();

    if (authLoading) return <AuthLoader />;
    if (!user) return <Navigate to="/auth/login" replace />;

    return children;
};
export default PrivateRoute;

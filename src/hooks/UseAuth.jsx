import { useContext } from "react"
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
    const user = useContext(AuthContext);
    if (!user)
        throw new Error("User Not found");
    return user;
}
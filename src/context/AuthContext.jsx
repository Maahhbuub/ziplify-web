import { createContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../api/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await api.get("/user/me");
            setUser(res.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const register = async (formData) => {
        const res = await api.post("/auth/register", formData);
        // setAccessToken(res.data.accessToken);
        // setUser(res.data.user);
        return res.data;
    };

    const login = async (formData) => {
        const res = await api.post("/auth/login", formData);
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setAccessToken("");
        setUser(null);
    };

    const clearSession = () => {
        setAccessToken("");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, authLoading, register, login, logout, checkAuth, clearSession }}>
            {children}
        </AuthContext.Provider>
    );
};

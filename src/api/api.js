import axios from "axios";

let accessToken = "";
export const setAccessToken = (token) => { accessToken = token || ""; };
export const getAccessToken = () => accessToken;

const AUTH_ROUTES = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh-token",
    "/auth/logout"
];

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

api.interceptors.response.use(null, async (error) => {
    const req = error.config;
    const is401 = error.response?.status === 401;
    const isAuthRoute = AUTH_ROUTES.some((r) => req?.url?.includes(r));

    if (req && is401 && !req._retry && !isAuthRoute) {
        req._retry = true;
        try {
            const { data } = await api.post("/auth/refresh-token");
            setAccessToken(data.accessToken);
            req.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(req);
        } catch {
            setAccessToken("");
        }
    }
    return Promise.reject(error);
});

export default api;
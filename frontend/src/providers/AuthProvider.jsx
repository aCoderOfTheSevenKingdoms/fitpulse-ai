import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { setUser, clearUser } from "../redux/features/userSlice";
import axios from "axios";
import logger from "../utils/logger";

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.user || {});

    useEffect(() => {
       const fetchUser = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
                {withCredentials: true}
            );
            dispatch(setUser(response?.data?.user));
        } catch (error) {
            logger.error(`[AUTH PROVIDER ERROR] ${error?.message}`);
            dispatch(clearUser());
        }
       };

       fetchUser();
    }, []);

    if(loading){
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return children;
} 

export default AuthProvider;


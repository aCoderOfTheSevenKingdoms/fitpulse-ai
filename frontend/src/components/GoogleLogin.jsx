import { useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice"
import { useNavigate } from "react-router-dom";
import {showInfo, showSuccess, showError} from '../utils/toast';
import logger from '../utils/logger';

const GoogleLogin = () => {
    const googleButton = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const initializeGoogleLogin = () => {
            if (!googleButton.current) return;

            // Check if Google script is loaded
            if (window.google && window.google.accounts) {
                // Check if Client ID is available
                const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

                if (!clientId) {
                    console.error("Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID or GOOGLE_CLIENT_ID in your environment.");
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse
                });

                // Render the Google button but make it invisible 
                // so it overlays our custom button
                window.google.accounts.id.renderButton(
                    googleButton.current,
                    {
                        theme: "filled_black",
                        size: "large",
                        type: "standard",
                        text: "continue_with",
                        shape: "rectangular",
                        logo_alignment: "left",
                        width: "1000" // Large width to ensure it covers the container
                    }
                );
            } else {
                // Retry if script not loaded yet
                setTimeout(initializeGoogleLogin, 100);
            }
        };

        initializeGoogleLogin();
    }, []);

    // SEND THE TOKEN RECEIVED FROM GOOGLE TO THE BACKEND
    function handleCredentialResponse(response) {
        const idToken = response.credential;
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
            { idToken },
            { withCredentials: true })
            .then(response => {
                // console.log(response.data);
                dispatch(setUser(response.data.user));
                if (response.data.isPasswordSet) {
                    showSuccess(response.data.message || "Logged in successfully");
                    navigate("/");
                } else {
                    showInfo("Please set your password");
                    navigate("/set-password");
                }
            })
            .catch(error => {
                logger.error(`[GOOGLE OAUTH ERROR] ${error.response?.data?.message}`);
                showError(error.response?.data?.message || "Failed to login with Google");
            });
    }

    return (
        <div className="relative w-full max-w-sm mx-auto group">
            {/* Custom Button Design */}
            <div className="w-full py-2.5 px-4 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-lg group-hover:shadow-cyan-500/10 active:scale-[0.98]">
                {/* Custom Google 'G' Logo (No background) */}
                <div className="w-5 h-5 relative flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.225 -9.429 56.472 -10.689 57.25 L -10.689 60.15 L -6.824 60.15 C -4.561 58.07 -3.264 55.009 -3.264 51.509 Z" />
                            <path fill="#34A853" d="M -14.754 63.239 C -11.519 63.239 -8.804 62.156 -6.824 60.15 L -10.689 57.25 C -11.764 57.97 -13.139 58.39 -14.754 58.39 C -17.849 58.39 -20.468 56.311 -21.429 53.538 L -25.42 53.538 L -25.42 56.618 C -23.49 60.488 -19.442 63.239 -14.754 63.239 Z" />
                            <path fill="#FBBC05" d="M -21.429 53.538 C -21.696 52.741 -21.829 51.889 -21.829 51.009 C -21.829 50.129 -21.696 49.277 -21.429 48.479 L -21.429 45.399 L -25.42 45.399 C -26.23 47.019 -26.692 48.949 -26.692 51.009 C -26.692 53.069 -26.23 54.999 -25.42 56.618 L -21.429 53.538 Z" />
                            <path fill="#EA4335" d="M -14.754 43.629 C -12.984 43.629 -11.404 44.239 -10.154 45.429 L -6.729 42.019 C -8.804 40.078 -11.519 38.929 -14.754 38.929 C -19.442 38.929 -23.49 41.68 -25.42 45.399 L -21.429 48.479 C -20.468 45.709 -17.849 43.629 -14.754 43.629 Z" />
                        </g>
                    </svg>
                </div>
                <span className="text-white font-medium text-sm">Continue with Google</span>
            </div>

            {/* Hidden Google Button Overlay */}
            <div
                ref={googleButton}
                className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden z-20"
                aria-hidden="true"
            >
                {/* The Google button rendered here will capture clicks but be invisible */}
            </div>
        </div>
    );
};

export default GoogleLogin;


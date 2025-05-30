import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify'; // Import toast

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if(data.success){
                setIsLoggedin(true);
                await getUserData();
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const getUserData = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/user/data`);
            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch (error) {
            console.error("Get user data failed:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin, 
        setIsLoggedin,
        userData, 
        setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}
import React, { createContext, useEffect, useState } from 'react';
import UseAxiosPublic from '../hook/UseAxiosPublic';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const axiosPublic = UseAxiosPublic();

    const loginUser = async (email, password) => {
        try {
            const res = await axiosPublic.post('/loginStaff', {
                email,
                password
            });

            console.log("LOGIN RESPONSE:", res.data);

            if (res.data.success) {
                const token = res.data.jwtToken;

                // Save token
                localStorage.setItem('token', token);

                // Decode JWT
                const decodedUser = jwtDecode(token);

                // Save user
                setUser(decodedUser);
                setIsAuthenticated(true);

                return res.data;
            } else {
                return {
                    success: false,
                    message: res.data.message || "Login failed"
                };
            }

        } catch (err) {
            console.log("LOGIN ERROR:", err);

            return {
                success: false,
                message: err.response?.data?.message || "Login failed"
            };
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        try {
            if (token) {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const logOutUser =()=>{
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);

    }

    const authInfo = {
        user,
        loading,
        isAuthenticated,
        loginUser,
        logOutUser,
        error
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

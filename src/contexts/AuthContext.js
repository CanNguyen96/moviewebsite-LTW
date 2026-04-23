import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Khởi tạo user từ localStorage khi ứng dụng load
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Lỗi parse user từ localStorage", err);
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        if (token) {
            localStorage.setItem("token", token);
        }
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    const updateUser = (newUserData) => {
        localStorage.setItem("user", JSON.stringify(newUserData));
        setUser(newUserData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

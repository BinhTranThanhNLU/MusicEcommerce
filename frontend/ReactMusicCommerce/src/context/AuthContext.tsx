import { createContext, type ReactNode, useState, useEffect } from "react";
import type { UserModel } from "../models/UserModel";


interface AuthContextType {
    user: UserModel | null;
    loginContext: (user: UserModel, token: string) => void;
    logoutContext: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserModel | null>(null);

    // Khi F5 lại trang, lấy user từ localStorage ra để không bị văng đăng nhập
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const loginContext = (userData: UserModel, token: string) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
    };

    const logoutContext = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, loginContext, logoutContext }}>
            {children}
        </AuthContext.Provider>
    );
};
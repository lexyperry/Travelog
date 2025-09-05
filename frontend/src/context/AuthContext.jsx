import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
    const [user,setUser] = useState(null);
    const [loading, setLoading] =  useState(true); 

    async function loadMe() {
        try { setUser(await api.me()); }
        catch {setUser(null); }
        finally {setLoading(false); }

    }
    //set user values when loaded for the first time
    useEffect(() => { loadMe(); }, []);

    const login = async (email, password) => {
        await api.login(email, password); 
        await loadMe();
     };
    const register = async (email, password) => {
        await api.register(email, password);
        await login(email, password); 
    };
    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    return (
            <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
    );
}
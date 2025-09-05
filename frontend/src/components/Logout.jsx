import React, {useState} from "react"
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext" ;

export default function Logout(){
    const nav = useNavigate();
    const { logout } = useAuth();
    const [err, setErr] = useState("");

    async function handleLogout() {
        try {
            await logout();
            nav("/login")
        }
        catch (e) {
            setErr(e.message || "Logout failed");
        }
    }
    
    return (
        <div>
            {err && 
                <div className="px-3 py-1 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition">
                    {err}
                </div>
            }
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}
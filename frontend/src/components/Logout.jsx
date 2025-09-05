import React from "react"
import { useNavigate, Link } from "react-router-dom";



export default function Logout(){
    const nav = useNavigate();
    function handleLogout() {
        nav("/login")
    }
    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    )
}
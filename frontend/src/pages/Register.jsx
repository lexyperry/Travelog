import React from 'react';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const nav = useNavigate();
    const { register } = useAuth(); 

    async function onSubmit(e) {
        e.preventDefault();
        try {
            await register(email, password); 
            nav("/");
        }
        catch (e) {
            setErr(e.message || "Register failed");
        }
    }
          

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      {err && 
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {err}
            </div>
      }
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border p-2 w-full" placeholder="Email or name" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border p-2 w-full" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-black font-medium py-3 px-6 rounded-lg transition-colors">Create account</button>
      </form>
      <div className="mt-3 text-sm">Have an account? <Link className="text-blue-600 hover:text-blue-800 font-medium hover:underline"  to="/login">Login</Link></div>
    </div>
    </div>
  );
}
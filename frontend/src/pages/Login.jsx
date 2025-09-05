import React from 'react';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext" ;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();

  async function onSubmit(e) {
      e.preventDefault();
      try { 
        await login(email,password); 
        nav("/");
        }
      catch (e) { setErr(e.message || "Login failed"); }
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Welcome Back
        </h1>

        {err && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {err}
            </div>
        )}

        <div className="space-y-4">
          <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" 
              placeholder="Email or username" 
              value={email} 
              onChange={e=>setEmail(e.target.value)}
              type="email"
          />

          <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" 
              placeholder="Password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
          />

          <button 
              onClick={onSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
              Sign In
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <button 
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline" 
              onClick={() => console.log("Navigate to register")}
            >
              Sign up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
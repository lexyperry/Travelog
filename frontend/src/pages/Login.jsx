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
        try { await login(email,password); nav("/"); }
        catch (e) { setErr(e.message || "Login failed"); }
    }
    return (
         <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border p-2 w-full" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-black text-white px-4 py-2 rounded">Sign in</button>
      </form>
      <div className="mt-3 text-sm">No account? <Link className="underline" to="/register">Register</Link></div>
    </div>
    );
}
import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("LOGIN SUCCESSFUL. WELCOME OPERATIVE.");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Intel. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] pt-20 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <h1 className="text-white font-black uppercase tracking-tighter text-3xl mb-1">
          Access Terminal
        </h1>
        <p className="text-gray-400 font-mono text-xs mb-8">
          Enter credentials to deploy
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 uppercase text-[10px] tracking-widest font-bold mb-2">
              Secure Email
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-[#050505] border border-white/10 text-white px-4 py-3 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-300 uppercase text-[10px] tracking-widest font-bold mb-2">
              Password
            </label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-[#050505] border border-white/10 text-white px-4 py-3 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(168,85,247,0.2)] mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Authenticate"
            )}
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-6 font-mono">
          New Operative?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 font-bold ml-1"
          >
            Enlist Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

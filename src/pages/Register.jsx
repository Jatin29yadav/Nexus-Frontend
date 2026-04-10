import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Register = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users/register", formData);
      toast.success("REGISTRATION COMPLETE. LOGIN TO DEPLOY.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] pt-20 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <h1 className="text-white font-black uppercase tracking-tighter text-3xl mb-1">
          Enlist Now
        </h1>
        <p className="text-gray-400 font-mono text-xs mb-8">
          Join the Nexus Pro-Circuit
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 uppercase text-[10px] tracking-widest font-bold mb-2">
              Operative Alias (Username)
            </label>
            <input
              required
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full bg-[#050505] border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-purple-500"
            />
          </div>
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
              className="w-full bg-[#050505] border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 uppercase text-[10px] tracking-widest font-bold mb-2">
              Phone
            </label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-[#050505] border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-purple-500"
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
              className="w-full bg-[#050505] border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl mt-4 shadow-[0_10px_20px_rgba(168,85,247,0.2)]"
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-6 font-mono">
          Already Enlisted?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-bold ml-1"
          >
            Access Terminal
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/imports/657e8584-5d7e-45d0-84aa-8c15c5f80e83.png";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    login(password).then(result => {
      if (result === "ok") {
        navigate("/dashboard", { replace: true });
      } else {
        setError(
          result === "invalid"
            ? "Mot de passe incorrect."
            : "Serveur injoignable : vérifiez que le site est déployé sur Netlify avec ses fonctions."
        );
        setLoading(false);
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 min-h-screen flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="glass-panel rounded-3xl p-8 md:p-10">
          <div className="flex flex-col items-center gap-5 mb-8">
            <img
              src={logo}
              alt="Sitévya"
              className="h-10 w-auto object-contain"
            />
            <div className="text-center">
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-3.5 py-1.5 mb-4">
                <Lock className="w-3 h-3 text-purple-400" />
                <span className="text-white/50 text-xs font-medium">Espace réservé à l&apos;équipe</span>
              </div>
              <h1 className="text-white text-xl font-semibold">Connexion équipe</h1>
              <p className="text-white/40 text-sm mt-1">Dashboard privé Sitévya</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full glass-card rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-white/20 outline-none focus:border-purple-500/40 border-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1.5"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 sv-gradient-bg rounded-xl py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg shadow-purple-900/25"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                  Vérification…
                </>
              ) : (
                <>
                  Accéder au dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-5">
          Accès réservé à l&apos;équipe Sitévya uniquement.
        </p>
      </motion.div>
    </motion.div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Copy,
  Check
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function AuthModal() {
  const {
    authModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    authSuccessCallback
  } = useAppContext();

  // Mode: 'login' | 'register'
  const isRegister = authModalTab === "register";

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);
  const [copiedUsername, setCopiedUsername] = useState(false);

  if (!authModalOpen) return null;

  const resetForm = () => {
    setErrorMsg("");
    setSuccessInfo(null);
    setLoading(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!identifier.trim()) {
      setErrorMsg("Please enter your username, email, or mobile number.");
      return;
    }
    if (!loginPassword) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(identifier, loginPassword);
      if (res.success) {
        if (authSuccessCallback) {
          authSuccessCallback(res.user);
        }
        closeAuthModal();
      } else {
        setErrorMsg(res.error || "Login failed. Please verify credentials.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 6 || parsedAge > 120) {
      setErrorMsg("Please enter a valid age between 6 and 120.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name,
        email,
        password,
        confirmPassword,
        age: parsedAge,
        phone: phone.trim() || undefined
      });

      if (res.success) {
        setSuccessInfo(res.user);
        if (authSuccessCallback) {
          authSuccessCallback(res.user);
        }
      } else {
        setErrorMsg(res.error || "Could not create account. Please try again.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUsername = () => {
    if (successInfo?.username) {
      navigator.clipboard.writeText(`@${successInfo.username}`);
      setCopiedUsername(true);
      setTimeout(() => setCopiedUsername(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 z-10 bg-[#12161c] border border-slate-800 text-slate-100 shadow-2xl my-auto"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* ── Success Registration Welcome Screen ── */}
        {successInfo ? (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Welcome, {successInfo.name}!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your account has been created and your scores will now synchronize with the global leaderboard.
              </p>
            </div>

            {/* Generated Unique Username Showcase */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Your Unique Permanent Username
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-mono font-black text-amber-300">
                  @{successInfo.username}
                </span>
                <button
                  onClick={handleCopyUsername}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  {copiedUsername ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedUsername ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                You can log in anytime using this unique username, your email, or your phone number.
              </p>
            </div>

            <button
              onClick={closeAuthModal}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer"
            >
              Start Using Stiknex 🚀
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-black text-xl text-white">
                  {isRegister ? "Create Stiknex Account" : "Welcome Back"}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRegister
                    ? "Save typing scores, join the leaderboard & sync notes across devices"
                    : "Sign in with your username, email, or mobile number"}
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900 border border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab("login");
                  resetForm();
                }}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  !isRegister
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab("register");
                  resetForm();
                }}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  isRegister
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ── 1. LOGIN FORM ── */}
            {!isRegister ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Username, Email, or Mobile No.
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. rahul_k72m or email@domain.com or 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 text-white font-sans"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm focus:outline-none focus:border-amber-500 text-white font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showLoginPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In to Stiknex</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ── 2. REGISTER FORM ── */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Full Name <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-white"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Email & Age (2-col) */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Email Address <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-3 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Age <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="number"
                        min="6"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="22"
                        className="w-full pl-9 pr-2 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-white text-center font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Number (Optional) */}
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Mobile Number <span className="text-slate-500">(Optional for mobile login)</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password (2-col) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Password <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full pl-10 pr-3 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Confirm <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-10 pr-3 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword((p) => !p)}
                      className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>Show Password</span>
                  </label>
                  <span className="text-[11px] text-amber-400/90">Unique @username auto-generated</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>Generating Unique Account...</span>
                  ) : (
                    <>
                      <span>Create Account &amp; Generate Username</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Privacy note */}
            <p className="text-[11px] text-slate-500 text-center mt-4">
              All tools remain 100% free and functional without an account. Registration is optional for cloud sync &amp; leaderboards.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

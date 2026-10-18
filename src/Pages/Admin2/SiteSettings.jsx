import React, { useState, useEffect } from "react";
import { Settings, Globe, Shield, Bell, Upload, Image, Trash2, Check } from "lucide-react";

const SiteSettings = () => {
  const [logoPreview, setLogoPreview] = useState("");
  const [logoSaved, setLogoSaved] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem("stkx_dashboard_logo");
    if (savedLogo) {
      setLogoPreview(savedLogo);
    }
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setLogoPreview(base64);
      localStorage.setItem("stkx_dashboard_logo", base64);
      // Dispatch storage event so other components update immediately
      window.dispatchEvent(new Event("storage"));
      setLogoSaved(true);
      setTimeout(() => setLogoSaved(false), 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    localStorage.removeItem("stkx_dashboard_logo");
    setLogoPreview("");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your Stiknex website configuration and dashboard logo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Custom Dashboard Logo */}
        <div className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/30">
              <Image size={20} className="text-violet-500" />
            </div>
            <div>
              <h3 className="font-semibold">Dashboard Logo</h3>
              <p className="text-xs text-slate-400">Upload your own logo to appear in sidebar and navbar</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Dashboard Logo" className="h-full w-full object-contain p-1" />
                ) : (
                  <span className="text-xs text-slate-400 font-bold">Default</span>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs">
                  <Upload size={14} /> Upload Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {logoPreview && (
                  <button
                    onClick={handleRemoveLogo}
                    className="ml-2 inline-flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors dark:bg-red-900/20 dark:text-red-400"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                )}
                <p className="text-[11px] text-slate-400 mt-1">Recommended: Square PNG/SVG, max 2MB</p>
              </div>
            </div>
            {logoSaved && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Check size={14} /> Logo updated across dashboard!
              </div>
            )}
          </div>
        </div>

        {/* General Settings */}
        <div className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
              <Globe size={20} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="font-semibold">General</h3>
              <p className="text-xs text-slate-400">Site name, URL, meta tags</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Site Name</label>
              <input type="text" defaultValue="Stiknex" className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-white/5 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Site URL</label>
              <input type="text" defaultValue="https://stiknex.site" className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-white/5 px-3 py-2 text-sm" />
            </div>
            <div className="pt-2">
              <button 
                onClick={() => {
                  const btn = document.getElementById('save-btn');
                  const originalText = btn.innerText;
                  btn.innerText = 'Saving...';
                  btn.disabled = true;
                  setTimeout(() => {
                    btn.innerText = 'Saved Successfully';
                    btn.classList.add('bg-green-600', 'hover:bg-green-700');
                    btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
                    setTimeout(() => {
                      btn.innerText = originalText;
                      btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                      btn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
                      btn.disabled = false;
                    }, 2000);
                  }, 800);
                }}
                id="save-btn"
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
              <Shield size={20} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold">Security</h3>
              <p className="text-xs text-slate-400">Authentication & 2FA settings</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-white/40 dark:bg-white/5 p-3">
              <div>
                <p className="text-sm font-medium">Two-Factor Auth (TOTP)</p>
                <p className="text-xs text-slate-400">Microsoft Authenticator</p>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">Active</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/40 dark:bg-white/5 p-3">
              <div>
                <p className="text-sm font-medium">Brute Force Protection</p>
                <p className="text-xs text-slate-400">5 attempts / 15 min lockout</p>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">Active</span>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/30">
              <Bell size={20} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-xs text-slate-400">Email & push notification preferences</p>
            </div>
          </div>
          <p className="text-sm text-slate-400">Notification settings coming soon.</p>
        </div>

        {/* Analytics Settings */}
        <div className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30">
              <Settings size={20} className="text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-xs text-slate-400">GA4 & tracking configuration</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">GA4 Property ID</label>
              <input type="text" defaultValue="556064917" disabled className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Google Tag</label>
              <input type="text" defaultValue="G-NQDW0GE2E3" disabled className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SiteSettings;

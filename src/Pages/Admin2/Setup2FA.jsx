import React, { useState } from "react";

const Setup2FA = () => {
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/auth/setup-2fa');
      const data = await response.json();
      
      if (data.success) {
        setQrCode(data.qrCodeUrl);
        setSecret(data.secretBase32);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch. Make sure API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Microsoft Authenticator Setup</h1>
        
        {!qrCode ? (
          <div>
            <p className="text-slate-600 mb-6 text-sm">
              Click the button below to generate your secure QR code. 
              <strong> You only need to do this once.</strong>
            </p>
            <button 
              onClick={handleGenerate} 
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              {loading ? "Generating..." : "Generate QR Code"}
            </button>
            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-slate-600 mb-4 text-sm">
              Scan this QR Code using <strong>Microsoft Authenticator</strong> or Google Authenticator.
            </p>
            <div className="bg-white p-2 border-4 border-indigo-100 rounded-xl mb-4 inline-block">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
            <p className="text-xs text-slate-500 mb-6 font-mono bg-slate-100 p-2 rounded">
              Manual Key: {secret}
            </p>
            <a 
              href="/stiknex-secure-login-portal" 
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              Go to Login Page
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setup2FA;

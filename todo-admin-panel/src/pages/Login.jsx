import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import logo from "/favicon.webp";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const captchaRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Lütfen hCaptcha doğrulamasını tamamlayın.");
      return;
    }

    setLoading(true);

    try {
      // login fonksiyonu backende axios ile post işlemi yapmalı
      await login(email, password, captchaToken);
    } catch (err) {
      console.error("Giriş hatası:", err);
      alert("Giriş başarısız. Bilgileri kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaSuccess = (token) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200 animate-fadeIn">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-14 w-14 drop-shadow-lg" />
        </div>

        {/* Başlık */}
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8 tracking-tight">
          Admin Panel Girişi
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              e-mail & username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Şifrenizi girin"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* hCaptcha */}
          <div className="flex justify-center">
            <HCaptcha
              sitekey="10000000-ffff-ffff-ffff-000000000001"
              onVerify={handleCaptchaSuccess}
              onExpire={handleCaptchaExpire}
              ref={captchaRef}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 shadow-md"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
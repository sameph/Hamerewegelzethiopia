"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, Globe, Moon, Bell, Shield, LogOut, ChevronRight, Camera, User, Phone, Mail, MapPin, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function SettingsClient() {
  const { user, login, logout } = useAuth();
  
  // Profile State
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [country, setCountry] = useState(user?.country || "");
  const [city, setCity] = useState(user?.city || "");
  const [address, setAddress] = useState(user?.address || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "👨‍🎓");
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Preferences State
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setCountry(user.country || "");
      setCity(user.city || "");
      setAddress(user.address || "");
      setProfileImage(user.profileImage || "👨‍🎓");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(`${API_URL}/auth/updatedetails`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          phone,
          country,
          city,
          address,
          profileImage
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local user state via login function (which updates context and localStorage)
        login(data.data, token!);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(`${API_URL}/auth/updatepassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        if (data.token) {
           login(user!, data.token);
        }
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || ""}${data.data.url}`;
        setProfileImage(imageUrl);
        
        // Auto-update profile with new image
        const updateRes = await fetch(`${API_URL}/auth/updatedetails`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profileImage: imageUrl }),
        });
        const updateData = await updateRes.json();
        if (updateData.success) {
          login(updateData.data, token!);
          toast.success("Profile picture updated!");
        }
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl animate-in fade-in duration-700">
      <div className="lg:col-span-2 space-y-8">
        {/* Profile Section */}
        <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#d6ff00]/30 transition-transform duration-500 group-hover:scale-105">
                {profileImage.startsWith('http') || profileImage.startsWith('/') ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-[#1a2e21]">{profileImage}</div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-[#d6ff00] rounded-full text-[#08120f] shadow-lg hover:scale-110 transition-transform"
              >
                <Camera size={16} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.username || "Guest User"}</h2>
              <p className="text-[#d6ff00]/70 text-sm font-medium uppercase tracking-wider">{user?.role || "Student"}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <User size={14} className="text-[#d6ff00]" /> Full Name
                </label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-[#d6ff00]/50 focus:outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Mail size={14} className="text-[#d6ff00]" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-[#d6ff00]/50 focus:outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Phone size={14} className="text-[#d6ff00]" /> Phone Number
                </label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-[#d6ff00]/50 focus:outline-none transition-all"
                  placeholder="+251 ..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <MapPin size={14} className="text-[#d6ff00]" /> Country
                </label>
                <input 
                  type="text" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-[#d6ff00]/50 focus:outline-none transition-all"
                  placeholder="Ethiopia"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">City</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-[#d6ff00]/50 focus:outline-none transition-all"
                  placeholder="Addis Ababa"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Address</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-[#d6ff00]/50 focus:outline-none transition-all"
                  placeholder="Bole, Addis Ababa"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#d6ff00] text-[#08120f] font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Save Information"}
            </button>
          </form>
        </section>

        {/* Security / Password Section */}
        <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Lock size={20} className="text-[#d6ff00]" /> Security & Password
          </h2>
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2 col-span-full">
                <label className="text-sm font-semibold text-slate-300">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-4 pr-12 py-3 text-sm text-slate-100 focus:border-[#d6ff00]/50 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-4 pr-12 py-3 text-sm text-slate-100 focus:border-[#d6ff00]/50 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-4 pr-12 py-3 text-sm text-slate-100 focus:border-[#d6ff00]/50 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <button 
              type="submit"
              disabled={passwordLoading}
              className="px-8 py-3.5 rounded-2xl border border-[#d6ff00]/30 bg-[#1a2e21] text-[#d6ff00] font-bold text-sm hover:bg-[#d6ff00] hover:text-[#08120f] transition-all disabled:opacity-50"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>
      </div>

      <div className="space-y-8">
        {/* Preferences */}
        <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6">LMS Preferences</h2>
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-3 mb-3">
                <Globe size={18} className="text-[#d6ff00]" />
                <span className="text-sm font-medium text-slate-100">Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 focus:border-[#d6ff00]/50 focus:outline-none appearance-none"
              >
                <option value="en">English</option>
                <option value="am">Amharic (አማርኛ)</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3 mb-3">
                <Moon size={18} className="text-[#d6ff00]" />
                <span className="text-sm font-medium text-slate-100">Theme</span>
              </label>
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                {["light", "dark", "auto"].map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => setTheme(themeOption)}
                    className={`flex-1 rounded-xl px-4 py-2 text-xs font-semibold transition-all capitalize ${
                      theme === themeOption
                        ? "bg-[#d6ff00] text-[#08120f] shadow-lg shadow-[#d6ff00]/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {themeOption}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
          <div className="space-y-3">
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Bell size={18} className={`transition-colors ${emailNotifications ? "text-[#d6ff00]" : "text-slate-500"}`} />
                <div className="text-left">
                  <span className="text-sm font-medium text-slate-100">Email Updates</span>
                  <p className="text-[10px] text-slate-500">Course & system alerts</p>
                </div>
              </div>
              <div className={`w-8 h-4 rounded-full transition-all relative ${emailNotifications ? "bg-[#d6ff00]" : "bg-white/10"}`}>
                <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${emailNotifications ? "right-1" : "left-1"}`} />
              </div>
            </button>

            <button
              onClick={() => setSmsNotifications(!smsNotifications)}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Shield size={18} className={`transition-colors ${smsNotifications ? "text-[#d6ff00]" : "text-slate-500"}`} />
                <div className="text-left">
                  <span className="text-sm font-medium text-slate-100">SMS Alerts</span>
                  <p className="text-[10px] text-slate-500">Security & login alerts</p>
                </div>
              </div>
              <div className={`w-8 h-4 rounded-full transition-all relative ${smsNotifications ? "bg-[#d6ff00]" : "bg-white/10"}`}>
                <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${smsNotifications ? "right-1" : "left-1"}`} />
              </div>
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-3xl border border-red-500/10 bg-red-500/5 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-sm font-bold text-red-300 uppercase tracking-widest mb-4">Danger Zone</h2>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20 active:scale-[0.98] transition-all font-semibold text-sm"
          >
            <LogOut size={18} /> Logout from LMS
          </button>
        </section>
      </div>
    </div>
  );
}

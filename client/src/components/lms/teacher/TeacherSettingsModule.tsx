"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, Globe, Moon, Bell, Shield, LogOut, Camera, User, Phone, Mail, MapPin, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function TeacherSettingsModule() {
  const { user, login, logout } = useAuth();
  
  // Profile State
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [country, setCountry] = useState(user?.country || "");
  const [city, setCity] = useState(user?.city || "");
  const [address, setAddress] = useState(user?.address || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "👨‍🏫");
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Preferences State
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [emailNotifications, setEmailNotifications] = useState(true);
  
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
      setProfileImage(user.profileImage || "👨‍🏫");
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
        login(data.data, token!);
        toast.success("Teacher profile updated!");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords match error");
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
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Teacher password updated!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        if (data.token) login(user!, data.token);
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (err) {
      toast.error("Error updating password");
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || ""}${data.data.url}`;
        setProfileImage(imageUrl);
        
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
          toast.success("Teacher profile picture updated!");
        }
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl animate-in slide-in-from-bottom-4 duration-700">
      <div className="lg:col-span-2 space-y-8">
        {/* Profile Card */}
        <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-[#111f16]/100">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#d6ff00]/40 p-1 group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-full overflow-hidden">
                   {profileImage.startsWith('http') ? (
                    <img src={profileImage} alt="Teacher" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-[#1a2e21]">{profileImage}</div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-[#d6ff00] rounded-full text-[#08120f] shadow-xl hover:scale-110 active:scale-95 transition-all"
              >
                <Camera size={16} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{user?.username || "Teacher Advocate"}</h2>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#d6ff00] animate-pulse"></span>
                <p className="text-[#d6ff00]/80 text-xs font-bold uppercase tracking-[0.2em]">Verified Instructor</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#d6ff00]/60 ml-1">Full Name</label>
              <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                 <input 
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white/5 bg-white/5 text-sm text-slate-100 focus:bg-white/10 focus:border-[#d6ff00]/30 focus:outline-none transition-all placeholder:text-slate-600"
                  placeholder="Full Legal Name"
                 />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#d6ff00]/60 ml-1">Email</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                 <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white/5 bg-white/5 text-sm text-slate-100 focus:bg-white/10 focus:border-[#d6ff00]/30 focus:outline-none transition-all"
                 />
              </div>
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#d6ff00]/60 ml-1">Phone</label>
              <div className="relative">
                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                 <input 
                  type="text" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white/5 bg-white/5 text-sm text-slate-100 focus:bg-white/10 focus:border-[#d6ff00]/30 focus:outline-none transition-all"
                 />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#d6ff00]/60 ml-1">Country</label>
              <div className="relative">
                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                 <input 
                  type="text" value={country} onChange={e => setCountry(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-white/5 bg-white/5 text-sm text-slate-100 focus:bg-white/10 focus:border-[#d6ff00]/30 focus:outline-none transition-all"
                 />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end pt-4">
              <button 
                type="submit" disabled={loading}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#d6ff00] to-[#b8eb00] text-[#08120f] font-black text-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(214,255,0,0.3)] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : "Update Teacher Profile"}
              </button>
            </div>
          </form>
        </section>

        {/* Security / Password Card */}
        <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
             <Lock size={20} className="text-[#d6ff00]" /> Security Management
          </h2>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrentPassword ? "text" : "password"} 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full pl-5 pr-12 py-4 rounded-2xl border border-white/5 bg-white/5 text-sm text-slate-100 focus:bg-white/10 focus:border-[#d6ff00]/30 focus:outline-none"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-5 pr-12 py-4 rounded-2xl border border-white/5 bg-white/5 text-sm text-slate-100 focus:bg-white/10 focus:border-[#d6ff00]/30 focus:outline-none"
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
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-5 pr-12 py-4 rounded-2xl border border-white/5 bg-white/5 text-sm text-slate-100 focus:bg-white/10 focus:border-[#d6ff00]/30 focus:outline-none"
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
            <div className="flex justify-start">
              <button 
                type="submit" disabled={passwordLoading}
                className="px-8 py-4 rounded-2xl border-2 border-[#d6ff00]/20 text-[#d6ff00] font-bold text-sm uppercase tracking-widest hover:border-[#d6ff00] hover:bg-[#d6ff00]/5 hover:shadow-lg transition-all"
              >
                {passwordLoading ? "Processing..." : "Secure Update"}
              </button>
            </div>
          </form>
        </section>
      </div>

      <div className="space-y-8">
        {/* Preferred Learning Settings */}
        <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
           <h2 className="text-lg font-bold text-white mb-6">Platform Preferences</h2>
           <div className="space-y-6">
            <div>
              <label className="flex items-center gap-3 mb-3">
                <Globe size={18} className="text-[#d6ff00]" />
                <span className="text-sm font-semibold text-slate-200">Interface Language</span>
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                {["en", "am"].map(lang => (
                  <button 
                    key={lang} onClick={() => setLanguage(lang)}
                    className={`py-2 text-xs font-bold uppercase rounded-xl transition-all ${language === lang ? "bg-[#d6ff00] text-[#08120f]" : "text-slate-500 hover:text-white"}`}
                  >
                    {lang === 'en' ? 'English' : 'Amharic'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-3 mb-3">
                <Moon size={18} className="text-[#d6ff00]" />
                <span className="text-sm font-semibold text-slate-200">Visual Theme</span>
              </label>
               <select 
                value={theme} onChange={e => setTheme(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none"
               >
                 <option value="light">Light Academy</option>
                 <option value="dark">Dark Mode</option>
                 <option value="system">Follow System</option>
               </select>
            </div>
           </div>
        </section>

        {/* Notifications */}
        <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-4">Instructor Alerts</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                   <p className="text-sm font-bold text-slate-100">Student Submission</p>
                   <p className="text-[10px] text-slate-500">Notify when students upload work</p>
                </div>
                <div className="w-10 h-5 bg-[#d6ff00] rounded-full p-1 relative">
                   <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                </div>
             </div>
             <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                   <p className="text-sm font-bold text-slate-100">Course Messages</p>
                   <p className="text-[10px] text-slate-500">Direct student inquiries</p>
                </div>
                <div className="w-10 h-5 bg-white/10 rounded-full p-1 relative">
                   <div className="w-3 h-3 bg-white/50 rounded-full absolute left-1"></div>
                </div>
             </div>
          </div>
        </section>

        <section className="rounded-3xl bg-red-500/5 border border-red-500/10 p-6">
           <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-4">Teacher Account</p>
           <button 
            onClick={logout}
            className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/20 font-bold transition-all"
           >
             Sign Out Safely
           </button>
        </section>
      </div>
    </div>
  );
}

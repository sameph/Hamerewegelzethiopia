"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/lib/useNotification";
import { Save, X, Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ProfileFormData {
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  address?: string;
  program?: string;
  department?: string;
  batch?: string;
  currentSemester?: string;
  profileImage?: string;
}

export default function TeacherProfileModule() {
  const { user, login } = useAuth();
  const { success, error } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileData, setProfileData] = useState<ProfileFormData>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("lms_token") : null;

  useEffect(() => {
    if (user) {
      setProfileData({
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        country: user.country || "",
        city: user.city || "",
        address: user.address || "",
        program: user.program || "",
        department: user.department || "",
        batch: user.batch || "",
        currentSemester: user.currentSemester || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  if (!user) return null;

  const profileFields = [
    "username",
    "email",
    "phone",
    "gender",
    "dateOfBirth",
    "country",
    "city",
    "address",
  ];
  const filledFields = profileFields.filter(
    (f) =>
      (user as any)[f] !== undefined &&
      (user as any)[f] !== null &&
      (user as any)[f] !== ""
  );
  const completionPercentage = Math.round(
    (filledFields.length / profileFields.length) * 100
  );
  const isComplete = completionPercentage === 100;

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (data.success) {
        success("Profile updated successfully");
        login(data.data, token!);
        setIsEditing(false);
      } else {
        error(data.message || "Failed to update profile");
      }
    } catch (err) {
      error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      error("Please fill all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      error("New password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/password/change`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        success("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
      } else {
        error(data.message || "Failed to change password");
      }
    } catch (err) {
      error("Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Completion Status */}
      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Personal Information</h2>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              isComplete
                ? "bg-[#d6ff00]/20 text-[#a5ff63] border border-[#d6ff00]/30"
                : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
            }`}
          >
            {isComplete
              ? "Profile Complete"
              : `Profile Incomplete (${completionPercentage}%)`}
          </span>
        </div>

        {!isEditing ? (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
              <p className="rounded-xl bg-white/5 p-3 text-slate-200">
                <span className="text-slate-400">Full Name:</span>{" "}
                {user.username}
              </p>
              <p className="rounded-xl bg-white/5 p-3 text-slate-200">
                <span className="text-slate-400">Email:</span> {user.email}
              </p>
              <p className="rounded-xl bg-white/5 p-3 text-slate-200">
                <span className="text-slate-400">Phone:</span>{" "}
                {profileData.phone || "Not Set"}
              </p>
              <p className="rounded-xl bg-white/5 p-3 text-slate-200">
                <span className="text-slate-400">Gender:</span>{" "}
                {profileData.gender || "Not Set"}
              </p>
              <p className="rounded-xl bg-white/5 p-3 text-slate-200">
                <span className="text-slate-400">Date of Birth:</span>{" "}
                {profileData.dateOfBirth || "Not Set"}
              </p>
              <p className="rounded-xl bg-white/5 p-3 text-slate-200">
                <span className="text-slate-400">Country:</span>{" "}
                {profileData.country || "Not Set"}
              </p>
              <p className="rounded-xl bg-white/5 p-3 text-slate-200">
                <span className="text-slate-400">City:</span>{" "}
                {profileData.city || "Not Set"}
              </p>
              <p className="rounded-xl bg-white/5 p-3 text-slate-200">
                <span className="text-slate-400">Address:</span>{" "}
                {profileData.address || "Not Set"}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 rounded-xl bg-[#a5ff63] px-4 py-2 text-sm font-semibold text-black hover:bg-[#d6ff00] transition"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-200 opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-200 opacity-50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone || ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Gender
                </label>
                <select
                  name="gender"
                  value={profileData.gender || ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth || ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={profileData.country || ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city || ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address || ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex items-center gap-2 flex-1 rounded-lg bg-[#a5ff63] px-4 py-2 font-semibold text-black hover:bg-[#d6ff00] transition disabled:opacity-50"
              >
                <Save size={18} />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 flex-1 rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/5 transition"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Professional Information */}
      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white">
          Professional Information
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <p className="rounded-xl bg-white/5 p-3 text-slate-200">
            <span className="text-slate-400">Role:</span> {user.role}
          </p>
          <p className="rounded-xl bg-white/5 p-3 text-slate-200">
            <span className="text-slate-400">Program:</span>{" "}
            {user.program || "General"}
          </p>
          <p className="rounded-xl bg-white/5 p-3 text-slate-200">
            <span className="text-slate-400">Department:</span>{" "}
            {user.department || "N/A"}
          </p>
          <p className="rounded-xl bg-white/5 p-3 text-slate-200">
            <span className="text-slate-400">Member Since:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Account Settings */}
      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white">Account Settings</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-100 hover:bg-white/5 transition"
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>
        </div>

        {showPasswordForm && (
          <form className="mt-4 space-y-4 max-w-md">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword.current ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      new: !prev.new,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a5ff63]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full rounded-lg bg-[#a5ff63] px-4 py-2 font-semibold text-black hover:bg-[#d6ff00] transition disabled:opacity-50"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

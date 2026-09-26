import { useState } from "react";
import { User, Mail, Phone, MapPin, ShieldCheck, Camera, Save, Lock, Bell } from "lucide-react";
import Swal from "sweetalert2";

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: "Vishal Mall",
    email: "admin@example.com",
    phone: "+91 00000 00000",
    role: "Administrator",
    location: "India",
    bio: "Manage store operations, products, orders and customers.",
    avatar: "",
  });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState({ orders: true, messages: true, stock: true });

  const updateProfile = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }));

  const saveProfile = (event) => {
    event.preventDefault();
    Swal.fire({ icon: "success", title: "Profile Updated", text: "Your profile changes have been saved.", confirmButtonColor: "var(--primary)" });
  };

  const updatePassword = (event) => {
    event.preventDefault();
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please complete all password fields." });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      Swal.fire({ icon: "error", title: "Passwords Do Not Match", text: "Please confirm your new password correctly." });
      return;
    }
    Swal.fire({ icon: "success", title: "Password Updated", text: "Your password has been changed successfully." });
    setPasswords({ current: "", next: "", confirm: "" });
  };

  const inputClass = "w-full rounded-xl border border-white/70 bg-white/45 px-3 py-2.5 text-sm text-(--primary) outline-none transition focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/15";
  const labelClass = "mb-1.5 block text-xs font-semibold text-(--secondary)";
  const cardClass = "rounded-2xl border border-white/65 bg-white/35 p-4 shadow-[0_8px_25px_rgba(80,120,140,0.07)] backdrop-blur-xl sm:p-5";

  return (
    <main className="min-h-full space-y-4 p-3 text-(--primary) sm:p-5">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--secondary)">Account Management</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Admin Profile</h1>
          <p className="mt-1 text-sm text-(--secondary)">Manage your personal information, security and notifications.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/45 text-(--primary)"><User size={23} /></div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className={`${cardClass} flex flex-col items-center justify-center text-center`}>
          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/75 bg-white/55 text-3xl font-bold text-(--primary)">
            {profile.avatar ? <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" /> : profile.name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <h2 className="mt-4 text-xl font-bold">{profile.name || "Admin User"}</h2>
          <p className="mt-1 text-sm text-(--secondary)">{profile.email}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-(--primary)/10 px-3 py-1 text-xs font-semibold text-(--primary)"><ShieldCheck size={14} /> {profile.role}</span>
          <div className="mt-5 w-full text-left">
            <label className={labelClass}>Profile Image URL</label>
            <div className="flex items-center gap-2"><Camera size={17} className="text-(--secondary)" /><input className={inputClass} value={profile.avatar} onChange={(e) => updateProfile("avatar", e.target.value)} placeholder="https://image-url.com/profile.jpg" /></div>
          </div>
        </div>

        <form onSubmit={saveProfile} className={`${cardClass} space-y-4`}>
          <div className="flex items-center gap-2"><User size={18} /><h2 className="font-bold">Personal Information</h2></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass}>Full Name</label><input className={inputClass} value={profile.name} onChange={(e) => updateProfile("name", e.target.value)} required /></div>
            <div><label className={labelClass}>Email Address</label><input type="email" className={inputClass} value={profile.email} onChange={(e) => updateProfile("email", e.target.value)} required /></div>
            <div><label className={labelClass}>Phone Number</label><input className={inputClass} value={profile.phone} onChange={(e) => updateProfile("phone", e.target.value)} /></div>
            <div><label className={labelClass}>Role</label><input className={inputClass} value={profile.role} onChange={(e) => updateProfile("role", e.target.value)} /></div>
            <div className="sm:col-span-2"><label className={labelClass}>Location</label><div className="flex items-center gap-2"><MapPin size={17} className="text-(--secondary)" /><input className={inputClass} value={profile.location} onChange={(e) => updateProfile("location", e.target.value)} /></div></div>
            <div className="sm:col-span-2"><label className={labelClass}>Bio</label><textarea rows={4} className={inputClass} value={profile.bio} onChange={(e) => updateProfile("bio", e.target.value)} /></div>
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"><Save size={16} /> Save Profile</button>
        </form>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={updatePassword} className={`${cardClass} space-y-4`}>
          <div className="flex items-center gap-2"><Lock size={18} /><h2 className="font-bold">Change Password</h2></div>
          {[['current', 'Current Password'], ['next', 'New Password'], ['confirm', 'Confirm New Password']].map(([key, label]) => <div key={key}><label className={labelClass}>{label}</label><input type="password" className={inputClass} value={passwords[key]} onChange={(e) => setPasswords((prev) => ({ ...prev, [key]: e.target.value }))} /></div>)}
          <button type="submit" className="rounded-xl border border-(--primary)/25 bg-white/45 px-4 py-2.5 text-sm font-semibold text-(--primary) hover:bg-white/65">Update Password</button>
        </form>

        <div className={`${cardClass} space-y-4`}>
          <div className="flex items-center gap-2"><Bell size={18} /><h2 className="font-bold">Notification Preferences</h2></div>
          {[['orders', 'Order Notifications', 'Receive alerts for new orders.'], ['messages', 'Message Notifications', 'Receive alerts for customer messages.'], ['stock', 'Low Stock Notifications', 'Receive alerts when products are low in stock.']].map(([key, title, description]) => <label key={key} className="flex cursor-pointer items-start justify-between gap-3 rounded-xl bg-white/30 p-3"><div><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-xs text-(--secondary)">{description}</p></div><input type="checkbox" checked={notifications[key]} onChange={(e) => setNotifications((prev) => ({ ...prev, [key]: e.target.checked }))} className="mt-1 h-4 w-4 accent-(--primary)" /></label>)}
        </div>
      </section>
    </main>
  );
};

export default AdminProfile;

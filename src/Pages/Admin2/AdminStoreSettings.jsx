import { useState } from "react";
import Swal from "sweetalert2";
import {
  Bell,
  Check,
  Globe,
  Lock,
  Mail,
  Palette,
  Save,
  ShieldCheck,
  Store,
  Truck,
  UserRound,
} from "lucide-react";

const initialSettings = {
  storeName: "VM Store",
  storeEmail: "support@vmstore.com",
  storePhone: "+91 98765 43210",
  storeAddress: "India",
  currency: "INR",
  timezone: "Asia/Kolkata",
  orderNotifications: true,
  lowStockNotifications: true,
  customerNotifications: true,
  maintenanceMode: false,
  guestCheckout: true,
  autoApproveReviews: false,
  shippingEnabled: true,
  freeShippingMinimum: "999",
  primaryColor: "#087F8D",
  secondaryColor: "#D7D8EF",
};

const Toggle = ({ checked, onChange, label, description }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/60 bg-white/30 p-3 backdrop-blur-xl">
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-(--primary)">{label}</span>
      <span className="mt-1 block text-xs leading-5 text-(--secondary)">{description}</span>
    </span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="peer sr-only"
    />
    <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-(--primary)" : "bg-black/15"}`}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
    </span>
  </label>
);

const Section = ({ icon: Icon, title, description, children }) => (
  <section className="rounded-2xl border border-white/65 bg-white/35 p-4 shadow-[0_8px_30px_rgba(80,120,140,0.06)] backdrop-blur-2xl sm:p-5">
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/55 text-(--primary)">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="text-sm font-bold text-(--primary) sm:text-base">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-(--secondary)">{description}</p>
      </div>
    </div>
    {children}
  </section>
);

const Field = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-semibold text-(--primary)">{label}</span>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/70 bg-white/45 px-3 py-2.5 text-sm text-(--primary) outline-none transition placeholder:text-(--muted) focus:border-(--primary) focus:bg-white/65"
    />
  </label>
);

const AdminStoreSettings = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("general");

  const updateSetting = (event) => {
    const { name, value } = event.target;
    setSettings((current) => ({ ...current, [name]: value }));
  };

  const updateToggle = (name, value) => {
    setSettings((current) => ({ ...current, [name]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Settings saved",
      text: "Your store settings have been updated successfully.",
      timer: 1800,
      showConfirmButton: false,
    });
  };

  const tabs = [
    { id: "general", label: "General", icon: Store },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "checkout", label: "Checkout & Shipping", icon: Truck },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <main className="min-h-full px-3 pb-8 text-(--primary) sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--secondary)">Admin Panel</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Store Settings</h1>
            <p className="mt-1 max-w-2xl text-sm text-(--secondary)">Manage your store information, notifications, checkout preferences and appearance.</p>
          </div>
          <button onClick={handleSave} className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90">
            <Save size={16} /> Save Changes
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-white/65 bg-white/30 p-2 backdrop-blur-2xl">
            <div className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition lg:w-full ${activeTab === id ? "bg-(--primary) text-white shadow-md" : "text-(--secondary) hover:bg-white/45 hover:text-(--primary)"}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </aside>

          <form onSubmit={handleSave} className="space-y-5">
            {activeTab === "general" && (
              <Section icon={Store} title="General Information" description="Update your store's basic information and regional preferences.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Store Name" name="storeName" value={settings.storeName} onChange={updateSetting} />
                  <Field label="Store Email" name="storeEmail" type="email" value={settings.storeEmail} onChange={updateSetting} />
                  <Field label="Store Phone" name="storePhone" value={settings.storePhone} onChange={updateSetting} />
                  <Field label="Store Address" name="storeAddress" value={settings.storeAddress} onChange={updateSetting} />
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold">Currency</span>
                    <select name="currency" value={settings.currency} onChange={updateSetting} className="w-full rounded-xl border border-white/70 bg-white/45 px-3 py-2.5 text-sm outline-none focus:border-(--primary)">
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold">Timezone</span>
                    <select name="timezone" value={settings.timezone} onChange={updateSetting} className="w-full rounded-xl border border-white/70 bg-white/45 px-3 py-2.5 text-sm outline-none focus:border-(--primary)">
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </label>
                </div>
              </Section>
            )}

            {activeTab === "notifications" && (
              <Section icon={Bell} title="Notification Preferences" description="Choose which events should trigger store notifications.">
                <div className="space-y-3">
                  <Toggle checked={settings.orderNotifications} onChange={(value) => updateToggle("orderNotifications", value)} label="New order notifications" description="Receive an alert whenever a new order is placed." />
                  <Toggle checked={settings.lowStockNotifications} onChange={(value) => updateToggle("lowStockNotifications", value)} label="Low stock notifications" description="Get notified when product inventory is running low." />
                  <Toggle checked={settings.customerNotifications} onChange={(value) => updateToggle("customerNotifications", value)} label="Customer notifications" description="Enable customer-related email and system notifications." />
                </div>
              </Section>
            )}

            {activeTab === "checkout" && (
              <Section icon={Truck} title="Checkout & Shipping" description="Configure checkout access and shipping preferences.">
                <div className="space-y-3">
                  <Toggle checked={settings.guestCheckout} onChange={(value) => updateToggle("guestCheckout", value)} label="Guest checkout" description="Allow customers to place orders without creating an account." />
                  <Toggle checked={settings.shippingEnabled} onChange={(value) => updateToggle("shippingEnabled", value)} label="Enable shipping" description="Allow shipping as a delivery method during checkout." />
                  <Toggle checked={settings.maintenanceMode} onChange={(value) => updateToggle("maintenanceMode", value)} label="Maintenance mode" description="Temporarily restrict customer access while changes are being made." />
                  <div className="pt-2 sm:max-w-sm">
                    <Field label="Free Shipping Minimum" name="freeShippingMinimum" type="number" value={settings.freeShippingMinimum} onChange={updateSetting} />
                  </div>
                </div>
              </Section>
            )}

            {activeTab === "appearance" && (
              <Section icon={Palette} title="Appearance" description="Customize the primary colors used across your store interface.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Primary Color" name="primaryColor" value={settings.primaryColor} onChange={updateSetting} placeholder="#087F8D" />
                  <Field label="Secondary Color" name="secondaryColor" value={settings.secondaryColor} onChange={updateSetting} placeholder="#D7D8EF" />
                </div>
                <div className="mt-5 rounded-xl border border-white/60 bg-white/35 p-4">
                  <p className="text-xs font-semibold text-(--primary)">Color Preview</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <div className="h-16 flex-1 rounded-xl" style={{ backgroundColor: settings.primaryColor }} />
                    <div className="h-16 flex-1 rounded-xl" style={{ backgroundColor: settings.secondaryColor }} />
                  </div>
                </div>
              </Section>
            )}

            {activeTab === "security" && (
              <Section icon={ShieldCheck} title="Security & Access" description="Control account access and review-related preferences.">
                <div className="space-y-3">
                  <Toggle checked={settings.autoApproveReviews} onChange={(value) => updateToggle("autoApproveReviews", value)} label="Auto-approve reviews" description="Automatically publish customer reviews without manual approval." />
                  <div className="rounded-xl border border-white/60 bg-white/30 p-4">
                    <div className="flex items-start gap-3">
                      <Lock size={18} className="mt-0.5 text-(--primary)" />
                      <div>
                        <p className="text-sm font-semibold">Account security</p>
                        <p className="mt-1 text-xs leading-5 text-(--secondary)">Use your authentication system to manage passwords, sessions and admin permissions. This page does not change authentication credentials.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            <div className="flex justify-end">
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90">
                <Check size={16} /> Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminStoreSettings;

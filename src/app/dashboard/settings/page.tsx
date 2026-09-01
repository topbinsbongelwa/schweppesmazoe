"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./settings.module.css";

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeCity: string;
  storeCountry: string;
  businessLicense: string;
  taxId: string;
  description: string;
  currencySymbol: string;
  emailNotifications: boolean;
  lowStockAlert: number;
  orderNotifications: boolean;
  maintenanceMode: boolean;
}

const defaultSettings: StoreSettings = {
  storeName: "Schweppes Store",
  storeEmail: "contact@schweppes.local",
  storePhone: "+1 (555) 123-4567",
  storeAddress: "123 Business Street",
  storeCity: "Business City",
  storeCountry: "USA",
  businessLicense: "BL-2024-001",
  taxId: "TAX-123456",
  description: "Premium beverages and mixers",
  currencySymbol: "$",
  emailNotifications: true,
  lowStockAlert: 10,
  orderNotifications: true,
  maintenanceMode: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [savedSettings, setSavedSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("store");

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem("storeSettings");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings(parsed);
      setSavedSettings(parsed);
    }
    setLoading(false);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setSettings((prev) => ({
      ...prev,
      [name]: name === "lowStockAlert" ? parseInt(value) : newValue,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("storeSettings", JSON.stringify(settings));
    setSavedSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className="eyebrow">SETTINGS</span>
          <h1>Store Configuration</h1>
          <p>Manage your store settings, notifications, and preferences.</p>
        </div>
        <Link href="/dashboard" className={styles.back}>
          ← Dashboard
        </Link>
      </header>

      {saveSuccess && (
        <div className={styles.success} role="alert">
          ✓ Settings saved successfully!
        </div>
      )}

      <div className={styles.container}>
        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "store" ? styles.active : ""}`}
            onClick={() => setActiveTab("store")}
          >
            Store Details
          </button>
          <button
            className={`${styles.tab} ${activeTab === "notifications" ? styles.active : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`${styles.tab} ${activeTab === "preferences" ? styles.active : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
        </nav>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>Loading settings...</div>
          ) : (
            <>
              {activeTab === "store" && (
                <form className={styles.form}>
                  <fieldset className={styles.formFieldset}>
                    <legend className={styles.formLegend}>Business Information</legend>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="storeName">Store Name</label>
                        <input
                          type="text"
                          id="storeName"
                          name="storeName"
                          value={settings.storeName}
                          onChange={handleInputChange}
                          placeholder="Your store name"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="storeEmail">Email</label>
                        <input
                          type="email"
                          id="storeEmail"
                          name="storeEmail"
                          value={settings.storeEmail}
                          onChange={handleInputChange}
                          placeholder="Store email"
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="storePhone">Phone</label>
                        <input
                          type="tel"
                          id="storePhone"
                          name="storePhone"
                          value={settings.storePhone}
                          onChange={handleInputChange}
                          placeholder="Phone number"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="currencySymbol">Currency</label>
                        <input
                          type="text"
                          id="currencySymbol"
                          name="currencySymbol"
                          value={settings.currencySymbol}
                          onChange={handleInputChange}
                          placeholder="$"
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="description">Store Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={settings.description}
                        onChange={handleInputChange}
                        placeholder="Brief description of your store"
                        rows={4}
                      />
                    </div>
                  </fieldset>

                  <fieldset className={styles.formFieldset}>
                    <legend className={styles.formLegend}>Address</legend>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="storeAddress">Street Address</label>
                        <input
                          type="text"
                          id="storeAddress"
                          name="storeAddress"
                          value={settings.storeAddress}
                          onChange={handleInputChange}
                          placeholder="123 Main Street"
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="storeCity">City</label>
                        <input
                          type="text"
                          id="storeCity"
                          name="storeCity"
                          value={settings.storeCity}
                          onChange={handleInputChange}
                          placeholder="City"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="storeCountry">Country</label>
                        <input
                          type="text"
                          id="storeCountry"
                          name="storeCountry"
                          value={settings.storeCountry}
                          onChange={handleInputChange}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </fieldset>

                  <fieldset className={styles.formFieldset}>
                    <legend className={styles.formLegend}>Compliance</legend>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="businessLicense">Business License</label>
                        <input
                          type="text"
                          id="businessLicense"
                          name="businessLicense"
                          value={settings.businessLicense}
                          onChange={handleInputChange}
                          placeholder="Business license number"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="taxId">Tax ID</label>
                        <input
                          type="text"
                          id="taxId"
                          name="taxId"
                          value={settings.taxId}
                          onChange={handleInputChange}
                          placeholder="Tax identification number"
                        />
                      </div>
                    </div>
                  </fieldset>
                </form>
              )}

              {activeTab === "notifications" && (
                <form className={styles.form}>
                  <fieldset className={styles.formFieldset}>
                    <legend className={styles.formLegend}>Notification Settings</legend>

                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={settings.emailNotifications}
                          onChange={handleInputChange}
                        />
                        <span className={styles.checkboxText}>
                          <strong>Email Notifications</strong>
                          <small>Receive notifications via email</small>
                        </span>
                      </label>
                    </div>

                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="orderNotifications"
                          checked={settings.orderNotifications}
                          onChange={handleInputChange}
                        />
                        <span className={styles.checkboxText}>
                          <strong>Order Notifications</strong>
                          <small>Get notified when new orders arrive</small>
                        </span>
                      </label>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="lowStockAlert">Low Stock Alert Threshold</label>
                      <input
                        type="number"
                        id="lowStockAlert"
                        name="lowStockAlert"
                        value={settings.lowStockAlert}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                      />
                      <small>Alert when product stock falls below this amount</small>
                    </div>
                  </fieldset>
                </form>
              )}

              {activeTab === "preferences" && (
                <form className={styles.form}>
                  <fieldset className={styles.formFieldset}>
                    <legend className={styles.formLegend}>Store Preferences</legend>

                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="maintenanceMode"
                          checked={settings.maintenanceMode}
                          onChange={handleInputChange}
                        />
                        <span className={styles.checkboxText}>
                          <strong>Maintenance Mode</strong>
                          <small>Close store to visitors while maintaining admin access</small>
                        </span>
                      </label>
                    </div>

                    <div className={styles.infoBox}>
                      <h4>Store Information</h4>
                      <div className={styles.infoGrid}>
                        <div>
                          <small>Store Name</small>
                          <strong>{settings.storeName}</strong>
                        </div>
                        <div>
                          <small>Email</small>
                          <strong>{settings.storeEmail}</strong>
                        </div>
                        <div>
                          <small>Phone</small>
                          <strong>{settings.storePhone}</strong>
                        </div>
                        <div>
                          <small>Currency</small>
                          <strong>{settings.currencySymbol}</strong>
                        </div>
                        <div>
                          <small>Location</small>
                          <strong>
                            {settings.storeCity}, {settings.storeCountry}
                          </strong>
                        </div>
                        <div>
                          <small>Status</small>
                          <strong style={{ color: settings.maintenanceMode ? "#e8374b" : "#10b981" }}>
                            {settings.maintenanceMode ? "Maintenance" : "Open"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className={styles.dangerZone}>
                      <h4>Danger Zone</h4>
                      <p>These actions cannot be undone.</p>
                      <button type="button" className={styles.dangerButton}>
                        Reset to Default Settings
                      </button>
                    </div>
                  </fieldset>
                </form>
              )}

              <div className={styles.actions}>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={styles.saveButton}
                >
                  {hasChanges ? "Save Changes" : "No Changes"}
                </button>
                {hasChanges && (
                  <button
                    onClick={() => {
                      setSettings(savedSettings);
                    }}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

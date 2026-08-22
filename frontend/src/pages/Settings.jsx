import React from "react";
import { useAuth } from "../hook/useAuth";
import { toast } from "sonner";

const Settings = () => {
  const { logoutHandler, user } = useAuth();
  const logout = async () => {
    try {
      const response = await logoutHandler();
      toast.success("Logout successfully.");
      return response;
    } catch (err) {
      const message = "something went wrong. please try again.";
      toast.error(err.response?.data?.message ?? message);
      console.log(err.message);
    }
  };

  return (
    <main className="p-4 bg-background min-h-screen">
      <div>
        <p className="text-text-secondary mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Account */}
      <div className="bg-surface rounded-2xl shadow-xl mt-8 mb-10 px-5">
        <h2 className="text-xl font-semibold text-text-primary py-5 border-b border-text-secondary">
          Account
        </h2>

        <div className="py-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-text-primary">Username</p>
            <p className="text-text-secondary">{user.username}</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-text-primary">Email</p>
            <p className="text-text-secondary">{user.email}</p>
          </div>
        </div>

        {/* preferences  */}

        <h2 className="text-xl font-semibold text-text-primary py-5 border-b border-text-secondary">
          Preferences
        </h2>
        <div className="py-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-text-primary">Currency</p>
            <p className="text-text-secondary">₹ INR</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-text-primary">Theme</p>
            <p className="text-text-secondary">Light</p>
          </div>
        </div>

        {/* session  */}

        <h2 className="text-xl font-semibold text-text-primary py-5 border-b border-text-secondary">
          Session
        </h2>
        <div className="py-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-text-secondary">Sign out of your account</p>
            <button
              onClick={logout}
              className="bg-danger active:scale-95 text-white rounded-md px-2 py-2 cursor-pointer transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;

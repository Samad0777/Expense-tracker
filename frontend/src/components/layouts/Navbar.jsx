import React from "react";
import { User } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/transactions": "Transactions",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };
  return (
    <nav className="bg-surface py-6 px-4 flex items-center justify-between shadow-lg">
      <div>
        <h2 className="text-2xl">{pageTitles[location.pathname]}</h2>
      </div>
      <div>
        <User className="cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;

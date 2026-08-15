import React from "react";
import { User,Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = ({onMenuClick}) => {
  const location = useLocation();
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/transactions": "Transactions",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };
  return (
    <>
    {/* desktop */}
    <nav className="hidden bg-surface py-6 px-4 md:flex items-center justify-between shadow-lg">
      <div>
        <h2 className="text-2xl">{pageTitles[location.pathname]}</h2>
      </div>
      <div>
        <User className="cursor-pointer" />
      </div>
    </nav>

    {/* mobile */}
    <nav  className="md:hidden bg-surface py-6 px-4 flex items-center justify-between shadow-lg">
      <Menu onClick={onMenuClick} size={20}/>
      <div>
        <h2 className="text-2xl">{pageTitles[location.pathname]}</h2>
      </div>
      <div>
        <User className="cursor-pointer" />
      </div>
    </nav>
    </>
  );
};

export default Navbar;

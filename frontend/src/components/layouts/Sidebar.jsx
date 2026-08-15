import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ChartPie,
  Settings,
  X
} from "lucide-react";

const Sidebar = ({ isOpen,onMenuClick }) => {

  return (
    <>
        <aside className="w-56 h-screen shrink-0 bg-background-sidebar text-white px-4 hidden md:block">
          <div className="border-b border-text-secondary px-2 py-8 mb-2">
            <h2>Expense Tracker</h2>
          </div>
          <h3 className="text-text-secondary">Menu</h3>
          <div className="flex flex-col gap-2 mt-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-primary rounded-xl px-4 py-2"
                  : "flex items-center gap-2 text-text-secondary rounded-xl px-4 py-2"
              }
            >
              <LayoutDashboard size={15} />
              Dashboard
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-primary rounded-xl px-4 py-2"
                  : "flex items-center gap-2 text-text-secondary rounded-xl px-4 py-2"
              }
            >
              <ArrowLeftRight size={15} />
              Transactions
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-primary rounded-xl px-4 py-2"
                  : "flex items-center gap-2 text-text-secondary rounded-xl px-4 py-2"
              }
            >
              <ChartPie size={15} />
              Analytics
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-primary rounded-xl px-4 py-2"
                  : "flex items-center gap-2 text-text-secondary rounded-xl px-4 py-2"
              }
            >
              <Settings size={15} />
              Settings
            </NavLink>
          </div>
        </aside>
      
      {isOpen && (
        <aside className={`absolute w-50 h-screen shrink-0 bg-background-sidebar text-white px-4 md:hidden transition-transform duration-300`}>
          <div className="flex items-center justify-between border-b border-text-secondary px-2 py-8 mb-2">
            <h2>Expense Tracker</h2>
            <X onClick={onMenuClick} className="text-text-secondary" size={20}/>
          </div>
          <h3 className="text-text-secondary">Menu</h3>
          <div className="flex flex-col gap-2 mt-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-primary rounded-xl px-4 py-2"
                  : "flex items-center gap-2 text-text-secondary rounded-xl px-4 py-2"
              }
            >
              <LayoutDashboard size={15} />
              Dashboard
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-primary rounded-xl px-4 py-2"
                  : "flex items-center gap-2 text-text-secondary rounded-xl px-4 py-2"
              }
            >
              <ArrowLeftRight size={15} />
              Transactions
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-primary rounded-xl px-4 py-2"
                  : "flex items-center gap-2 text-text-secondary rounded-xl px-4 py-2"
              }
            >
              <ChartPie size={15} />
              Analytics
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-primary rounded-xl px-4 py-2"
                  : "flex items-center gap-2 text-text-secondary rounded-xl px-4 py-2"
              }
            >
              <Settings size={15} />
              Settings
            </NavLink>
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;

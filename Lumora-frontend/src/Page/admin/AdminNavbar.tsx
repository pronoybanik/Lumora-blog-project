import React from "react";
import {
  Search,
  Bell,
  BarChart2,
  FileText,
  Edit3,
  Bookmark,
  History,
  CreditCard,
  Home,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

type AdminNavbarProps = {
  children?: React.ReactNode;
};

const menuItems = [
  {
    icon: Home,
    label: "Home",
    routes: "/",
  },
  {
    icon: BarChart2,
    label: "Dashboard",
    routes: "/adminDashboard/dashboard",
  },
  {
    icon: FileText,
    label: "Users",
    routes: "/adminDashboard/userPage",
  },
  {
    icon: Edit3,
    label: "My Blogs",
    routes: "/adminDashboard/BlogPage",
  },
  {
    icon: Bookmark,
    label: "Bookmarks",
    routes: "/adminDashboard/bookmarks",
  },
  {
    icon: History,
    label: "Reading History",
    routes: "/adminDashboard/history",
  },
];

export default function AdminNavbar({ children }: AdminNavbarProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-slate-100 min-h-[calc(100vh-72px)] flex flex-col justify-between py-8 px-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-400 px-3 mb-3">
              MENU
            </p>
            <ul className="space-y-1">
              {menuItems.map(({ icon: Icon, label, routes }) => (
                <li key={label}>
                  <NavLink
                    to={routes}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`
                    }
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-400 px-3 mb-3">
              SETTINGS
            </p>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <CreditCard className="w-[18px] h-[18px]" strokeWidth={2} />
              Payments
            </a>
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

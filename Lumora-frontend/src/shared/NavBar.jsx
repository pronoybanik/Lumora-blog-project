import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log(user);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="relative max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            L
          </div>
          <span className="text-lg font-semibold text-indigo-700">Lumora</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-medium">
          {/* <a href="#" className="text-slate-900">
            Explore
          </a>
          <a href="#" className="hover:text-slate-900">
            Categories
          </a> */}
          <Link to="/" className="hover:text-slate-900">
            Home
          </Link>
          <Link to="/blogList" className="hover:text-slate-900">
            Blog List
          </Link>
          <Link to="/pricing" className="hover:text-slate-900">
            Pricing
          </Link>
          {user && user.role !== "AUTHOR" && user.role !== "ADMIN" && (
            <Link to="/become-author" className="hover:text-slate-900">
              Become an author
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link
              to="/adminDashboard/dashboard"
              className="hover:text-slate-900"
            >
              admin dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 text-sm text-slate-400 w-48">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span>Search articles...</span>
          </div>
          {user && (
            <Link
              to="/createBlogs"
              className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-full"
            >
              Write
            </Link>
          )}
          <button className="hidden sm:block text-slate-500 hover:text-slate-700" aria-label="Notifications">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.65V5a2 2 0 1 0-4 0v.35A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          {!loading &&
            (user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/profilePage"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-700"
                >
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {initials || "U"}
                  </span>
                  <span className="hidden lg:inline max-w-24 truncate">
                    {user.name}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 transition-colors"
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-700 px-3 py-2 rounded-full transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors text-white text-sm font-medium px-4 py-2 rounded-full shadow-sm shadow-indigo-200"
                >
                  Sign up
                </Link>
              </div>
            ))}
        </div>

      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-100 bg-white shadow-lg shadow-slate-200/40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="grid gap-1 text-sm font-medium text-slate-700">
              <Link onClick={closeMobileMenu} to="/" className="rounded-lg px-3 py-2.5 hover:bg-slate-50">
                Home
              </Link>
              <Link onClick={closeMobileMenu} to="/blogList" className="rounded-lg px-3 py-2.5 hover:bg-slate-50">
                Blog List
              </Link>
              <Link onClick={closeMobileMenu} to="/pricing" className="rounded-lg px-3 py-2.5 hover:bg-slate-50">
                Pricing
              </Link>
              {user && user.role !== "AUTHOR" && user.role !== "ADMIN" && (
                <Link onClick={closeMobileMenu} to="/become-author" className="rounded-lg px-3 py-2.5 hover:bg-slate-50">
                  Become an author
                </Link>
              )}
              {user?.role === "ADMIN" && (
                <Link onClick={closeMobileMenu} to="/adminDashboard/dashboard" className="rounded-lg px-3 py-2.5 hover:bg-slate-50">
                  Admin dashboard
                </Link>
              )}
              {user && (
                <Link onClick={closeMobileMenu} to="/createBlogs" className="mt-1 rounded-lg bg-indigo-600 px-3 py-2.5 text-white hover:bg-indigo-700">
                  Write a blog
                </Link>
              )}

              {!loading && !user && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  <Link onClick={closeMobileMenu} to="/login" className="rounded-lg border border-slate-200 px-3 py-2.5 text-center text-slate-700 hover:bg-slate-50">
                    Log in
                  </Link>
                  <Link onClick={closeMobileMenu} to="/register" className="rounded-lg bg-indigo-600 px-3 py-2.5 text-center text-white hover:bg-indigo-700">
                    Sign up
                  </Link>
                </div>
              )}

              {!loading && user && (
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 px-3 pt-3">
                  <Link onClick={closeMobileMenu} to="/profilePage" className="flex items-center gap-2 text-slate-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      {initials || "U"}
                    </span>
                    <span>{user.name}</span>
                  </Link>
                  <button type="button" onClick={handleLogout} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-rose-50 hover:text-rose-600">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default NavBar;

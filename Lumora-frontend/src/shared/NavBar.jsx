import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            L
          </div>
          <span className="text-lg font-semibold text-indigo-700">Lumora</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-medium">
          <a href="#" className="text-slate-900">
            Explore
          </a>
          <a href="#" className="hover:text-slate-900">
            Categories
          </a>
          <a href="#" className="hover:text-slate-900">
            Pricing
          </a>
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
          <button className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-full">
            Write
          </button>
          <button className="text-slate-500 hover:text-slate-700">
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
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-700 px-3 py-2 rounded-full transition-colors">
              Log in
            </Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors text-white text-sm font-medium px-4 py-2 rounded-full shadow-sm shadow-indigo-200">
              Sign up
            </Link>
          </div>
          <img
            src="https://i.pravatar.cc/40?img=68"
            alt="profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default NavBar;

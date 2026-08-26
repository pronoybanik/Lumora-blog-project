import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
const Login =()=> {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire up your authentication logic here.
    console.log({ ...form, remember });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="inline-block text-xs font-semibold tracking-wide text-slate-400 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm">
            Lumora
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-500">Sign in to your Lumora account.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold tracking-wide text-slate-600 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold tracking-wide text-slate-600"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-slate-500">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:from-indigo-500 hover:to-violet-500 transition"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium tracking-wide text-slate-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-50 border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              <User className="h-4 w-4 text-slate-500" />
              Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
            >
              <User className="h-4 w-4" />
              Github
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-slate-500">
          Don't have an account?{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Create one now
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
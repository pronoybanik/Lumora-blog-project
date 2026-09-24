import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear error when user starts typing
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      console.log("register log", response);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Registration failed.");
      }
      if (result?.success) {
        setSuccess(result.message);
        alert(result.message);
      }

      console.log("Registered user:", result.data);

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Join Lumora
          </h1>

          <p className="mt-2 text-slate-500">
            Create an account to begin your journey.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold tracking-wide text-slate-600 mb-1.5"
              >
                FULL NAME
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                <input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange("name")}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition disabled:opacity-60"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold tracking-wide text-slate-600 mb-1.5"
              >
                EMAIL ADDRESS
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold tracking-wide text-slate-600 mb-1.5"
              >
                PASSWORD
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
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

              {/* Password strength */}
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full ${
                      form.password.length > i * 2
                        ? "bg-indigo-400"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400 cursor-pointer"
              />

              <label
                htmlFor="terms"
                className="text-sm text-slate-500 leading-snug"
              >
                I agree to Lumora's{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!agreed || loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Creating Account..." : "Create Account"}

              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

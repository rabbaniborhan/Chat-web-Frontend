import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ImagePattern from "../components/ImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFromData] = useState({
    email: "",
    password: "",
  });
  const { login, isLogging } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("email is required");
    if (!/\S+@\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("password is required");
    if (formData.password.length < 8)
      return toast.error("password must be at least 8 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValidation = validateForm();

    if (isValidation === true) {
      login(formData);
    }
  };
  return (
    <div className="min-h-screen mt-12  grid lg:grid-cols-2">
      {/*left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 ">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8 ">
            <div className="flex flex-col items-center gap-2 group ">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors ">
                {" "}
                <img src="/logo.png" className="w-10 h-10 " />
              </div>
              <h1 className="text-2xl font-bold  mt-2 ">Welcome Back </h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/*email input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute z-20 inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  {" "}
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="brborhan70@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFromData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/*password input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute z-20 inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  {" "}
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input  input-bordered w-full pl-10`}
                  placeholder="****************"
                  value={formData.password}
                  onChange={(e) =>
                    setFromData({ ...formData, password: e.target.value })
                  }
                />

                <button
                  type="button"
                  className="absolute z-20 inset-y-0 right-0 pr-3 flex items-center "
                >
                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(false)}
                      className="size-5 text-base-content/40"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(true)}
                      className="size-5 text-base-content/40"
                    />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full ">
              {isLogging ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className=" text-center">
            <p className="text-base-content/60">
              Don't have an account
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/*Right side */}

      <ImagePattern
        title="Welcome Back!"
        subtitle="Sign in to continue your conversations and catch up with your messages."
      />
    </div>
  );
};

export default Login;

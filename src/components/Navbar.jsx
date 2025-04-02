import { LogOut, Settings, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  return (
    <header className=" border-b border-base-200 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container max-auto px-4 h-16">
        <div
          className="flex
         items-center justify-between h-full"
        >
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-1 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg br-primary/10 flex items-center justify-center ">
                <img src="/logo.png" className="w-8 h-8 " />
              </div>
              <h1 className="text-lg font-bold">Talksy</h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className={`btn btn-sm gap-2 transition-colors`}
              to={"/settings"}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap2`}>
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex gap-2 cursor-pointer items-center"
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline"> Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

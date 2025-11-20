import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  ChevronDown,
  History,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

import LogoImage from "../assets/logo/rotsu-logo.png";

const DropdownItem = ({ icon: Icon, label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg
      ${danger
        ? "text-red-600 hover:bg-red-50"
        : "text-gray-700 hover:bg-[#E6EEF6] hover:text-[#0D2A4A]"
      }
    `}
  >
    <Icon className="w-4 h-4 mr-3" />
    {label}
  </button>
);

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className="
          fixed top-4 sm:top-6 left-1/2 -translate-x-1/2
          z-50 w-[95%] sm:w-[90%] max-w-5xl
          bg-white/90 backdrop-blur-xl
          px-4 sm:px-6 md:px-10 py-3 sm:py-4 rounded-full
          border border-[#D6E3F3]
          shadow-[0_6px_30px_rgba(0,0,0,0.18)]
          flex justify-between items-center
        "
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img
            src={LogoImage}
            alt="Rotsu Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          <span className="text-xl sm:text-2xl font-bold text-[#0D2A4A]">
            Rotsu
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          <Link
            to="/"
            className="text-gray-700 hover:text-[#0D2A4A] transition font-medium"
          >
            Home
          </Link>
          <Link
            to="/menu"
            className="text-gray-700 hover:text-[#0D2A4A] transition font-medium"
          >
            Menu
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-[#0D2A4A] transition font-medium"
          >
            Contact
          </Link>
        </div>

        {/* Right Side - User Dropdown & Burger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Dropdown - Desktop */}
          <div className="hidden sm:block relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#E6EEF6] transition-all duration-200"
            >
              <div className="w-8 h-8 bg-[#E6EEF6] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#0D2A4A]" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 backdrop-blur-sm">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <DropdownItem
                      icon={History}
                      label="Riwayat Pemesanan"
                      onClick={() => handleNavigation("/order-history")}
                    />

                    <DropdownItem
                      icon={Settings}
                      label="Pengaturan Akun"
                      onClick={() => handleNavigation("/settings")}
                    />

                    <div className="border-t border-gray-100 mt-2 pt-1">
                      <DropdownItem
                        icon={LogOut}
                        label="Logout"
                        onClick={handleLogout}
                        danger
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center px-4 pb-3 border-b">
                      <div className="w-12 h-12 bg-[#E6EEF6] rounded-full mx-auto flex items-center justify-center">
                        <User className="w-6 h-6 text-[#0D2A4A]" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Selamat datang di Rotsu!
                      </p>
                    </div>

                    <DropdownItem
                      icon={LogIn}
                      label="Login"
                      onClick={() => handleNavigation("/login")}
                    />
                    <DropdownItem
                      icon={UserPlus}
                      label="Register"
                      onClick={() => handleNavigation("/register")}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Burger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-[#E6EEF6] transition-all duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#0D2A4A]" />
            ) : (
              <Menu className="w-6 h-6 text-[#0D2A4A]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info Section */}
            {isLoggedIn ? (
              <div className="pb-4 mb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E6EEF6] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#0D2A4A]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center pb-4 mb-4 border-b">
                <div className="w-16 h-16 bg-[#E6EEF6] rounded-full mx-auto flex items-center justify-center mb-2">
                  <User className="w-8 h-8 text-[#0D2A4A]" />
                </div>
                <p className="text-sm text-gray-500">Selamat datang di Rotsu!</p>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-2 mb-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-[#E6EEF6] hover:text-[#0D2A4A] transition rounded-lg font-medium"
              >
                Home
              </Link>
              <Link
                to="/menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-[#E6EEF6] hover:text-[#0D2A4A] transition rounded-lg font-medium"
              >
                Menu
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-[#E6EEF6] hover:text-[#0D2A4A] transition rounded-lg font-medium"
              >
                Contact
              </Link>
            </div>

            {/* User Actions */}
            <div className="border-t pt-4">
              {isLoggedIn ? (
                <>
                  <DropdownItem
                    icon={History}
                    label="Riwayat Pemesanan"
                    onClick={() => handleNavigation("/order-history")}
                  />
                  <DropdownItem
                    icon={Settings}
                    label="Pengaturan Akun"
                    onClick={() => handleNavigation("/settings")}
                  />
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <DropdownItem
                      icon={LogOut}
                      label="Logout"
                      onClick={handleLogout}
                      danger
                    />
                  </div>
                </>
              ) : (
                <>
                  <DropdownItem
                    icon={LogIn}
                    label="Login"
                    onClick={() => handleNavigation("/login")}
                  />
                  <DropdownItem
                    icon={UserPlus}
                    label="Register"
                    onClick={() => handleNavigation("/register")}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
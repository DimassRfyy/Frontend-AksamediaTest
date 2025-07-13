import React from "react";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../services/api";

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const navigate = useNavigate();
  const user = React.useMemo(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      console.log('Logout gagal')
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("#user-dropdown")) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <nav className="w-full bg-white shadow px-4 py-3 flex items-center justify-between">
      <div className="text-xl font-bold text-blue-700">Aksamedia Test FE</div>
      <div className="relative" id="user-dropdown">
        <button className="flex items-center space-x-2 focus:outline-none" onClick={() => setDropdownOpen((v) => !v)}>
          <span className="font-medium text-gray-700">{user?.name || "User"}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-20">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

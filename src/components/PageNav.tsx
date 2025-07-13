import React from "react";
import { NavLink } from "react-router-dom";

const navs = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/divisions", label: "Divisions" },
  { to: "/employees", label: "Employees" },
];

const PageNav: React.FC = () => (
  <nav className="flex gap-2 mb-6">
    {navs.map((nav) => (
      <NavLink key={nav.to} to={nav.to} className={({ isActive }) => `px-4 py-2 rounded font-medium transition ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}>
        {nav.label}
      </NavLink>
    ))}
  </nav>
);

export default PageNav;

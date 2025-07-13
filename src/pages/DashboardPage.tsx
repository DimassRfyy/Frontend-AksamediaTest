import React from "react";
import Navbar from "../components/Navbar";
import PageNav from "../components/PageNav";

const DashboardPage = () => {
  const user = React.useMemo(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <PageNav />
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            {user ? (
              <p className="text-lg">
                Selamat datang, <span className="font-semibold">{user.name}</span>!
              </p>
            ) : (
              <p className="text-lg">Selamat datang!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

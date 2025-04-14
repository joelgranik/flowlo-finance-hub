
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto py-6 px-4 md:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

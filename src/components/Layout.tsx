import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebase";
import { getUserRole } from "../services/userService";
import Navbar from "./Navbar";

const Layout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const role = await getUserRole(currentUser.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    // State is handled by onAuthStateChanged
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isLoggedIn={!!user}
        user={user}
        role={userRole}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Outlet />
    </div>
  );
};

export default Layout;

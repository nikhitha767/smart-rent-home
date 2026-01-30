import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Menu, X, User as UserIcon, LogOut, LayoutDashboard, MessageSquare, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { User } from "firebase/auth";

interface NavbarProps {
  isLoggedIn: boolean;
  user?: User | null;
  role?: string | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar = ({ isLoggedIn, user, role, onLogin, onLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignIn = () => {
    setShowSignIn(false);
    onLogin();
  };

  const handleSignUp = () => {
    setShowSignUp(false);
    onLogin();
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  // derive display name from email if displayName is missing
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  const getDashboardRoute = () => {
    if (role === 'admin') return '/admin';
    if (role === 'owner') return '/owner/dashboard';
    return '/dashboard';
  };

  const getBadge = () => {
    if (role === 'admin') return <div className="absolute -bottom-1 -right-1 bg-destructive text-destructive-foreground text-[8px] font-bold px-1 rounded shadow-sm">ADMIN</div>;
    if (role === 'owner') return <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-[8px] font-bold px-1 rounded shadow-sm">PRO</div>;
    return null;
  };

  const getAvatarBorder = () => {
    if (role === 'admin') return 'border-2 border-destructive';
    if (role === 'owner') return 'border-2 border-yellow-500';
    return '';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-bold text-foreground">
                Rent<span className="text-primary">AI</span>
              </span>
            </button>

            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/owner-form")}
                className="text-foreground hover:text-primary hover:bg-primary/10"
              >
                Become a House Owner
              </Button>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-full"
                    >
                      <div className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center relative ${getAvatarBorder()}`}>
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={displayName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary-foreground font-bold text-sm">{userInitial}</span>
                        )}
                        {getBadge()}
                      </div>
                      <span className="font-medium text-foreground max-w-[120px] truncate">
                        {displayName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-card border-border rounded-xl p-2">
                    {/* User Info Header */}
                    <div className="px-3 py-2 mb-2">
                      <p className="font-medium">{displayName}</p>
                      <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize mt-1 border-t border-border pt-1">Role: {role || 'Tenant'}</p>
                    </div>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={() => navigate(getDashboardRoute())}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    >
                      <UserIcon className="w-5 h-5 text-muted-foreground" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/messages")}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    >
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      <span>Messages</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    >
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowSignIn(true)}
                    className="text-foreground"
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => setShowSignUp(true)} className="btn-primary">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/owner-form");
                    setIsMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  Become a House Owner
                </Button>

                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-2 flex items-center gap-3 border-b border-border/50 mb-2">
                      <div className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center relative ${getAvatarBorder()}`}>
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={displayName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary-foreground font-bold text-xs">{userInitial}</span>
                        )}
                        {getBadge()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/profile");
                        setIsMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate(getDashboardRoute());
                        setIsMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="justify-start text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowSignIn(true);
                        setIsMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        setShowSignUp(true);
                        setIsMenuOpen(false);
                      }}
                      className="btn-primary"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <Login
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSignIn={handleSignIn}
        onSwitchToSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />

      <Signup
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSignUp={handleSignUp}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }}
      />
    </>
  );
};

export default Navbar;

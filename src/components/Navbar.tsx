import { useState } from "react";
import { Home, Menu, X, User, LogOut, LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignInModal from "./auth/SignInModal";
import SignUpModal from "./auth/SignUpModal";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const Navbar = ({ isLoggedIn, onLogin, onLogout, onNavigate }: NavbarProps) => {
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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-bold text-foreground">
                Rent<span className="text-primary">AI</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate("owner-form")}
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
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center relative">
                        <span className="text-primary-foreground font-bold text-sm">P</span>
                        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[8px] font-bold px-1 rounded">
                          PRO
                        </div>
                      </div>
                      <span className="font-medium text-foreground max-w-[120px] truncate">
                        nikhithaphan...
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-card border-border rounded-xl p-2">
                    {/* User Info Header */}
                    <div className="px-3 py-2 mb-2">
                      <p className="text-sm text-muted-foreground">nikhithaphanisri@gmail.com</p>
                    </div>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={() => onNavigate("dashboard")}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    >
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onNavigate("messages")}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    >
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                      <span>Messages</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onNavigate("settings")}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    >
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={onLogout}
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
                    onNavigate("owner-form");
                    setIsMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  Become a House Owner
                </Button>

                {isLoggedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onNavigate("profile");
                        setIsMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onNavigate("dashboard");
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
                        onLogout();
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

      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSignIn={handleSignIn}
        onSwitchToSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />

      <SignUpModal
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

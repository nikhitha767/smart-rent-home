import { useState } from "react";
import { X, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { createUserProfile, getUserRole } from "../../services/userService";
import { useNavigate } from "react-router-dom"; // Added for navigation

interface SignupProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onSwitchToSignIn: () => void;
}

const Signup = ({ isOpen, onClose, onSignUp, onSwitchToSignIn }: SignupProps) => {
  const navigate = useNavigate(); // Hook for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isValidPassword = password.length >= 8;

  const handleNavigate = (role: string | null) => {
    if (role === "owner") {
      navigate("/owner/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Ensure user profile exists
      await createUserProfile(user.uid, user.email || "");

      const role = await getUserRole(user.uid);

      setIsLoading(false);
      onSignUp();
      handleNavigate(role);
    } catch (error) {
      console.error("Error with Google Sign In:", error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !isValidPassword) return;

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user document in Firestore with 'tenant' role
      if (userCredential.user) {
        await createUserProfile(userCredential.user.uid, userCredential.user.email || "");

        // After signup, navigate too!
        const role = await getUserRole(userCredential.user.uid);
        handleNavigate(role);
      }
      setIsLoading(false);
      onSignUp();
    } catch (error) {
      console.error("Error signing up:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-card rounded-2xl shadow-prominent animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
              Create Account
            </h2>
            <p className="text-muted-foreground">
              Join RentAI to find your perfect home
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 input-field"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 input-field"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className={`text-xs ${isValidPassword ? 'text-accent' : 'text-muted-foreground'}`}>
                {isValidPassword && <Check className="w-3 h-3 inline mr-1" />}
                Password must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11 pr-11 input-field"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <p className={`text-xs ${passwordsMatch ? 'text-accent' : 'text-destructive'}`}>
                  {passwordsMatch ? (
                    <>
                      <Check className="w-3 h-3 inline mr-1" />
                      Passwords match
                    </>
                  ) : (
                    "Passwords do not match"
                  )}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full btn-primary h-12"
              disabled={isLoading || !passwordsMatch || !isValidPassword}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 gap-2"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>

          {/* Terms */}
          <p className="mt-4 text-xs text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <button className="text-primary hover:underline">Terms of Service</button>
            {" "}and{" "}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </p>

          {/* Footer */}
          <p className="mt-6 text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={onSwitchToSignIn}
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

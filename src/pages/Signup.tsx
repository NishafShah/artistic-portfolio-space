
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Mail, Lock, User, UserPlus, KeyRound } from 'lucide-react';

const AUTHORIZED_EMAIL = 'shahmurrawat@gmail.com';
const AUTHORIZED_PASSWORD = 'Nishaf$25';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (email !== AUTHORIZED_EMAIL) {
      toast({
        title: "Unauthorized",
        description: "Sorry, signup is restricted to authorized administrators only.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup(email, password, name);
      
      if (success) {
        toast({
          title: "Account created",
          description: "Your admin account has been created successfully",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Signup failed",
          description: "Email already in use or other error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingReset(true);

    try {
      // Simulate sending a reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (resetEmail === AUTHORIZED_EMAIL) {
        toast({
          title: "Reset link sent",
          description: "Password reset instructions have been sent to your email",
        });
        setShowForgotPassword(false);
      } else {
        toast({
          title: "Email not found",
          description: "No admin account found with this email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending the reset email",
        variant: "destructive",
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {!showForgotPassword ? (
        <Card 
          className={`w-full max-w-md shadow-2xl transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } relative z-10 backdrop-blur-sm bg-white/90`}
        >
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 animate-fade-in">
              Admin Signup
            </CardTitle>
            <CardDescription className="text-gray-600">
              Restricted access - Administrators only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 transition-all duration-300 hover:scale-[1.02]">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 transition-all duration-300 hover:scale-[1.02]">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="shahmurrawat@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button 
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 transform transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? 'Creating account...' : 'Create admin account'} 
                  <UserPlus className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`w-full max-w-md shadow-2xl transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } relative z-10 backdrop-blur-sm bg-white/90`}
        >
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 animate-fade-in">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email to receive reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2 transition-all duration-300 hover:scale-[1.02]">
                <Label htmlFor="resetEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="shahmurrawat@gmail.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 transform transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
                disabled={isSendingReset}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSendingReset ? 'Sending...' : 'Send reset instructions'} 
                  <KeyRound className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="ghost" 
              onClick={() => setShowForgotPassword(false)}
              className="text-sm text-purple-600 hover:text-purple-800 animate-fade-in delay-300"
            >
              Back to login
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Signup;

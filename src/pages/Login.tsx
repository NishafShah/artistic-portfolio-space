
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, LogIn } from 'lucide-react';

const AUTHORIZED_EMAIL = 'shahmurrawat@gmail.com';
const AUTHORIZED_PASSWORD = 'Nishaf$25';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First create account if this is the first login
      const storedUsers = JSON.parse(localStorage.getItem('portfolio_users') || '[]');
      if (storedUsers.length === 0 && email === AUTHORIZED_EMAIL && password === AUTHORIZED_PASSWORD) {
        const newUser = {
          id: `user_${Date.now()}`,
          email: AUTHORIZED_EMAIL,
          password: AUTHORIZED_PASSWORD,
          name: 'Admin User',
        };
        
        storedUsers.push(newUser);
        localStorage.setItem('portfolio_users', JSON.stringify(storedUsers));
        toast({
          title: "Admin account created",
          description: "Login successful with admin credentials",
        });
      }
      
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
        navigate('/dashboard');
      } else {
        if (email === AUTHORIZED_EMAIL) {
          toast({
            title: "Login failed",
            description: "Password is incorrect",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: "Only authorized admins can log in",
            variant: "destructive",
          });
        }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <Card 
        className={`w-full max-w-md shadow-xl transition-all duration-500 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } relative z-10 backdrop-blur-sm bg-white/90`}
      >
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 animate-fade-in">Login</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <Link to="/signup" className="text-xs text-purple-600 hover:text-purple-800 transition-colors">
                  Forgot password?
                </Link>
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
                {isLoading ? 'Logging in...' : 'Login'} <LogIn className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-gray-600">
            <Link to="/" className="text-purple-600 hover:underline">
              Back to Portfolio
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

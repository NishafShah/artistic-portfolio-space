import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ADMIN_EMAIL = 'shahmurrawat@gmail.com';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if email is admin email
    if (normalizedEmail !== ADMIN_EMAIL.toLowerCase()) {
      toast({
        title: 'Access Denied',
        description: 'Password reset is only available for admin accounts.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: 'Reset Email Sent',
        description: 'Check your email for the password reset link.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Check Your Email</h3>
        <p className="text-gray-600">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          The link will expire in 1 hour.
        </p>
        <Link to="/login">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Admin Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Password reset is only available for the admin account.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Reset Link'
        )}
      </Button>

      <div className="text-center">
        <Link to="/login" className="text-sm text-purple-600 hover:underline">
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          Back to Login
        </Link>
      </div>
    </form>
  );
};

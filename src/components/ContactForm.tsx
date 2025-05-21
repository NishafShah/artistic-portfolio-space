
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, User, Send, Phone } from 'lucide-react';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsSending(false);
      return;
    }

    try {
      // Simulate sending an email with a longer delay to make it feel more realistic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store the message in localStorage and also try to actually send an email
      // to shahmurrawat@gmail.com (this will only work if the user has an email client configured)
      const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
      const newMessage = {
        id: `msg_${Date.now()}`,
        name,
        email,
        phone,
        message,
        sentTo: 'shahmurrawat@gmail.com',
        date: new Date().toISOString(),
      };
      
      messages.push(newMessage);
      localStorage.setItem('portfolio_messages', JSON.stringify(messages));
      
      // Open the mail client
      const mailtoLink = `mailto:shahmurrawat@gmail.com?subject=Contact from ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone || 'Not provided'}%0D%0A%0D%0AMessage:%0D%0A${message}`;
      window.location.href = mailtoLink;
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully and your mail client should be opening",
      });
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again or contact directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-2xl p-8">
      <div className="space-y-2 transition-all duration-300 hover:scale-[1.01]">
        <Label htmlFor="name">Your Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2 transition-all duration-300 hover:scale-[1.01]">
        <Label htmlFor="email">Your Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2 transition-all duration-300 hover:scale-[1.01]">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (123) 456-7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-2 transition-all duration-300 hover:scale-[1.01]">
        <Label htmlFor="message">Your Message</Label>
        <Textarea
          id="message"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] resize-none"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-purple-600 hover:bg-purple-700 transform transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
        disabled={isSending}
      >
        <span className="relative z-10 flex items-center justify-center">
          {isSending ? 'Sending...' : 'Send Message'} 
          <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform animate-icon" />
        </span>
        <div className="absolute inset-0 bg-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      </Button>
    </form>
  );
};

export default ContactForm;

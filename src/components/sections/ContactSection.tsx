import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useState, memo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendContactEmail } from '@/lib/sendContactEmail';

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const socialLinks = [
  {
    href: 'mailto:shahmurrawat@gmail.com',
    icon: Mail,
    label: 'shahmurrawat@gmail.com',
    external: false,
  },
  {
    href: 'tel:03277054143',
    icon: Phone,
    label: '03277054143',
    external: false,
  },
  {
    href: 'https://github.com/NishafShah',
    icon: Github,
    label: 'GitHub',
    external: true,
  },
  {
    href: 'https://www.linkedin.com/in/syed-nishaf-hussain-shah-8b2409310/',
    icon: Linkedin,
    label: 'LinkedIn',
    external: true,
  },
];

const ContactSection = memo(() => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast({
        variant: 'destructive',
        title: 'Please fill in all required fields.',
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('contact_form').insert([form]);

    if (error) {
      console.error('Error saving contact form:', error);
      toast({
        variant: 'destructive',
        title: 'Something went wrong!',
        description: 'Please try again later.',
      });
    } else {
      try {
        const res = await sendContactEmail({
          name: form.name,
          email: form.email,
          message: form.message,
        });

        if (res.success) {
          toast({
            title: 'Message Sent!',
            description: 'Thank you for reaching out.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Message saved, but email failed!',
          });
        }
      } catch (err) {
        console.error('Email send error:', err);
        toast({
          variant: 'destructive',
          title: 'Saved, but failed to send email.',
        });
      }

      setForm({ name: '', email: '', phone: '', message: '' });
    }

    setLoading(false);
  }, [form, toast]);

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50 reveal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase text-sm">Contact Us</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Get in Touch</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Feel free to reach out for collaborations, questions, or just a friendly chat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="text-base"
            />
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="text-base"
            />
          </div>
          <Input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number (Optional)"
            className="text-base"
          />
          <Textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            required
            className="text-base resize-none"
          />
          <Button 
            type="submit" 
            className="w-full text-base py-3" 
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors text-gray-800 shadow-sm border border-gray-100 text-sm sm:text-base"
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
              >
                <Icon size={18} className="text-purple-600 flex-shrink-0" />
                <span className="truncate">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;

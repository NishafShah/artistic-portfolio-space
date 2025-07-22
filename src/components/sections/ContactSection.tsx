import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendContactEmail } from '@/lib/sendContactEmail';

const ContactSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
  };

  return (
    <section id="contact" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-purple-50 reveal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase animate-fade-in">Contact US</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in">Get in Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in">
            Feel free to reach out for collaborations, questions, or just a friendly chat. I'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 relative animate-fade-in">
          <div className="transform transition-all duration-500 hover:scale-[1.01]">
            <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <Input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
              />
              <Textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 animate-fade-in">
          <a
            href="mailto:shahmurrawat@gmail.com"
            className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-800 shadow-sm animate-bounce"
          >
            <Mail size={22} className="text-purple-600 transform transition-all duration-300 hover:scale-125" />
            <span>shahmurrawat@gmail.com</span>
          </a>
          <a
            href="tel:03277054143"
            className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-800 shadow-sm animate-bounce"
          >
            <Phone size={22} className="text-purple-600 transform transition-all duration-300 hover:scale-125" />
            <span>03277054143</span>
          </a>
          <a
            href="https://github.com/NishafShah"
            className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-800 shadow-sm animate-bounce"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={22} className="text-purple-600 transform transition-all duration-300 hover:scale-125" />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/syed-nishaf-hussain-shah-8b2409310/"
            className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-800 shadow-sm animate-bounce"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={22} className="text-purple-600 transform transition-all duration-300 hover:scale-125" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

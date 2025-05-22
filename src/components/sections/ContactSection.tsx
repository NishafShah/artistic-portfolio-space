
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import ContactForm from '../ContactForm';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-purple-50 reveal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-purple-600 font-medium mb-2 tracking-wider uppercase animate-fade-in">Contact</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in">Get in Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in">
            Feel free to reach out for collaborations, questions, or just a friendly chat. I'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 relative animate-fade-in">
          <div className="transform transition-all duration-500 hover:scale-[1.01]">
            <ContactForm />
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
            href="tel:+923277054143" 
            className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-800 shadow-sm animate-bounce"
          >
            <Phone size={22} className="text-purple-600 transform transition-all duration-300 hover:scale-125" />
            <span>+92 327 7054143</span>
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

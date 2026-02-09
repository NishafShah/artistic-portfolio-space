import { Github, Linkedin, Mail } from 'lucide-react';
import { memo } from 'react';

const socialLinks = [
  {
    href: 'https://github.com/NishafShah',
    icon: Github,
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/syed-nishaf-hussain-shah-8b2409310/',
    icon: Linkedin,
    label: 'LinkedIn',
  },
  {
    href: 'mailto:shahmurrawat@gmail.com',
    icon: Mail,
    label: 'Email',
  },
];

const FooterSection = memo(() => {
  return (
    <footer className="py-6 sm:py-8 bg-gray-900 text-white reveal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Nishaf Shah. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 sm:space-x-6 mt-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-purple-400 transition-colors p-2"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
});

FooterSection.displayName = 'FooterSection';

export default FooterSection;

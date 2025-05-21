
import { useEffect } from 'react';

const Animation = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Animate sections with 'reveal' class
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    // Animate icons with 'animate-icon' class
    document.querySelectorAll('.animate-icon').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        el.classList.add('animate-bounce');
      });
      
      el.addEventListener('mouseleave', () => {
        el.classList.remove('animate-bounce');
      });
    });

    return () => {
      observer.disconnect();
      
      // Clean up event listeners
      document.querySelectorAll('.animate-icon').forEach((el) => {
        el.removeEventListener('mouseenter', () => {});
        el.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return <>{children}</>;
};

export default Animation;

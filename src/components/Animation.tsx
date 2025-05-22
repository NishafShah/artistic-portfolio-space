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

    // Enhanced icon animations
    const animateIcons = () => {
      document.querySelectorAll('.animate-bounce').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          el.classList.add('animate-bounce');
        });
        
        el.addEventListener('mouseleave', () => {
          // Keep the animation for a short time after mouse leaves
          setTimeout(() => {
            if (!el.matches(':hover')) {
              el.classList.remove('animate-bounce');
            }
          }, 300);
        });
      });
    };

    // Apply hover effects to cards and buttons
    const applyHoverEffects = () => {
      // Card hover effects
      document.querySelectorAll('.card, .shadow-lg').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          el.classList.add('shadow-xl');
          el.classList.add('scale-[1.01]');
        });
        
        el.addEventListener('mouseleave', () => {
          el.classList.remove('shadow-xl');
          el.classList.remove('scale-[1.01]');
        });
      });
      
      // Button hover effects
      document.querySelectorAll('button').forEach((el) => {
        if (!el.classList.contains('no-animation')) {
          el.classList.add('transition-all', 'duration-300');
        }
      });
    };
    
    // Initial calls
    animateIcons();
    applyHoverEffects();

    // For dynamically added elements
    const observer2 = new MutationObserver(() => {
      animateIcons();
      applyHoverEffects();
    });
    
    observer2.observe(document.body, { 
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      observer2.disconnect();
      
      // Clean up event listeners
      document.querySelectorAll('.animate-icon, .animate-bounce').forEach((el) => {
        el.removeEventListener('mouseenter', () => {});
        el.removeEventListener('mouseleave', () => {});
      });
      
      document.querySelectorAll('.card, .shadow-lg').forEach((el) => {
        el.removeEventListener('mouseenter', () => {});
        el.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return <>{children}</>;
};

export default Animation;

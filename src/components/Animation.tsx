import { useEffect, memo } from 'react';

const Animation = memo(({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Use IntersectionObserver for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe elements with 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
});

Animation.displayName = 'Animation';

export default Animation;

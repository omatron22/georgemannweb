'use client';

import { useEffect, useState } from 'react';

export default function Navigation() {
  // Fade in the left "George Mann" brand only after the hero has scrolled
  // past, so it doesn't compete with the centered hero name.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Trigger once the user is past ~60% of the first viewport height.
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.65), 0 0 1px rgba(0,0,0,0.9)' }}
    >
      <div className="w-full px-4 sm:px-8 md:px-12 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => handleSmoothScroll(e, '#hero')}
            className={`text-white text-sm sm:text-base tracking-widest uppercase hover:opacity-60 transition-opacity duration-500 ${
              scrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
            aria-hidden={!scrolled}
            tabIndex={scrolled ? 0 : -1}
          >
            George Mann
          </a>
          <div
            className="flex gap-4 sm:gap-8 md:gap-12 text-sm sm:text-base tracking-widest text-white pointer-events-auto"
            style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
          >
            <a
              href="#gallery"
              onClick={(e) => handleSmoothScroll(e, '#gallery')}
              className="hover:opacity-60 transition-opacity cursor-pointer"
            >
              Gallery
            </a>
            <a
              href="#bio"
              onClick={(e) => handleSmoothScroll(e, '#bio')}
              className="hover:opacity-60 transition-opacity cursor-pointer"
            >
              Bio
            </a>
            <a
              href="mailto:brad_smith@earthlink.net"
              className="hover:opacity-60 transition-opacity cursor-pointer"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

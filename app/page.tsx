import Image from 'next/image';
import Navigation from './components/Navigation';
import Gallery, { type Photo } from './components/Gallery';
import captionsData from './captions.json';

const photos: Photo[] = captionsData.photos;

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="film-grain" aria-hidden="true" />

      {/* Hero */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      >
        {/* Curved "George Mann" arcing above the portrait */}
        <svg
          viewBox="0 0 600 180"
          className="w-[300px] sm:w-[380px] md:w-[460px] -mb-4 sm:-mb-6 md:-mb-8"
          aria-hidden="true"
        >
          <defs>
            <path id="hero-arc" d="M 40 160 Q 300 -10 560 160" fill="none" />
          </defs>
          <text
            fill="#ffffff"
            fontSize="58"
            fontFamily="ui-serif, Georgia, 'Times New Roman', serif"
            fontWeight="600"
            letterSpacing="2"
          >
            <textPath href="#hero-arc" startOffset="50%" textAnchor="middle">
              George Mann
            </textPath>
          </text>
        </svg>

        {/* Cutout portrait */}
        <div className="w-[180px] sm:w-[220px] md:w-[260px]">
          <Image
            src="/images/portrait-cutout.png"
            alt="Portrait of George Mann"
            width={574}
            height={711}
            sizes="260px"
            loading="eager"
            fetchPriority="high"
            className="w-full h-auto"
          />
        </div>

        <h1 className="sr-only">George Mann</h1>
        <p
          className="mt-2 sm:mt-3 text-sm sm:text-base tracking-[0.3em] text-white"
          style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
        >
          1905 &mdash; 1977
        </p>
        <p
          className="mt-2 text-sm sm:text-base italic text-white max-w-xl"
          style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
        >
          Vaudeville photography, late 1920s through the early 1940s
        </p>
      </section>

      {/* Gallery */}
      <section id="gallery" className="bg-black pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <Gallery photos={photos} />
        </div>
      </section>

      {/* Bio */}
      <section id="bio" className="bg-black pt-12 pb-24">
        <div
          className="max-w-3xl mx-auto px-6 sm:px-8 text-neutral-200 leading-relaxed text-base sm:text-lg space-y-5"
          style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
        >
          <p>
            <a
              href="https://en.wikipedia.org/wiki/George_Mann_(vaudeville_performer)"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-neutral-500 underline-offset-4 hover:text-white hover:decoration-white transition-colors"
            >
              George Mann
            </a>{' '}
            (1905&ndash;1977) is best remembered, not only as half of the
            vaudeville comedy team of{' '}
            <a
              href="https://en.wikipedia.org/wiki/Barto_and_Mann"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-neutral-500 underline-offset-4 hover:text-white hover:decoration-white transition-colors"
            >
              Barto &amp; Mann
            </a>
            , but for the remarkable body of photographic work he created behind
            the scenes from the late 1920s through the early 1940s. While
            performing across the United States and abroad, Mann produced an
            estimated 12,000 black-and-white photographs and extensive 16mm film
            footage, capturing candid moments of performers, backstage life, and
            the atmosphere of vaudeville at its height. His images reveal both
            technical skill and a keen sensitivity to composition, light, and
            character, offering a rare visual record of an earlier entertainment
            era. In later years, he extended his photographic interests into 3-D
            imagery, designing a viewer to display his work&mdash;much of it
            featuring Southern California landmarks&mdash;bringing the same
            curiosity and inventiveness that marked his earlier documentation of
            vaudeville life.
          </p>
          <p>
            Licensing for these and other photographs is available through{' '}
            <a
              href="https://www.akg-images.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-neutral-500 underline-offset-4 hover:text-white hover:decoration-white transition-colors"
            >
              akg-images
            </a>
            .
          </p>
          <p className="pt-2 text-sm text-neutral-400 italic">
            &mdash; Brad Smith, George Mann&rsquo;s son
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black">
        <div
          className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-neutral-500 tracking-wider"
          style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
        >
          <a
            href="mailto:brad_smith@earthlink.net"
            className="underline hover:text-white transition-colors"
          >
            brad_smith@earthlink.net
          </a>
        </div>
      </footer>
    </>
  );
}

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';

export type Photo = { file: string; caption: string; w: number; h: number };
type Row = { photos: Photo[]; height: number };

// Fraction of original image height that remains after we crop the
// baked-in caption band (ffmpeg pre-pass: bottom 7% removed).
const CROP_RATIO = 0.93;

// Width to assume for server-side render so crawlers and no-JS users
// receive a fully-laid-out gallery. The client re-measures and re-lays
// out on hydration via ResizeObserver.
const SSR_WIDTH = 1280;

// Justified row layout (Flickr / Google Photos style).
function buildRows(
  items: Photo[],
  containerWidth: number,
  targetHeight: number,
  gap: number
): Row[] {
  if (items.length === 0 || containerWidth <= 0) return [];

  const rows: Row[] = [];
  let currentRow: Photo[] = [];

  const rowHeight = (row: Photo[]) => {
    const totalGap = (row.length - 1) * gap;
    const sumAspect = row.reduce((s, p) => s + p.w / p.h, 0);
    return (containerWidth - totalGap) / sumAspect;
  };

  // Clamp protects against extreme cases: a single very-wide photo at a
  // narrow viewport going tiny, or a single tall photo blowing up.
  const clamp = (h: number) =>
    Math.max(targetHeight * 0.5, Math.min(targetHeight * 1.6, h));

  for (const photo of items) {
    if (currentRow.length === 0) {
      currentRow = [photo];
      continue;
    }
    const withPhoto = [...currentRow, photo];
    const errWith = Math.abs(rowHeight(withPhoto) - targetHeight);
    const errWithout = Math.abs(rowHeight(currentRow) - targetHeight);
    if (errWith <= errWithout) {
      currentRow = withPhoto;
    } else {
      rows.push({ photos: currentRow, height: clamp(rowHeight(currentRow)) });
      currentRow = [photo];
    }
  }
  if (currentRow.length > 0) {
    rows.push({ photos: currentRow, height: clamp(rowHeight(currentRow)) });
  }
  return rows;
}

function targetFor(width: number) {
  return Math.max(180, Math.min(360, width * 0.26));
}

export default function Gallery({ photos }: { photos: Photo[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Start at SSR_WIDTH so the very first render produces a full gallery,
  // then update once we can measure the actual container.
  const [width, setWidth] = useState(SSR_WIDTH);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const targetHeight = targetFor(width);

  const croppedItems = useMemo(
    () => photos.map((p) => ({ ...p, h: Math.round(p.h * CROP_RATIO) })),
    [photos]
  );

  const rows = useMemo(
    () => buildRows(croppedItems, width, targetHeight, 16),
    [croppedItems, width, targetHeight]
  );

  const selected = selectedIndex !== null ? photos[selectedIndex] : null;
  const close = () => setSelectedIndex(null);
  const next = () =>
    setSelectedIndex((i) =>
      i === null ? null : (i + 1) % photos.length
    );
  const prev = () =>
    setSelectedIndex((i) =>
      i === null ? null : (i - 1 + photos.length) % photos.length
    );

  // Keyboard nav for the lightbox.
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIndex]);

  // Body scroll lock + main aria-hidden while modal is open.
  useEffect(() => {
    if (selectedIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedIndex]);

  const gap = 16;

  return (
    <>
      <div ref={containerRef}>
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex items-start"
            style={{ marginBottom: ri < rows.length - 1 ? gap * 2 : 0 }}
          >
            {row.photos.map((photo, pi) => {
              const w = (photo.w * row.height) / photo.h;
              return (
                <div
                  key={photo.file}
                  style={{
                    width: `${w}px`,
                    marginLeft: pi > 0 ? gap : 0,
                  }}
                  className="shrink-0 flex flex-col"
                >
                  <button
                    onClick={() =>
                      setSelectedIndex(
                        photos.findIndex((orig) => orig.file === photo.file)
                      )
                    }
                    style={{ height: `${row.height}px` }}
                    className="block w-full group cursor-zoom-in overflow-hidden"
                    aria-label={`Open larger view of ${photo.caption}`}
                  >
                    <Image
                      src={`/images-cropped/${photo.file}`}
                      alt={photo.caption}
                      width={photo.w}
                      height={photo.h}
                      sizes={`${Math.ceil(w)}px`}
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                      loading="lazy"
                    />
                  </button>
                  <p
                    className="mt-2 text-center text-neutral-300 text-[11px] sm:text-xs leading-snug"
                    style={{
                      fontFamily:
                        "var(--font-typewriter), 'Courier New', Courier, monospace",
                    }}
                    aria-hidden="true"
                  >
                    {photo.caption}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photograph: ${selected.caption}`}
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-neutral-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close"
          >
            &times;
          </button>
          <button
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-4xl hover:text-neutral-300 z-10 px-3 py-2"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
          >
            &lsaquo;
          </button>
          <button
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-4xl hover:text-neutral-300 z-10 px-3 py-2"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
          >
            &rsaquo;
          </button>
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={selected.file}
              src={`/images/${selected.file}`}
              alt={selected.caption}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

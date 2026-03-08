'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import type { TestimonialsData, TestimonialItem } from '@/types/page.types';

const MD_BREAKPOINT_PX = 768;
const LG_BREAKPOINT_PX = 1024;

interface TestimonialsProps {
  data: TestimonialsData;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex justify-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className="h-5 w-5 text-[#E07C5C]"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/** Returns slides per view: 1 (<768), 2 (768–1023), 3 (≥1024). */
function useSlidesPerPage(): 1 | 2 | 3 {
  const [perPage, setPerPage] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const md = window.matchMedia(`(min-width: ${MD_BREAKPOINT_PX}px)`);
    const lg = window.matchMedia(`(min-width: ${LG_BREAKPOINT_PX}px)`);
    const handler = () => {
      setPerPage(lg.matches ? 3 : md.matches ? 2 : 1);
    };
    handler();
    md.addEventListener('change', handler);
    lg.addEventListener('change', handler);
    return () => {
      md.removeEventListener('change', handler);
      lg.removeEventListener('change', handler);
    };
  }, []);

  return perPage;
}

export function Testimonials({ data }: TestimonialsProps) {
  const { heading, testimonials } = data;
  const perPage = useSlidesPerPage();
  const [current, setCurrent] = useState(0);

  const totalPages = Math.max(1, Math.ceil(testimonials.length / perPage));
  const page = Math.min(current, totalPages - 1);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  useEffect(() => {
    setCurrent((prev) => Math.min(prev, totalPages - 1));
  }, [perPage, totalPages]);

  const goPrev = useCallback(() => {
    setCurrent((p) => Math.max(0, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrent((p) => Math.min(totalPages - 1, p + 1));
  }, [totalPages]);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-[#F5F5F5] py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[50px]">
        <h2 className="text-center text-[28px] font-bold leading-tight tracking-tight text-[#42454A] sm:text-[32px] md:text-[40px]">
          {heading}
        </h2>

        <div className="relative mt-8 sm:mt-10 w-full overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              width: `${totalPages * 100}%`,
              transform: `translateX(-${(page / totalPages) * 100}%)`,
            }}
          >
            {Array.from({ length: totalPages }, (_, pageIndex) => (
              <div
                key={pageIndex}
                className="flex flex-none gap-4 xl:gap-6"
                style={{ width: `${100 / totalPages}%` }}
              >
                {testimonials
                  .slice(pageIndex * perPage, pageIndex * perPage + perPage)
                  .map((t, idx) => (
                    <TestimonialCard key={`${pageIndex}-${idx}`} testimonial={t} />
                  ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3 sm:mt-8">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#42454A] bg-white text-[#42454A] transition hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed sm:h-12 sm:w-12"
            aria-label="Previous testimonials"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#42454A] text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed sm:h-12 sm:w-12"
            aria-label="Next testimonials"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial: t }: { testimonial: TestimonialItem }) {
  return (
    <article className="min-w-0 flex-1 rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] sm:p-6 flex flex-col items-center text-center">
      <StarRating rating={t.rating} />
      <p className="mt-3 text-[14px] font-normal leading-relaxed text-[#42454A] sm:mt-4 sm:text-[15px] md:text-[16px]">
        {t.quote}
      </p>
      <div className="mt-4 sm:mt-6 flex gap-2   items-center">

        <Image
          src={t.image.url}
          alt={t.image.alt ?? t.name}
          width={64}
          height={64}
          className="h-14 w-14 shrink-0 rounded-full object-cover sm:h-16 sm:w-16"
          unoptimized={t.image.url.startsWith('http')}
        />
        <div className="">
          <p className="  text-start font-semibold text-[#42454A] text-sm sm:text-base">
            {t.name}
          </p>
          <p className="text-start text-xs font-normal text-[#42454A]/80 sm:text-sm">
            {t.designation}
          </p>
        </div>

      </div>
    </article>
  );
}

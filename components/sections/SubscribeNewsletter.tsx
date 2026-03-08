'use client';

import { useState } from 'react';

const defaultTitle = 'Subscribe To Newsletter';
const defaultDescription =
  'Subscribe to our newsletter to get amazing offers in future.';
const defaultButtonLabel = 'Get start';

export function SubscribeNewsletter() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder: wire to your API or analytics
  }

  return (
    <section className="border-t border-gray-200 bg-white py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[50px]">
        <h2 className="text-center text-[28px] font-bold leading-tight tracking-tight text-[#42454A] sm:text-[32px] md:text-[40px]">
          {defaultTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-center text-[15px] font-normal leading-relaxed text-gray-600 sm:text-[16px]">
          {defaultDescription}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex w-full max-w-md flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-[15px] text-[#42454A] placeholder-gray-500 focus:border-[#42454A] focus:outline-none focus:ring-1 focus:ring-[#42454A] sm:text-base"
            aria-label="Email"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-[#42454A] px-6 py-3 text-[15px] font-medium text-white transition hover:opacity-90 sm:w-auto sm:text-[16px]"
          >
            {defaultButtonLabel}
          </button>
        </form>
      </div>
    </section>
  );
}

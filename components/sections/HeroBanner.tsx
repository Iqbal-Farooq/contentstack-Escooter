import Image from 'next/image';
import Link from 'next/link';
import type { HeroBannerData } from '@/types/page.types';

interface HeroBannerProps {
  data: HeroBannerData;
}

export function HeroBanner({ data }: HeroBannerProps) {
  const { headline, headline_bold, description, primary_cta, product_image } = data;

  return (
    <section className="relative overflow-hidden bg-white mt-4 sm:mt-6 lg:mt-8 w-full">
      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[50px]">
        <div className="grid min-h-[480px] grid-cols-1 items-center gap-6 py-8 sm:min-h-[520px] sm:py-10 md:gap-8 lg:min-h-[640px] lg:grid-cols-[1fr_1.2fr] lg:gap-0 lg:py-12 xl:min-[1440px]:min-h-[807px]">
          <div className="relative z-10 py-4 sm:py-6 lg:py-16">
            <h1 className="text-[36px] font-light uppercase leading-[1.1] tracking-[0.01em] text-[#42454A] sm:text-[56px] sm:leading-[60px] md:text-[70px] md:leading-[75px] lg:text-[80px] lg:leading-[88px] xl:text-[90px] xl:leading-[95px]">
              {headline}
              <br />
              <span className="font-bold">{headline_bold}</span>
            </h1>

            <div className="mt-8 mb-6 h-1 w-full max-w-[280px] bg-[#42454A] sm:mt-12 sm:mb-8 sm:w-[335px] lg:mt-[92px] lg:mb-[62px]" />

            <p className="max-w-[340px] text-base font-normal leading-relaxed tracking-[0.01em] text-[#42454A] sm:text-lg md:text-[20px] md:leading-[32px] lg:text-[22px] lg:leading-[34px]">
              {description}
            </p>

            <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-10 lg:gap-20">
              <Link
                href={primary_cta.url}
                target={primary_cta.open_in_new_tab ? '_blank' : undefined}
                rel={primary_cta.open_in_new_tab ? 'noopener noreferrer' : undefined}
                className="group inline-flex items-center gap-2 sm:gap-3"
              >
                <Image
                  src="/arrow-icon.png"
                  title="Primary CTA icon"
                  alt=""
                  width={48}
                  height={48}
                  className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[58px] lg:w-[58px]"
                />
                <span className="text-[18px] font-medium leading-tight tracking-[0.02em] text-[#17181A] sm:text-[20px] sm:leading-[32px]">
                  {primary_cta.label}
                </span>
              </Link>

              <div className="flex items-center gap-4 sm:gap-5">
                <p className="text-[15px] font-medium leading-snug tracking-[0.01em] text-[#414449] sm:text-[18px] sm:leading-[25px]">
                  Watch our
                  <br />
                  video how
                  <br />
                  it works
                </p>
                <Image
                  src="/play-button.png"
                  title="Play"
                  alt=""
                  width={56}
                  height={56}
                  className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
                />
              </div>
            </div>
          </div>

          {product_image.url && (
            <div className="relative flex justify-center lg:absolute lg:right-0 lg:bottom-0 lg:block lg:h-full lg:w-[55%] xl:w-[calc(856/1440*100%)]">
              <Image
                src={product_image.url}
                alt={product_image.alt_text ?? 'Product image'}
                width={856}
                height={807}
                className="h-auto w-full max-w-[400px] object-contain sm:max-w-[500px] md:max-w-[600px] lg:max-w-none lg:object-right xl:h-[807px] xl:w-[856px] xl:object-contain"
                priority
                unoptimized={product_image.url.startsWith('http')}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}






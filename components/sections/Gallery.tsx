import Image from 'next/image';
import Link from 'next/link';
import type { GalleryData } from '@/types/page.types';

interface GalleryProps {
  data: GalleryData;
}

export function Gallery({ data }: GalleryProps) {
  const { heading, short_description, images, buttons } = data;
  const [firstImage, ...rightImages] = images;

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-16">
      <div className="mx-auto xl:max-w-[1280px] lg:max-w-[1024px]  min-[1440px]:max-w-[1440px] px-5 md:px-10 lg:px-6  xl:px-12">
        <h2 className="text-center text-[28px] font-bold leading-tight tracking-tight text-[#42454A] sm:text-[32px] md:text-[50px]">
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-[720px] text-center text-[15px] font-normal leading-relaxed text-[#42454A] sm:text-[16px] md:text-[20px] px-5 ">
          {short_description}
        </p>

        <div className="flex justify-between mt-16 xl:mt-[112px]   ">
          <div className="flex flex-col gap-4 sm:gap-6 mt-20 xl:pt-[190px] md:gap-[55px]  ">
            {firstImage?.url && (
              <div className="relative  w-full overflow-hidden rounded-lg">
                <Image
                  src={firstImage.url}
                  alt={firstImage.alt ?? ''}
                  width={633}
                  height={485}
                  className="w-[320px] h-[220px] sm:w-[420px] sm:h-[320px]  min-[1440]:w-[633px] min-[1440px]:h-[485px] xl:w-[600px] xl:h-[450px] lg:w-[480px] lg:h-[380px] "
                  unoptimized={firstImage.url.startsWith('http')}
                />
                {firstImage.overlay_text && (
                  <span className="absolute left-3 top-3 ext-center text-[15px] font-normal leading-relaxed text-[#42454A] sm:text-[16px] md:text-[30px] ">
                    {firstImage.overlay_text}
                  </span>
                )}
              </div>
            )}
            <div className="flex flex-col gap-2  sm:gap-7">
              {buttons.map((btn, idx) => (
                <Link
                  key={idx}
                  href={btn.url}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-[#42454A] bg-white py-7 text-[15px] font-medium text-[#42454A] transition hover:bg-gray-50  sm:text-[16px] md:text-[30px] md:px-8 xl:w-[570px] "
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 md:gap-14  xl:gap-[96px] ">
            {rightImages.slice(0, 2).map((img, idx) =>
              img.url ? (
                <div key={idx} className="relative  w-full overflow-hidden rounded-lg">
                  <Image
                    src={img.url}
                    alt={img.alt ?? ''}
                    width={633}
                    height={485}
                    className="w-[320px] h-[220px] sm:w-[420px] sm:h-[320px]  min-[1440]:w-[633px] min-[1440px]:h-[485px] xl:w-[600px] xl:h-[450px] lg:w-[480px] lg:h-[380px] "
                    unoptimized={img.url.startsWith('http')}
                  />
                  {img.overlay_text && (
                    <span className="absolute left-3 top-3 ext-center text-[15px] font-normal leading-relaxed text-[#42454A] sm:text-[16px] md:text-[30px] ">
                      {img.overlay_text}
                    </span>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

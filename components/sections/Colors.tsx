import Image from 'next/image';
import type { ColorsData } from '@/types/page.types';

interface ColorsProps {
  data: ColorsData;
}

export function Colors({ data }: ColorsProps) {
  const { title, short_description, banner_image, color_options } = data;

  return (
    <section className=" py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] ">
        <div className="mt-10 xl:mt-[104px]">
          <h2 className="text-center text-[28px] font-bold leading-tight tracking-tight text-[#42454A] sm:text-[32px] md:text-[50px]">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-center text-[15px] font-normal leading-relaxed text-[#42454A] sm:text-[16px] md:text-[20px]">
            {short_description}
          </p>
        </div>

        {banner_image?.url && (
          <div className="relative mx-auto mt-8 aspect-[16/10] w-full  rounded-lg sm:mt-10">
            <Image
              src={banner_image.url}
              alt={banner_image.alt ?? title}
              fill
              className="object-cover "
              unoptimized={banner_image.url.startsWith('http')}
            />
          </div>
        )}

        {color_options.length > 0 && (
          <div className="-mt-5 lg:-mt-[100px] flex gap-6  flex-wrap px-5  lg:px-12 justify-between">
            {color_options.map((opt, idx) => (
              <div key={idx} className="group relative w-[264px] h-[264px] ">
                <div className="relative   rounded-lg border-2 border-transparent transition group-hover:border-[#42454A]">
                  <Image
                    src={opt.url}
                    alt={opt.alt ?? `Color ${opt.index}`}
                    width={263}
                    height={263}
                    className="w-[264px] h-[264px] "
                    unoptimized={opt.url.startsWith('http')}
                  />
                </div>
                <span className="absolute bottom-1.5 right-1.5 text-lg font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:bottom-2 sm:right-2 sm:text-xl md:text-2xl">
                  {String(opt.index).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import Image from 'next/image';
import { VectorCheckIcon } from '@/components/VectorCheckIcon';
import type { ProductInformationData } from '@/types/page.types';

interface ProductInformationProps {
  data: ProductInformationData;
}

export function ProductInformation({ data }: ProductInformationProps) {
  const { product_name, short_description, featured_image, features } = data;

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-5 ">
        <h2 className="text-center text-[28px] font-bold leading-tight tracking-tight text-[#42454A] sm:text-[32px] md:text-[50px]">
          {product_name}
        </h2>
        <p className="mx-auto mt-3 max-w-[640px] text-center text-[15px] font-normal leading-relaxed text-[rgb(66,69,74)] sm:text-[16px] md:text-[20px]">
          {short_description}
        </p>

        <div className="mt-8 flex lg:flex-row flex-col justify-center  gap-5 xl:justify-between items-center  ">
          <div className="relative flex justify-center">
            <Image
              src={featured_image.url}
              alt={featured_image.alt ?? product_name}
              width={748}
              height={706}
              className="w-[360px] h-[340px] sm:w-[400px] sm:h-[380px] md:w-[540px] md:h-[510px]  xl:w-[748px] xl:h-[706px] "
              unoptimized={featured_image.url.startsWith('http')}
            />
          </div>

          <ul className="flex flex-col gap-3 sm:gap-4 pr-4 xl:pr-[50px]">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 sm:gap-4">
                <VectorCheckIcon />
                <span className="text-[15px] font-normal leading-relaxed text-[#42454A] sm:text-[16px] md:text-[18px] xl:text-[20px]">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

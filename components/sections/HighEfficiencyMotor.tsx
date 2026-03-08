import Image from 'next/image';
import type { HighEfficiencyMotorData } from '@/types/page.types';

interface HighEfficiencyMotorProps {
  data: HighEfficiencyMotorData;
}

export function HighEfficiencyMotor({ data }: HighEfficiencyMotorProps) {
  const { product_name, short_description, image } = data;

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] ">
        <div className="mx-auto max-w-[780px] text-center relative z-20 px-5">
          <h2 className="text-[28px] font-bold leading-tight tracking-tight text-[#42454A] sm:text-[32px] md:text-[50px]">
            {product_name}
          </h2>
          <p className="mt-3 text-[15px] font-normal leading-relaxed text-[#42454A] sm:text-[16px] md:text-[20px]">
            {short_description}
          </p>
        </div>

        <div className="-mt-3 z-10 relative flex justify-center h-[792px] ">
          <Image
            src={image.url}
            alt={image.alt ?? product_name}
            // width={1408}
            // height={792}
            fill
            className=" object-cover w-full h-full px-5 "
            unoptimized={image.url.startsWith('http')}
          />
        </div>
      </div>
    </section>
  );
}

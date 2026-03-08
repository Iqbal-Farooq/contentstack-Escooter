import type { SpecItem } from '@/types/page.types';

interface ProductSpecsProps {
  specs: SpecItem[];
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  return (
    <section className="bg-white py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[50px]">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-[58px]">
          {specs.map((spec, idx) => (
            <div
              key={idx}
              className="flex min-w-[120px] max-w-[180px] flex-1 flex-col items-center justify-center rounded-lg border border-[#F4F4F4] px-4 py-5 shadow-[0px_13.21px_26.42px_0px_#0000000F] sm:min-w-[140px] sm:px-5 sm:py-6 md:min-w-[160px] xl:min-w-[174px] xl:max-w-[174px] xl:py-8"
              style={{ minHeight: 'clamp(100px, 20vw, 137px)' }}
            >
              <p className="text-center text-2xl font-bold leading-none tracking-[0] text-[#42454A] sm:text-3xl md:text-[36px] xl:text-[40px]">
                {spec.value}
                {spec.unit && (
                  <span className="text-sm sm:text-base xl:text-[18px]"> {spec.unit}</span>
                )}
              </p>
              <span className="mt-2 text-center text-xs font-normal leading-[130%] text-[#42454A] sm:text-[13px]">
                {spec.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

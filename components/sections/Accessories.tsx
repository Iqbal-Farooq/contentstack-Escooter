import Image from 'next/image';
import Link from 'next/link';
import { VectorCheckIcon } from '@/components/VectorCheckIcon';
import type { AccessoriesData, AccessoriesBlock } from '@/types/page.types';

interface AccessoriesProps {
  data: AccessoriesData;
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-center gap-3">
          <VectorCheckIcon />
          <span className="text-[15px] font-normal leading-relaxed text-[#42454A] sm:text-[20px]">
            {feature}
          </span>
        </li>
      ))}
    </ul>
  );
}

function BlockImages({ images, type }: { images: { url: string; alt?: string }[], type: string }) {
  if (images.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-5 md:gap-0 md:flex-nowrap ${type === 'second_section' ? 'flex-row' : 'flex-row-reverse'}`}>
      {images.map((img, idx) =>
        <>
          {type === 'second_section' ? (
            <Image
              key={idx}
              src={img.url}
              alt={img.alt ?? ''}
              width={280}
              height={200}
              className={`px-5 md:px-0 ${idx === 0 ? 'md:w-[472px] md:h-[427px]' : 'md:w-[240px] md:h-[210px] md:ml-[67px] md:mt-[152px]'}`}
              unoptimized={img.url.startsWith('http')}
            />
          ) : (
            <Image
              key={idx}
              src={img.url}
              alt={img.alt ?? ''}
              width={280}
              height={200}
              className={`px-5 md:px-0 ${idx === 0 ? 'md:w-[493px] md:h-[438px]' : 'md:w-[479px] md:h-[479px] md:-mr-[99px] md:mt-2'}`}
              unoptimized={img.url.startsWith('http')}
            />
          )}

        </>

      )}
    </div>
  );
}

function AccessoryBlock({ block }: { block: AccessoriesBlock }) {
  if (block.type === 'first_section') {
    return (
      <div className="flex justify-between items-center px-5 flex-wrap xl:flex-nowrap">
        <div className='xl:pl-8'>
          <h3 className="text-[22px] font-bold leading-tight text-[#42454A] sm:text-[24px] md:text-[50px]">
            {block.list_title}
          </h3>
          <div className="mt-4 sm:mt-6">
            <FeatureList features={block.features} />
          </div>
        </div>
        <div className="flex justify-center lg:justify-end ">
          <BlockImages images={block.images} type="first_section" />
        </div>
      </div>
    );
  }

  return (
    <div className="pr-10 xl:pr-[165px] flex  justify-between items-center flex-wrap xl:flex-nowrap">
      <div className="flex justify-center  lg:justify-start">
        <BlockImages images={block.images} type="second_section" />
      </div>
      <div className="px-5 xl:px-0">
        <h3 className="text-[22px] font-bold leading-tight text-[#42454A] sm:text-[24px] md:text-[28px]">
          {block.title}
        </h3>
        <div className="mt-4 sm:mt-6">
          <FeatureList features={block.features} />
        </div>
      </div>
    </div>
  );
}

export function Accessories({ data }: AccessoriesProps) {
  const { title, description, blocks } = data;
  const lastBlock = blocks[blocks.length - 1];
  const cta = lastBlock?.type === 'second_section' ? lastBlock.cta : undefined;

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] ">
        <div className="px-5 mx-auto max-w-[790px]">
          <h2 className="text-center text-[28px] font-bold leading-tight tracking-tight text-[#42454A] sm:text-[32px] md:text-[50px]">
            {title}
          </h2>
          <p className=" mt-3 text-center text-[15px] font-normal leading-relaxed text-[#42454A] sm:text-[16px] md:text-[20px]">
            {description}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-12 sm:mt-12 md:gap-14 lg:mt-16 lg:gap-16">
          {blocks.map((block, idx) => (
            <AccessoryBlock key={idx} block={block} />
          ))}
        </div>

        {cta && (
          <div className="mt-10 flex justify-center sm:mt-12 lg:mt-16">
            <Link
              href={cta.url}
              className="inline-flex items-center justify-center rounded-lg border-2 border-[#42454A] bg-white md:px-[63px] py-7 text-[15px] font-medium text-[#42454A] transition hover:bg-gray-50 px-6 sm:text-[16px] md:text-[30px]"
            >
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

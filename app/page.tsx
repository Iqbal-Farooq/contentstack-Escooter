import type { Metadata } from 'next';
import { Fragment } from 'react';
import { fetchLandingPage } from '@/lib/contentstack';
import { HeroBanner } from '@/components/sections/HeroBanner';
import { ProductSpecs } from '@/components/sections/ProductSpecs';
import { ProductInformation } from '@/components/sections/ProductInformation';
import { HighEfficiencyMotor } from '@/components/sections/HighEfficiencyMotor';
import { Accessories } from '@/components/sections/Accessories';
import { Gallery } from '@/components/sections/Gallery';
import { Colors } from '@/components/sections/Colors';
import { Testimonials } from '@/components/sections/Testimonials';
import { SubscribeNewsletter } from '@/components/sections/SubscribeNewsletter';
import { ApiDataPrint } from '@/components/ApiDataPrint';

export async function generateMetadata(): Promise<Metadata> {
  const result = await fetchLandingPage();
  const page = result?.data ?? null;
  const seo = page?.seo;
  return {
    title: seo?.meta_title ?? page?.slug?.title ?? 'Home',
    description: seo?.meta_description ?? '',
    openGraph: seo?.open_graph_image
      ? { images: [seo.open_graph_image] }
      : undefined,
    robots: seo?.no_index ? 'noindex, nofollow' : undefined,
    alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
  };
}

export default async function HomePage() {
  const result = await fetchLandingPage();
  const page = result?.data ?? null;
  const sections = page?.sections ?? [];

  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return (
              <Fragment key={`hero-${index}`}>
                <HeroBanner data={section.data.hero_banner} />
                {section.data.specs.length > 0 && (
                  <ProductSpecs specs={section.data.specs} />
                )}
              </Fragment>
            );
          case 'product_information':
            return (
              <ProductInformation key={`product-${index}`} data={section.data} />
            );
          case 'high_efficiency_motor':
            return (
              <HighEfficiencyMotor
                key={`motor-${index}`}
                data={section.data}
              />
            );
          case 'accessories':
            return (
              <Accessories key={`accessories-${index}`} data={section.data} />
            );
          case 'gallery':
            return <Gallery key={`gallery-${index}`} data={section.data} />;
          case 'colors':
            return <Colors key={`colors-${index}`} data={section.data} />;
          case 'testimonials':
            return (
              <Testimonials key={`testimonials-${index}`} data={section.data} />
            );
          default:
            return null;
        }
      })}
      <SubscribeNewsletter />
      {/* {result?.raw != null && (
        <ApiDataPrint data={result.raw} title="Contentstack API data (raw)" />
      )} */}
    </>
  );
}

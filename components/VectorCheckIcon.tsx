import Image from 'next/image';

/** Check/vector icon used for feature lists. 49×49px as per design. */
export function VectorCheckIcon() {
  return (
    <Image
      src="/Vector.png"
      alt=""
      width={49}
      height={49}
      className="shrink-0"
      aria-hidden
    />
  );
}

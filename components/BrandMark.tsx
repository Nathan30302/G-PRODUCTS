/**
 * Crisp vector G-Products mark: bold G inside a thick teardrop ring,
 * green → yellow L→R gradient, transparent background.
 *
 * Gradient id is shared intentionally — identical stops, safe if multiple
 * marks mount on one page (nav + splash).
 */
export function BrandMark({
  className = "",
  title = "G-Products"
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <linearGradient
          id="gpBrandMarkGrad"
          x1="14"
          y1="50"
          x2="88"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#22c98a" />
          <stop offset="1" stopColor="#f6d400" />
        </linearGradient>
      </defs>
      <g fill="url(#gpBrandMarkGrad)">
        {/* Teardrop ring — pointed lobe at upper-right */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M87.2 12.8c2.2 3.4 2.4 11.7 2 20.7-.4 10.5-.8 21-2 29.5-1.4 10-5.7 17.5-13.7 22.5S55.5 92 46.5 91.5c-9.5-.5-19-4.5-25.5-12C14.5 72 11.8 61.5 12 50.5c.2-11.5 4.2-22.5 12.5-29.5S43 11.5 53.5 11.8c10.5.3 23 .4 30 .4 2 0 2.9 0 3.7.6zM51 22.8c-8 .4-15.5 2.7-20.8 7.7-5.7 5.5-8 13-8 21s2.8 16 9 21.5 14.3 8.2 22.3 8c8-.2 15.7-3.8 21-10.2 5.3-6.4 7.7-15.8 8-24.3.3-8.5.1-18-1.5-21.7-1-1.8-6.5-2.3-13-2.6s-12 .3-17 .6z"
        />
        {/* Bold G: thick C with flat right aperture + mid spur */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M72 34c-5-5.5-12.5-8-20.5-8-13.5 0-23.5 10.5-23.5 24.5S38 75 51.5 75 67 72.5 72 67v-6h-8.5c-3 4-7 6.5-12 6.5-8.5 0-14.5-7-14.5-16.5S43 33.5 51.5 33.5c5 0 9 2.5 12 6.5H72V34z"
        />
        <path d="M52 46.5h20v9H52z" />
      </g>
    </svg>
  );
}

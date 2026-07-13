import { forwardRef } from "react";

// Format timeframe: remove months if same year, keep years only
const formatTimeframe = (timeframe) => {
  // Check if it contains "Present"
  if (timeframe.includes("Present")) {
    // Extract year from the first part (e.g., "August 2024" -> "2024")
    const yearMatch = timeframe.match(/\d{4}/);
    if (yearMatch) {
      return `${yearMatch[0]} – Present`;
    }
    return timeframe; // Fallback if no year found
  }

  // Extract years from both dates
  const years = timeframe.match(/\d{4}/g);
  if (years && years.length === 2) {
    const [startYear, endYear] = years;
    if (startYear === endYear) {
      // Same year, return just the year
      return startYear;
    } else {
      // Different years, return "Year – Year"
      return `${startYear} – ${endYear}`;
    }
  }

  return timeframe; // Fallback if parsing fails
};

const TimelineItem = forwardRef(({ experience }, ref) => {
  return (
    <a
      ref={ref}
      href={experience.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${experience.company}`}
      className="col-span-full grid grid-cols-1 md:grid-cols-[max-content_1px_50rem_auto] md:gap-x-10 group experience-timeline-row block cursor-pointer no-underline text-inherit"
    >
      {/* Date Column */}
      <div className="md:text-right pt-4 pb-3 md:pb-12 md:w-[180px] md:min-w-[180px]">
        <span className="text-zinc-500 group-hover:text-[#7dd3fc] text-xs md:text-xs font-medium uppercase tracking-[0.2em] whitespace-nowrap block transition-colors duration-500">
          {formatTimeframe(experience.timeframe)}
        </span>
      </div>

      {/* Line Column */}
      <div className="hidden md:flex justify-center relative pb-12">
        <div className="w-[1px] bg-zinc-800/60 group-hover:bg-[#7dd3fc] transition-colors duration-500" />
      </div>

      {/* Content Column */}
      <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-6 relative pt-1 md:pt-3 pb-16 md:pb-12 min-w-0">
        <div className="relative flex-shrink-0 w-full md:w-40 aspect-square overflow-hidden rounded-xl md:rounded-lg border border-zinc-800/80 bg-zinc-900 shadow-xl">
          <img
            src={experience.imageUrl}
            alt={`${experience.title} at ${experience.company}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex flex-row items-start justify-between md:block">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="text-base md:text-lg font-bold text-zinc-300 group-hover:text-[#7dd3fc] transition-colors duration-500 tracking-tight leading-tight">
                {experience.title}
              </h3>
              <span className="text-zinc-400 text-base md:text-lg">·</span>
              <p className="text-zinc-300 group-hover:text-[#7dd3fc] font-semibold text-base md:text-lg transition-colors duration-500">
                {experience.company}
              </p>
            </div>
            {experience.description && (
              <p className="text-zinc-500 text-sm md:text-base mt-2 font-normal leading-relaxed">
                {experience.description}
              </p>
            )}
          </div>
          <div className="md:hidden ml-4 flex-shrink-0">
            <LinkArrow />
          </div>
        </div>
      </div>

      {/* Link Column — fixed grid track keeps arrows aligned across rows */}
      <div className="hidden md:flex flex-shrink-0 items-start pt-1 md:pt-3 pb-16 md:pb-12 experience-timeline-row-arrow">
        <LinkArrow />
      </div>
      <div className="md:hidden h-px bg-zinc-900/50 mb-10 last:hidden w-full col-span-full" />
    </a>
  );
});

TimelineItem.displayName = "TimelineItem";

const LinkArrow = () => (
  <span
    className="experience-timeline-link-arrow inline-flex items-center justify-center w-10 h-10 md:w-10 md:h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-[#7dd3fc] group-hover:border-[#7dd3fc]/50 group-hover:bg-[#7dd3fc]/5 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 active:scale-95 pointer-events-none"
    aria-hidden
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  </span>
);

export default TimelineItem;

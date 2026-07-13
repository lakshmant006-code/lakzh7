import { useRef } from "react";
import { awards } from "../../data/awards";
import useRiseUpOnScroll from "../../hooks/useRiseUpOnScroll";
import "./AwardsGrid.css";

const AwardsGrid = () => {
  const sectionRef = useRef(null);
  useRiseUpOnScroll(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="awards-section"
      className="awards-section"
    >
      <div className="w-full md:max-w-[900px] lg:max-w-[1000px] md:mx-auto">
        <div className="awards-grid">
          {awards.map((award) => (
            <div key={award.id} className="award-card">
              <h3 className="award-title">{award.title}</h3>
              <p className="award-organization">{award.organization}</p>
              <p className="award-year">{award.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsGrid;


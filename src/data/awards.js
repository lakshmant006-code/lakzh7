import figmaVinyl from "../assets/img/about-pictures/vinyl/figma.png";
import nyuVinyl from "../assets/img/about-pictures/vinyl/nyu.png";
import interactionDVinyl from "../assets/img/about-pictures/vinyl/interaction-d.png";
import figmaFundVinyl from "../assets/img/about-pictures/vinyl/figma-fund.png";
import graceHopperVinyl from "../assets/img/about-pictures/vinyl/grace-hopper.png";
import sase1Vinyl from "../assets/img/about-pictures/vinyl/sase-1.png";
import sase2Vinyl from "../assets/img/about-pictures/vinyl/sase-2.png";

// Awards and Certifications Data
// Rack layout: top row = first 3 entries, bottom row = last 4 (newest → oldest)
export const awards = [
  // — Top row —
  {
    id: "7",
    title: "FigBuild Most Impact Winner",
    organization: "FigBuild",
    year: "2026",
    vinylImage: figmaVinyl,
  },
  {
    id: "1",
    title: "TSOA Graduate Scholarship",
    organization: "NYU Tisch School of The Arts",
    year: "2024-2026",
    vinylImage: nyuVinyl,
  },
  {
    id: "2",
    title: "Interaction Design Specialization",
    organization: "UC San Diego (Coursera)",
    year: "2024",
    vinylImage: interactionDVinyl,
  },
  // — Bottom row —
  {
    id: "3",
    title: "Figma Fundamentals for Aspiring UI/UX Designers Certification",
    organization: "Tertiary Infotech Singapore",
    year: "2024",
    vinylImage: figmaFundVinyl,
  },
  {
    id: "4",
    title: "Grace Hopper Conference Scholarship",
    organization: "Purdue Computer Science Department",
    year: "2018",
    vinylImage: graceHopperVinyl,
  },
  {
    id: "5",
    title: "Freshman of the Year",
    organization: "Society of Asian Scientists and Engineers",
    year: "2017",
    vinylImage: sase1Vinyl,
  },
  {
    id: "6",
    title: "Emerging Leader",
    organization: "Society of Asian Scientists and Engineers",
    year: "2017",
    vinylImage: sase2Vinyl,
  },
];
export const TOP_ROW_COUNT = 3;
export const BOTTOM_ROW_COUNT = 4;

export const AWARD_VINYL_PALETTE = [
  "#ebe7e0",
  "#e4e0d8",
  "#ddd9d1",
  "#d6d2ca",
  "#efebe4",
  "#e8e4dc",
  "#e0dcd4",
];

/** Split awards into top and bottom rack rows. */
export function buildAwardRows(awardsList, topCount = TOP_ROW_COUNT) {
  return {
    topRow: awardsList.slice(0, topCount),
    bottomRow: awardsList.slice(topCount),
  };
}

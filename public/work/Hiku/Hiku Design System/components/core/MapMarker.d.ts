import React from "react";

export interface MapMarkerProps {
  /** Icon glyph inside the marker. Default "map-pin". */
  icon?: string;
  /** Active/selected — deep-green fill, white icon. */
  active?: boolean;
  /** Diameter in px. Default 34. */
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * MapMarker — circular point-of-interest pin for the Trails map: white
 * disc + green icon, or deep-green fill when active.
 */
export function MapMarker(props: MapMarkerProps): JSX.Element;

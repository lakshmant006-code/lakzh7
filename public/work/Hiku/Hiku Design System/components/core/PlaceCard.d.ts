import React from "react";

export interface PlaceCardProps {
  /** Image URL. */
  image?: string;
  title: string;
  /** Muted meta line (location, distance). */
  meta?: string;
  /** Rating value, e.g. 4.92. */
  rating?: number;
  /** Price string, e.g. "$120". */
  price?: string;
  /** Price unit suffix. Default "night". */
  priceUnit?: string;
  saved?: boolean;
  onSave?: (saved: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * PlaceCard — imagery-forward listing card (camp, trail, shop item) with
 * a heart save button, title, meta, rating and price.
 *
 * @startingPoint section="Content" subtitle="Listing card with save + rating" viewport="360x360"
 */
export function PlaceCard(props: PlaceCardProps): JSX.Element;

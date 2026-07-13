import React from "react";

export interface NavTab {
  id: string;
  label: string;
  icon: string;
  /** Render an avatar circle instead of a glyph (the Account tab). */
  avatar?: boolean;
}

export interface BottomNavProps {
  /** Tab list. Defaults to Explore · Trails · Community · Shop · Account. */
  items?: NavTab[];
  /** Active tab id. */
  active?: string;
  /** Image URL for the avatar tab. */
  avatarSrc?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

/**
 * BottomNav — Hiku's 5-tab bottom bar. Active tab is deep green; the
 * Account tab shows an avatar. Fixed to the bottom of app screens.
 *
 * @startingPoint section="Navigation" subtitle="5-tab app bottom bar" viewport="390x88"
 */
export function BottomNav(props: BottomNavProps): JSX.Element;

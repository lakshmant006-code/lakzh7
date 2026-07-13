import React from "react";

export interface AvatarProps {
  /** Image URL. */
  src?: string;
  /** Name — used for initials fallback. */
  name?: string;
  /** Diameter in px. Default 40. */
  size?: number;
  /** Green active ring. */
  ring?: boolean;
  style?: React.CSSProperties;
}

/**
 * Avatar — circular user image with initials/user-icon fallback and an
 * optional green ring for the active/account state.
 */
export function Avatar(props: AvatarProps): JSX.Element;

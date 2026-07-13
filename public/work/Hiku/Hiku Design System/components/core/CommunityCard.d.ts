import React from "react";

export interface CommunityCardProps {
  /** Banner image URL. */
  image?: string;
  title: string;
  /** Short description (hidden when compact). */
  description?: string;
  /** Member count label. */
  members?: number | string;
  /** Compact variant — banner + title only. */
  compact?: boolean;
  joined?: boolean;
  onJoin?: (joined: boolean) => void;
  onKnowMore?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * CommunityCard — a club/group card in the Community feed: banner, title,
 * description and a Join action. `compact` renders banner + title only.
 *
 * @startingPoint section="Content" subtitle="Community group card with Join" viewport="360x260"
 */
export function CommunityCard(props: CommunityCardProps): JSX.Element;

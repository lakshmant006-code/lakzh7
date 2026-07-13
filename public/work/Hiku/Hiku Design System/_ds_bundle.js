/* @ds-bundle: {"format":4,"namespace":"HikuDesignSystem_2ec900","components":[{"name":"AppHeader","sourcePath":"components/core/AppHeader.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"BottomNav","sourcePath":"components/core/BottomNav.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"CommunityCard","sourcePath":"components/core/CommunityCard.jsx"},{"name":"FilterChip","sourcePath":"components/core/FilterChip.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Illustration","sourcePath":"components/core/Illustration.jsx"},{"name":"ILLUSTRATION_SCENES","sourcePath":"components/core/Illustration.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"MapMarker","sourcePath":"components/core/MapMarker.jsx"},{"name":"OptionRow","sourcePath":"components/core/OptionRow.jsx"},{"name":"PlaceCard","sourcePath":"components/core/PlaceCard.jsx"},{"name":"SearchBar","sourcePath":"components/core/SearchBar.jsx"}],"sourceHashes":{"components/core/AppHeader.jsx":"f5ae959481f0","components/core/Avatar.jsx":"27de905e698e","components/core/BottomNav.jsx":"c793bd354829","components/core/Button.jsx":"cba3b01cf268","components/core/CommunityCard.jsx":"36d03d56d863","components/core/FilterChip.jsx":"7cbf35d42943","components/core/Icon.jsx":"07da7bff5acc","components/core/IconButton.jsx":"3110ab345fdc","components/core/Illustration.jsx":"b47afaea2c74","components/core/Input.jsx":"e3a972d0f32d","components/core/Logo.jsx":"9930a0737d55","components/core/MapMarker.jsx":"08e3ad9b26bc","components/core/OptionRow.jsx":"9d5764d4540e","components/core/PlaceCard.jsx":"6802767d4105","components/core/SearchBar.jsx":"b2d08ea9b92f","ui_kits/hiku-app/screens.jsx":"79171cbd277b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HikuDesignSystem_2ec900 = window.HikuDesignSystem_2ec900 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Hiku uses the Lucide icon set (line style, 2px stroke, round caps).
 * Paths below are lifted verbatim from Lucide so the bundle stays
 * self-contained (no CDN needed). Add glyphs here as screens require them.
 */
const PATHS = {
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  "sliders-horizontal": '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 21.381V8.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  compass: '<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  "shopping-bag": '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  navigation: '<path d="M3 11l19-9-9 19-2-8-8-2z"/>',
  tent: '<path d="M3.5 21 14 3"/><path d="M20.5 21 10 3"/><path d="M15.5 21 12 15l-3.5 6"/><path d="M2 21h20"/>',
  caravan: '<path d="M18 19V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a1 1 0 0 0 1 1h2"/><path d="M18 19h3a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 9H14"/><circle cx="9" cy="19" r="2"/><path d="M11 19h4"/><path d="M7 11h4v4H7z"/>',
  house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>',
  "map-pin": '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  "sliders-vertical": '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/>',
  mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>'
};

/**
 * Icon — Lucide glyph renderer.
 */
function Icon({
  name,
  size = 22,
  strokeWidth = 2,
  color = "currentColor",
  style,
  ...rest
}) {
  const body = PATHS[name];
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "block",
      flexShrink: 0,
      ...style
    },
    "aria-hidden": "true",
    dangerouslySetInnerHTML: {
      __html: body || ""
    }
  }, rest));
}
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — circular user image with initials/icon fallback and an
 * optional green active ring (used on the Account tab and Community).
 */
function Avatar({
  src,
  name,
  size = 40,
  ring = false,
  style,
  ...rest
}) {
  const initials = name ? name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : null;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: "var(--radius-pill)",
      overflow: "hidden",
      background: src ? `center/cover no-repeat url(${src})` : "var(--green-200)",
      border: ring ? "2px solid var(--brand)" : "none",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: size * 0.4,
      color: "var(--green-700)",
      ...style
    }
  }, rest), !src && (initials || /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "user",
    size: size * 0.5,
    color: "var(--green-700)"
  })));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/BottomNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_TABS = [{
  id: "explore",
  label: "Explore",
  icon: "search"
}, {
  id: "trails",
  label: "Trails",
  icon: "map"
}, {
  id: "community",
  label: "Community",
  icon: "globe"
}, {
  id: "shop",
  label: "Shop",
  icon: "shopping-bag"
}, {
  id: "account",
  label: "Account",
  icon: "user",
  avatar: true
}];

/**
 * BottomNav — the 5-tab app tab bar. Active tab turns deep green.
 * The Account tab renders a small avatar instead of a line glyph.
 */
function BottomNav({
  items = DEFAULT_TABS,
  active = "explore",
  avatarSrc,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: "flex",
      alignItems: "stretch",
      justifyContent: "space-around",
      width: "100%",
      padding: "8px 6px 10px",
      background: "var(--white)",
      borderTop: "1px solid var(--border-hairline)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), items.map(t => {
    const on = t.id === active;
    const color = on ? "var(--action-nav-active)" : "var(--action-nav-idle)";
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      type: "button",
      onClick: () => onChange && onChange(t.id),
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        flex: 1,
        minWidth: 0,
        padding: "2px 0",
        background: "none",
        border: "none",
        cursor: "pointer",
        color,
        WebkitTapHighlightColor: "transparent"
      }
    }, t.avatar ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        borderRadius: "var(--radius-pill)",
        border: `2px solid ${on ? "var(--action-nav-active)" : "transparent"}`,
        overflow: "hidden",
        display: "block",
        background: avatarSrc ? `center/cover no-repeat url(${avatarSrc})` : "var(--green-200)"
      }
    }, !avatarSrc && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "user",
      size: 16,
      color: "var(--green-700)",
      style: {
        margin: "5px auto"
      }
    })) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: t.icon,
      size: 24,
      color: color,
      strokeWidth: on ? 2.3 : 2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--fs-nav)",
        fontWeight: on ? "var(--fw-medium)" : "var(--fw-regular)",
        color,
        lineHeight: 1
      }
    }, t.label));
  }));
}
Object.assign(__ds_scope, { BottomNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/BottomNav.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — Hiku's primary action. Fully-rounded pill, Satoshi Medium,
 * deep-green fill for primary. Matches "show 250 places" and "Register".
 */
function Button({
  children,
  variant = "primary",
  size = "lg",
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const heights = {
    sm: 34,
    md: 40,
    lg: 48
  };
  const pads = {
    sm: "0 16px",
    md: "0 20px",
    lg: "0 26px"
  };
  const fonts = {
    sm: "var(--fs-caption)",
    md: "var(--fs-label)",
    lg: "var(--fs-label)"
  };
  const variants = {
    primary: {
      background: "var(--action-primary)",
      color: "var(--text-on-brand)",
      border: "1px solid transparent"
    },
    secondary: {
      background: "var(--white)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-default)"
    },
    ghost: {
      background: "transparent",
      color: "var(--brand)",
      border: "1px solid transparent"
    },
    vibrant: {
      background: "var(--brand-vibrant)",
      color: "var(--white)",
      border: "1px solid transparent"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: heights[size],
      padding: pads[size],
      width: fullWidth ? "100%" : "auto",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-medium)",
      fontSize: fonts[size],
      lineHeight: 1,
      borderRadius: "var(--radius-pill)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)",
      WebkitTapHighlightColor: "transparent",
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(var(--press-scale))";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === "sm" ? 16 : 18
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: size === "sm" ? 16 : 18
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/CommunityCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CommunityCard — a group/club card in the Community feed: banner image,
 * title, a short description and a Join action with a "Know more" link.
 */
function CommunityCard({
  image,
  title,
  description,
  members,
  compact = false,
  joined = false,
  onJoin,
  onKnowMore,
  style,
  ...rest
}) {
  const [isJoined, setJoined] = React.useState(joined);
  return /*#__PURE__*/React.createElement("article", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-card)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      boxShadow: "var(--shadow-card)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: compact ? 64 : 96,
      background: image ? `center/cover no-repeat url(${image})` : "var(--green-100)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: compact ? "10px 12px" : "12px 14px 14px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--fs-h3)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text-primary)",
      lineHeight: 1.25
    }
  }, title), !compact && description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      fontSize: "var(--fs-sm)",
      lineHeight: 1.45,
      color: "var(--text-secondary)"
    }
  }, description), members && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      marginTop: 8,
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "user",
    size: 13,
    color: "var(--ink-500)"
  }), members, " members"), !compact && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: isJoined ? "secondary" : "primary",
    size: "sm",
    onClick: () => {
      setJoined(!isJoined);
      onJoin && onJoin(!isJoined);
    }
  }, isJoined ? "Joined" : "Join"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onKnowMore,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-sm)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-link)"
    }
  }, "Know more"))));
}
Object.assign(__ds_scope, { CommunityCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CommunityCard.jsx", error: String((e && e.message) || e) }); }

// components/core/FilterChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * FilterChip — the small pill filters under the search bar. Two forms:
 * a dropdown chip (label + chevron, e.g. "Camping style") and a plain
 * toggle chip (e.g. "Pets allowed"). Selected state fills soft green.
 */
function FilterChip({
  children,
  dropdown = false,
  selected = false,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: "var(--control-sm)",
      padding: "0 14px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-medium)",
      color: selected ? "var(--green-700)" : "var(--text-primary)",
      background: selected ? "var(--brand-wash)" : "var(--white)",
      border: `1px solid ${selected ? "var(--brand-vibrant)" : "var(--border-default)"}`,
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background var(--dur-fast), border-color var(--dur-fast)",
      WebkitTapHighlightColor: "transparent",
      ...style
    }
  }, rest), children, dropdown && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 15,
    strokeWidth: 2.2
  }));
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — square or round icon-only control. Covers the header
 * filter button (square, bordered), map FABs (round, floating) and
 * the back arrow (round, plain).
 */
function IconButton({
  icon,
  shape = "square",
  variant = "outline",
  size = 44,
  iconSize,
  active = false,
  disabled = false,
  onClick,
  ariaLabel,
  style,
  ...rest
}) {
  const variants = {
    outline: {
      background: "var(--white)",
      border: "1px solid var(--border-default)",
      color: "var(--ink-900)"
    },
    float: {
      background: "var(--white)",
      border: "1px solid var(--border-hairline)",
      color: "var(--ink-900)",
      boxShadow: "var(--shadow-float)"
    },
    plain: {
      background: "transparent",
      border: "1px solid transparent",
      color: "var(--ink-900)"
    },
    brand: {
      background: "var(--action-primary)",
      border: "1px solid transparent",
      color: "var(--white)"
    }
  };
  const activeStyle = active ? {
    borderColor: "var(--brand)",
    color: "var(--brand)"
  } : null;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: shape === "round" ? "var(--radius-pill)" : "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "transform var(--dur-fast) var(--ease-standard), background var(--dur-fast)",
      WebkitTapHighlightColor: "transparent",
      ...variants[variant],
      ...activeStyle,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(var(--press-scale))";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSize || Math.round(size * 0.45)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Illustration.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Illustration — flat, monochrome hiking scenes built from the Hiku green
 * palette (tonal greens only). Vector, scalable, and the-able via `tone`.
 * Scenes: "mountains" | "tent" | "forest" | "trail" | "campfire" | "lake".
 */
function Illustration({
  scene = "mountains",
  tone = "green",
  height = 160,
  style,
  ...rest
}) {
  const P = TONES[tone] || TONES.green;
  const S = SCENES[scene] || SCENES.mountains;
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 400 260",
    height: height,
    width: height * 400 / 260,
    role: "img",
    "aria-label": `Hiku ${scene} illustration`,
    style: {
      display: "block",
      maxWidth: "100%",
      ...style
    }
  }, rest), S(P));
}

/* tonal ramps — every scene is monochrome within one hue family */
const TONES = {
  green: {
    bg: "#eef7f1",
    t1: "#b9dfc9",
    t2: "#8dcaaf",
    t3: "#4fb889",
    t4: "#349369",
    t5: "#216044",
    ink: "#0f3b2a"
  },
  deep: {
    bg: "#d9ede1",
    t1: "#8dcaaf",
    t2: "#4fb889",
    t3: "#349369",
    t4: "#2b7c58",
    t5: "#216044",
    ink: "#0b2c20"
  },
  soft: {
    bg: "#ffffff",
    t1: "#d9ede1",
    t2: "#b9dfc9",
    t3: "#8dcaaf",
    t4: "#4fb889",
    t5: "#349369",
    ink: "#216044"
  }
};
const SCENES = {
  mountains: c => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "260",
    fill: c.bg
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "312",
    cy: "66",
    r: "30",
    fill: c.t2,
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 210 L70 120 L120 175 L150 140 L210 210 Z",
    fill: c.t3
  }), /*#__PURE__*/React.createElement("path", {
    d: "M150 210 L240 96 L300 165 L340 128 L400 210 Z",
    fill: c.t4
  }), /*#__PURE__*/React.createElement("path", {
    d: "M240 96 L262 124 L233 138 L221 118 Z",
    fill: c.bg,
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M70 120 L86 142 L60 152 L52 132 Z",
    fill: c.bg,
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("rect", {
    y: "208",
    width: "400",
    height: "52",
    fill: c.t5
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 224 Q120 214 200 224 T400 222 L400 260 L0 260 Z",
    fill: c.ink,
    opacity: "0.5"
  })),
  tent: c => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "260",
    fill: c.bg
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 200 L110 118 L180 200 Z",
    fill: c.t3,
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M230 200 L330 128 L400 200 Z",
    fill: c.t3,
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("rect", {
    y: "196",
    width: "400",
    height: "64",
    fill: c.t2
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 196 L200 96 L280 196 Z",
    fill: c.t4
  }), /*#__PURE__*/React.createElement("path", {
    d: "M200 96 L200 196 L172 196 Z",
    fill: c.t5
  }), /*#__PURE__*/React.createElement("path", {
    d: "M200 196 L214 158 L232 196 Z",
    fill: c.ink,
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "200",
    y1: "86",
    x2: "200",
    y2: "100",
    stroke: c.t5,
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "200",
    cy: "82",
    r: "5",
    fill: c.t4
  })),
  forest: c => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "260",
    fill: c.bg
  }), /*#__PURE__*/React.createElement("rect", {
    y: "206",
    width: "400",
    height: "54",
    fill: c.t2
  }), [[70, 150, c.t3], [150, 120, c.t4], [235, 138, c.t3], [320, 112, c.t5]].map(([x, top, col], i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("rect", {
    x: x - 5,
    y: top + 60,
    width: "10",
    height: "26",
    fill: c.t5
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${x} ${top} L${x - 34} ${top + 62} L${x + 34} ${top + 62} Z`,
    fill: col
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${x} ${top + 24} L${x - 40} ${top + 92} L${x + 40} ${top + 92} Z`,
    fill: col
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M0 232 Q200 216 400 234 L400 260 L0 260 Z",
    fill: c.ink,
    opacity: "0.4"
  })),
  trail: c => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "260",
    fill: c.bg
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 150 L90 92 L160 140 L250 78 L330 120 L400 88 L400 260 L0 260 Z",
    fill: c.t2
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 190 L120 150 L220 196 L320 150 L400 186 L400 260 L0 260 Z",
    fill: c.t3
  }), /*#__PURE__*/React.createElement("path", {
    d: "M188 258 C188 210 250 200 236 150 C226 116 286 108 300 74",
    fill: "none",
    stroke: c.t5,
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeDasharray: "2 16"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "300",
    cy: "70",
    r: "9",
    fill: c.t4,
    stroke: c.bg,
    strokeWidth: "3"
  })),
  campfire: c => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "260",
    fill: c.bg
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "200",
    cy: "212",
    rx: "120",
    ry: "26",
    fill: c.t2
  }), /*#__PURE__*/React.createElement("path", {
    d: "M200 96 C176 128 186 150 200 176 C222 150 236 130 214 100 C210 118 206 120 200 96 Z",
    fill: c.t4
  }), /*#__PURE__*/React.createElement("path", {
    d: "M200 130 C188 148 194 162 200 176 C212 162 214 150 205 132 C202 146 200 146 200 130 Z",
    fill: c.t5
  }), /*#__PURE__*/React.createElement("g", {
    stroke: c.ink,
    strokeWidth: "8",
    strokeLinecap: "round",
    opacity: "0.85"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "150",
    y1: "212",
    x2: "250",
    y2: "196"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "250",
    y1: "212",
    x2: "150",
    y2: "196"
  }))),
  lake: c => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "260",
    fill: c.bg
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "86",
    cy: "66",
    r: "26",
    fill: c.t2,
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 150 L110 74 L190 150 Z",
    fill: c.t4
  }), /*#__PURE__*/React.createElement("path", {
    d: "M150 150 L260 60 L360 150 Z",
    fill: c.t5
  }), /*#__PURE__*/React.createElement("path", {
    d: "M260 60 L282 92 L246 104 Z",
    fill: c.bg,
    opacity: "0.8"
  }), /*#__PURE__*/React.createElement("rect", {
    y: "150",
    width: "400",
    height: "110",
    fill: c.t3
  }), /*#__PURE__*/React.createElement("g", {
    stroke: c.bg,
    strokeWidth: "3",
    opacity: "0.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "60",
    y1: "176",
    x2: "130",
    y2: "176"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "230",
    y1: "196",
    x2: "330",
    y2: "196"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "120",
    y1: "220",
    x2: "260",
    y2: "220"
  })))
};
const ILLUSTRATION_SCENES = Object.keys(SCENES);
Object.assign(__ds_scope, { Illustration, ILLUSTRATION_SCENES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Illustration.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — Hiku text field. Rounded rect, hairline border, Satoshi 500
 * value text. Matches the "Jaden Smith" / email fields on Community.
 */
function Input({
  value,
  defaultValue,
  placeholder,
  type = "text",
  label,
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      width: "100%",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginBottom: 6,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-sm)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-secondary)"
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      height: "var(--control-md)",
      padding: "0 16px",
      boxSizing: "border-box",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-primary)",
      background: disabled ? "var(--surface-sunken)" : "var(--white)",
      border: `1px solid ${focus ? "var(--border-focus)" : "var(--border-default)"}`,
      borderRadius: "var(--radius-md)",
      outline: "none",
      transition: "border-color var(--dur-fast) var(--ease-standard)"
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Logo — the Hiku brand lockup. Renders the green mountain mark (image)
 * plus an optional Satoshi-Black wordmark. If no mark image is available,
 * falls back to the wordmark alone (there is no SVG source mark).
 */
function Logo({
  src = "assets/logo-mark.png",
  wordmark = false,
  height = 28,
  color = "var(--green-500)",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      ...style
    }
  }, rest), src && /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "Hiku",
    style: {
      height,
      width: "auto",
      display: "block"
    }
  }), (wordmark || !src) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-black)",
      fontSize: height * 0.9,
      letterSpacing: "var(--ls-tight)",
      color,
      lineHeight: 1
    }
  }, "Hiku"));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/AppHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * AppHeader — the soft-green brand band at the top of app screens.
 * Holds the Hiku mark; content can be layered below it.
 */
function AppHeader({
  logoSrc = "assets/logo-mark.png",
  height = 96,
  align = "left",
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: align === "center" ? "center" : "flex-start",
      height,
      padding: "0 20px 12px",
      background: "var(--surface-header)",
      ...style
    }
  }, rest), children || /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    src: logoSrc,
    height: 34
  }));
}
Object.assign(__ds_scope, { AppHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/core/MapMarker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MapMarker — a circular pin on the Trails map. A white disc with a
 * green icon; the "active" marker fills deep green with a white icon.
 */
function MapMarker({
  icon = "map-pin",
  active = false,
  size = 34,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "var(--radius-pill)",
      background: active ? "var(--brand)" : "var(--white)",
      border: `1px solid ${active ? "var(--brand)" : "var(--border-hairline)"}`,
      boxShadow: "var(--shadow-float)",
      cursor: "pointer",
      WebkitTapHighlightColor: "transparent",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size * 0.5,
    color: active ? "var(--white)" : "var(--brand)",
    strokeWidth: 2.2
  }));
}
Object.assign(__ds_scope, { MapMarker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MapMarker.jsx", error: String((e && e.message) || e) }); }

// components/core/OptionRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * OptionRow — a selectable list row with a leading icon, bold title and
 * muted subtitle inside a bordered rounded card. Matches the RV / Tent /
 * Lodging chooser on the Camping-style sheet.
 */
function OptionRow({
  icon,
  title,
  subtitle,
  selected = false,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      width: "100%",
      padding: "16px 18px",
      textAlign: "left",
      background: "var(--white)",
      border: `1px solid ${selected ? "var(--brand-vibrant)" : "var(--border-default)"}`,
      boxShadow: selected ? "0 0 0 1px var(--brand-vibrant)" : "none",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
      WebkitTapHighlightColor: "transparent",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 44,
      height: 44,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 30,
    strokeWidth: 1.8,
    color: "var(--ink-900)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 3,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text-primary)",
      lineHeight: 1.2
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-sm)",
      fontWeight: "var(--fw-regular)",
      color: "var(--text-secondary)",
      lineHeight: 1.2
    }
  }, subtitle)));
}
Object.assign(__ds_scope, { OptionRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/OptionRow.jsx", error: String((e && e.message) || e) }); }

// components/core/PlaceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PlaceCard — a listing card for camps / trails / shop items. Rounded
 * image with a heart save button, then title, meta and an optional
 * star rating. Composes the imagery-forward Explore feed.
 */
function PlaceCard({
  image,
  title,
  meta,
  rating,
  price,
  priceUnit = "night",
  saved = false,
  onSave,
  onClick,
  style,
  ...rest
}) {
  const [isSaved, setSaved] = React.useState(saved);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      width: "100%",
      cursor: onClick ? "pointer" : "default",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: "1 / 0.82"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "var(--radius-md)",
      background: image ? `center/cover no-repeat url(${image})` : "var(--green-100)",
      border: "1px solid var(--border-hairline)"
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": isSaved ? "Unsave" : "Save",
    onClick: e => {
      e.stopPropagation();
      setSaved(!isSaved);
      onSave && onSave(!isSaved);
    },
    style: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 34,
      height: 34,
      borderRadius: "var(--radius-pill)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255,255,255,0.9)",
      border: "none",
      cursor: "pointer",
      boxShadow: "var(--shadow-sm)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "heart",
    size: 18,
    color: isSaved ? "var(--brand)" : "var(--ink-700)",
    style: {
      fill: isSaved ? "var(--brand)" : "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-body)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text-primary)",
      lineHeight: 1.25
    }
  }, title), rating != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: "var(--fs-sm)",
      fontWeight: "var(--fw-medium)",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "star",
    size: 14,
    color: "var(--ink-900)",
    style: {
      fill: "var(--ink-900)"
    }
  }), rating)), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-sm)",
      color: "var(--text-secondary)"
    }
  }, meta), price != null && /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 2,
      fontSize: "var(--fs-sm)",
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: "var(--fw-bold)"
    }
  }, price), " / ", priceUnit)));
}
Object.assign(__ds_scope, { PlaceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PlaceCard.jsx", error: String((e && e.message) || e) }); }

// components/core/SearchBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SearchBar — the Explore/Trails search field. Rounded container,
 * leading search icon, a bold primary line and a muted secondary line.
 * Matches "Nearby / Add dates  Add guests".
 */
function SearchBar({
  title = "Nearby",
  subtitle = "Add dates · Add guests",
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      height: 60,
      padding: "0 18px",
      background: "var(--white)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--shadow-sm)",
      cursor: "pointer",
      textAlign: "left",
      fontFamily: "var(--font-sans)",
      WebkitTapHighlightColor: "transparent",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 22,
    color: "var(--ink-900)",
    strokeWidth: 2.4
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-label)",
      fontWeight: "var(--fw-bold)",
      color: "var(--text-primary)",
      lineHeight: 1.1
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-sm)",
      fontWeight: "var(--fw-regular)",
      color: "var(--text-secondary)",
      lineHeight: 1.1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, subtitle)));
}
Object.assign(__ds_scope, { SearchBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SearchBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/hiku-app/screens.jsx
try { (() => {
/* Hiku mobile app — UI kit screens. Composes the design-system bundle
   (window.HikuDesignSystem_2ec900). Loaded by index.html after the bundle. */
const DS = window.HikuDesignSystem_2ec900;
const {
  AppHeader,
  SearchBar,
  IconButton,
  FilterChip,
  OptionRow,
  Button,
  BottomNav,
  Input,
  PlaceCard,
  CommunityCard,
  Avatar,
  MapMarker,
  Logo,
  Icon,
  Illustration
} = DS;
const ASSET = "../../assets";
const HERO = ASSET + "/illustration-mountain-river.png";

/* Real photography — Unsplash direct URLs. Each falls back to an on-brand
   monochrome Illustration if the network image fails to load. */
const PHOTOS = {
  lake: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=900&q=80&auto=format&fit=crop",
  camp: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80&auto=format&fit=crop",
  tentDay: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=900&q=80&auto=format&fit=crop",
  trail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80&auto=format&fit=crop",
  hiker: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80&auto=format&fit=crop",
  group: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80&auto=format&fit=crop",
  gearTent: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=700&q=80&auto=format&fit=crop",
  pack: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=700&q=80&auto=format&fit=crop",
  stove: "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?w=700&q=80&auto=format&fit=crop",
  boots: "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=700&q=80&auto=format&fit=crop",
  bag: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=700&q=80&auto=format&fit=crop",
  bottle: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700&q=80&auto=format&fit=crop"
};

/* Photo — real image on top of a monochrome illustration fallback layer. */
function Photo({
  src,
  scene = "mountains",
  tone = "green",
  h = 120,
  r = 12,
  label,
  style
}) {
  const [ok, setOk] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: h,
      borderRadius: r,
      overflow: "hidden",
      border: "1px solid var(--border-hairline)",
      background: "var(--green-100)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0
    }
  }, Illustration ? /*#__PURE__*/React.createElement(Illustration, {
    scene: scene,
    tone: tone,
    height: h,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: "linear-gradient(150deg, var(--green-300), var(--green-500))"
    }
  })), src && ok && /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: label || "",
    onError: () => setOk(false),
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 12,
      bottom: 10,
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: 14,
      textShadow: "0 1px 4px rgba(0,0,0,0.45)",
      zIndex: 2
    }
  }, label));
}

/* ================= 1b. LOADING (snow-reveal) ================= */
function LoadingScreen({
  onDone
}) {
  const logoRef = React.useRef(null);
  const snowRef = React.useRef(null);
  const doneRef = React.useRef(false);
  React.useEffect(() => {
    const logoCanvas = logoRef.current,
      snowCanvas = snowRef.current;
    if (!logoCanvas || !snowCanvas) return;
    const logoCtx = logoCanvas.getContext("2d");
    const snowCtx = snowCanvas.getContext("2d");
    const base = new Image(),
      mid = new Image(),
      final = new Image();
    base.src = ASSET + "/loader/base-logo.png";
    mid.src = ASSET + "/loader/mid-logo.png";
    final.src = ASSET + "/loader/final-logo.png";
    const imgs = [base, mid, final];
    const FALL_ANGLE = 75 * Math.PI / 180;
    const VX = -Math.cos(FALL_ANGLE),
      VY = Math.sin(FALL_ANGLE);
    const FLAKE_COUNT = 28,
      LOAD_DURATION = 2600,
      CAP_CLIP_RATIO = 0.34;
    const PEAK = {
      xMin: 0.28,
      xMax: 0.72,
      yMin: -0.28,
      yMax: 0.48
    };
    let flakes = [],
      progress = 0,
      ready = false,
      raf = 0;
    const loadStart = performance.now();
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const allLoaded = () => imgs.every(i => i.complete && i.naturalWidth > 0);
    function resize() {
      const rect = logoCanvas.parentElement.getBoundingClientRect();
      const w = Math.round(rect.width),
        h = Math.round(rect.height);
      [logoCanvas, snowCanvas].forEach(c => {
        c.width = w;
        c.height = h;
      });
      if (ready) initFlakes();
    }
    function randSize() {
      const r = Math.random();
      if (r < 0.45) return Math.random() * 0.7 + 0.3;
      if (r < 0.8) return Math.random() * 1.4 + 0.9;
      return Math.random() * 2.2 + 1.8;
    }
    function createFlake(w, h, scatter = true) {
      const xMin = PEAK.xMin * w,
        xMax = PEAK.xMax * w,
        yMin = PEAK.yMin * h,
        yMax = PEAK.yMax * h;
      return {
        x: xMin + Math.random() * (xMax - xMin),
        y: scatter ? yMin + Math.random() * (yMax - yMin) : yMin - 5,
        r: randSize(),
        speed: Math.random() * 0.07 + 0.07,
        alpha: Math.random() * 0.35 + 0.25,
        phase: Math.random() * Math.PI * 2
      };
    }
    const inPeak = (f, w, h) => f.x >= PEAK.xMin * w - 5 && f.x <= PEAK.xMax * w + 5 && f.y >= PEAK.yMin * h - 10 && f.y <= PEAK.yMax * h + 5;
    function initFlakes() {
      flakes = Array.from({
        length: FLAKE_COUNT
      }, () => createFlake(snowCanvas.width, snowCanvas.height));
    }
    function drawLogo(p) {
      if (!ready) return;
      const w = logoCanvas.width,
        h = logoCanvas.height,
        eased = easeInOutCubic(p),
        capH = h * CAP_CLIP_RATIO;
      logoCtx.clearRect(0, 0, w, h);
      logoCtx.imageSmoothingQuality = "high";
      // mountain (no snow) always underneath
      logoCtx.globalAlpha = 1;
      logoCtx.drawImage(base, 0, 0, w, h);
      // snow gradually fills the peak from the very tip downward
      const fill = eased * capH;
      if (fill > 0.5) {
        logoCtx.save();
        logoCtx.beginPath();
        logoCtx.rect(0, 0, w, fill); // reveal window grows downward with progress
        logoCtx.clip();
        logoCtx.globalAlpha = 0.5;
        logoCtx.drawImage(mid, 0, 0, w, h);
        logoCtx.globalAlpha = 1;
        logoCtx.drawImage(final, 0, 0, w, h);
        logoCtx.restore();
      }
      logoCtx.globalAlpha = 1;
    }
    function drawFlakes(time) {
      const w = snowCanvas.width,
        h = snowCanvas.height;
      snowCtx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        const tw = 0.8 + 0.2 * Math.sin(time * 0.003 + f.phase);
        snowCtx.beginPath();
        snowCtx.shadowColor = "rgba(15,40,30,0.5)";
        snowCtx.shadowBlur = 3;
        snowCtx.fillStyle = `rgba(255,255,255,${Math.min(1, (f.alpha + 0.5) * tw)})`;
        snowCtx.arc(f.x, f.y, f.r + 0.5, 0, Math.PI * 2);
        snowCtx.fill();
        snowCtx.shadowBlur = 0;
        f.x += VX * f.speed;
        f.y += VY * f.speed;
        if (!inPeak(f, w, h)) Object.assign(f, createFlake(w, h, false));
      }
    }
    function tick(time) {
      const elapsed = time - loadStart;
      progress = Math.min(1, elapsed / LOAD_DURATION);
      drawLogo(progress);
      drawFlakes(time);
      if (elapsed >= LOAD_DURATION + 500 && !doneRef.current) {
        doneRef.current = true;
        onDone();
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    function start() {
      resize();
      if (allLoaded()) {
        ready = true;
        initFlakes();
      }
      raf = requestAnimationFrame(tick);
    }
    imgs.forEach(i => i.addEventListener("load", () => {
      if (allLoaded() && !ready) {
        ready = true;
        initFlakes();
      }
    }));
    start();
    window.addEventListener("resize", resize);
    const safety = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, 4500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 30,
      padding: 24,
      background: "linear-gradient(180deg, #216044 0%, #2b7c58 55%, #349369 100%)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 240,
      height: 154,
      filter: "drop-shadow(0 12px 34px rgba(10,35,25,0.4))"
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: logoRef,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: snowRef,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      display: "block",
      pointerEvents: "none"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-lettering)",
      fontSize: 30,
      color: "#fff",
      lineHeight: 1
    }
  }, "Hiku")));
}

/* ================= 1. SPLASH ================= */
function SplashScreen({
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 16,
      padding: 24,
      overflow: "hidden",
      background: `center/cover no-repeat url(${ASSET + "/splash-mountains.png"})`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 30%, rgba(20,50,38,0.15) 62%, rgba(15,40,30,0.72) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      marginBottom: 96,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: ASSET + "/splash-logo.png",
    alt: "Hiku",
    style: {
      width: 150,
      filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.28))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-lettering)",
      fontWeight: 400,
      fontSize: 56,
      lineHeight: 1,
      color: "#fff",
      textShadow: "0 2px 16px rgba(15,40,30,0.5)"
    }
  }, "Hiku"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 500,
      color: "rgba(255,255,255,0.92)",
      textAlign: "center",
      maxWidth: 230,
      lineHeight: 1.4,
      textShadow: "0 1px 8px rgba(15,40,30,0.55)"
    }
  }, "Track trails. Gear up. Find your people.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 40,
      left: 24,
      right: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: () => go("explore")
  }, "Get started")));
}

/* ================= 2. EXPLORE / FILTER ================= */
const STYLES = {
  rv: {
    count: 128,
    hero: PHOTOS.tentDay,
    scene: "forest",
    tone: "deep",
    label: "RV-friendly sites",
    title: "RV hookups & access",
    options: [{
      icon: "caravan",
      t: "Full hookups",
      s: "Water · power · sewer",
      n: "72 sites"
    }, {
      icon: "navigation",
      t: "Pull-through",
      s: "Easy in, easy out",
      n: "40 sites"
    }, {
      icon: "house",
      t: "Dump station",
      s: "On-site sanitation",
      n: "16 sites"
    }]
  },
  tent: {
    count: 250,
    hero: PHOTOS.camp,
    scene: "lake",
    tone: "green",
    label: "Tent pitches",
    title: "Tent camping features",
    options: [{
      icon: "tent",
      t: "Walk-in sites",
      s: "Car-free & quiet",
      n: "134 sites"
    }, {
      icon: "compass",
      t: "Backcountry",
      s: "Dispersed camping",
      n: "88 sites"
    }, {
      icon: "map-pin",
      t: "Fire rings",
      s: "Where permitted",
      n: "28 sites"
    }]
  },
  lodging: {
    count: 64,
    hero: PHOTOS.group,
    scene: "mountains",
    tone: "soft",
    label: "Cabins & lodges",
    title: "Lodging options",
    options: [{
      icon: "house",
      t: "Cabins",
      s: "Private & heated",
      n: "38 stays"
    }, {
      icon: "user",
      t: "Bunkhouses",
      s: "Group-friendly",
      n: "18 stays"
    }, {
      icon: "star",
      t: "Lodges",
      s: "Full service",
      n: "8 stays"
    }]
  }
};
function ExploreScreen({
  tab,
  setTab
}) {
  const [style, setStyle] = React.useState("tent");
  const [count, setCount] = React.useState(STYLES.tent.count);
  const prevCount = React.useRef(STYLES.tent.count);
  const first = React.useRef(true);
  const subRef = React.useRef(null);
  const heroRef = React.useRef(null);
  const data = STYLES[style];
  const [openChip, setOpenChip] = React.useState(null);
  const [amenities, setAmenities] = React.useState(["Restrooms", "Drinking water"]);
  const [pets, setPets] = React.useState(true);
  const popRef = React.useRef(null);
  const AMENITIES = ["Restrooms", "Drinking water", "Fire pit", "Showers", "Pull-through", "Pet-friendly", "Shade", "Picnic table"];
  const STYLE_META = [{
    key: "rv",
    icon: "caravan",
    label: "RV",
    note: "Hookups & pull-through"
  }, {
    key: "tent",
    icon: "tent",
    label: "Tent",
    note: "Pitch your own tent"
  }, {
    key: "lodging",
    icon: "house",
    label: "Lodging",
    note: "Cabins & lodges"
  }];
  const toggleAmenity = a => setAmenities(xs => xs.includes(a) ? xs.filter(x => x !== a) : [...xs, a]);
  React.useEffect(() => {
    const g = window.gsap;
    if (g && popRef.current && openChip) {
      g.fromTo(popRef.current, {
        opacity: 0,
        y: -8,
        scale: 0.98
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.26,
        ease: "power3.out",
        transformOrigin: "top center"
      });
      const items = popRef.current.querySelectorAll("[data-pop-item]");
      if (items.length) g.fromTo(items, {
        opacity: 0,
        y: 8
      }, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.04,
        delay: 0.04,
        ease: "power2.out"
      });
    }
  }, [openChip]);
  React.useEffect(() => {
    const g = window.gsap;
    const target = STYLES[style].count;
    if (!g) {
      setCount(target);
      prevCount.current = target;
      first.current = false;
      return;
    }
    // count-up animation
    const obj = {
      v: prevCount.current
    };
    g.to(obj, {
      v: target,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => setCount(Math.round(obj.v)),
      onComplete: () => setCount(target)
    });
    prevCount.current = target;
    const safety = setTimeout(() => setCount(target), 750); // land correctly even if ticker is throttled
    if (first.current) {
      first.current = false;
      return;
    } // no reveal anim on first mount (stays visible)
    if (subRef.current) g.fromTo(subRef.current.children, {
      opacity: 0,
      y: 16
    }, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: "power3.out"
    });
    if (heroRef.current) g.fromTo(heroRef.current, {
      opacity: 0.25,
      scale: 1.05
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.55,
      ease: "power2.out"
    });
  }, [style]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppHeader, {
    logoSrc: ASSET + "/logo-mark.png",
    height: 56
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px 10px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      borderBottom: "1px solid var(--border-hairline)",
      position: "relative",
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    title: "Nearby",
    subtitle: "Add dates \xB7 Add guests"
  })), /*#__PURE__*/React.createElement(IconButton, {
    icon: "sliders-horizontal",
    ariaLabel: "Filters"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(FilterChip, {
    dropdown: true,
    selected: openChip === "style",
    onClick: () => setOpenChip(openChip === "style" ? null : "style")
  }, "Camping style"), /*#__PURE__*/React.createElement(FilterChip, {
    dropdown: true,
    selected: openChip === "amenities" || amenities.length > 0,
    onClick: () => setOpenChip(openChip === "amenities" ? null : "amenities")
  }, "Amenities", amenities.length > 0 ? ` · ${amenities.length}` : ""), /*#__PURE__*/React.createElement(FilterChip, {
    selected: pets,
    onClick: () => setPets(p => !p)
  }, "Pets allowed")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, count, " places \xB7 ", data.label), openChip && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpenChip(null),
    style: {
      position: "absolute",
      left: 0,
      top: "100%",
      width: "100%",
      height: 900,
      background: "rgba(26,26,26,0.12)",
      zIndex: 40
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: popRef,
    style: {
      position: "absolute",
      left: 16,
      right: 16,
      top: "100%",
      marginTop: 6,
      background: "var(--white)",
      border: "1px solid var(--border-hairline)",
      borderRadius: 16,
      boxShadow: "var(--shadow-float)",
      padding: 10,
      zIndex: 50,
      fontFamily: "var(--font-sans)"
    }
  }, openChip === "style" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    "data-pop-item": true,
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--ink-500)",
      textTransform: "uppercase",
      letterSpacing: ".04em",
      padding: "4px 8px 8px"
    }
  }, "Camping style"), STYLE_META.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.key,
    "data-pop-item": true,
    type: "button",
    onClick: () => {
      setStyle(m.key);
      setOpenChip(null);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      padding: "10px 8px",
      background: style === m.key ? "var(--brand-wash)" : "transparent",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: m.icon,
    size: 24,
    color: "var(--green-600)",
    strokeWidth: 1.9
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 15,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, m.label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 12,
      color: "var(--ink-500)"
    }
  }, m.note)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--green-500)"
    }
  }, STYLES[m.key].count), style === m.key && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18,
    color: "var(--brand)"
  })))), openChip === "amenities" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    "data-pop-item": true,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "4px 8px 8px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--ink-500)",
      textTransform: "uppercase",
      letterSpacing: ".04em"
    }
  }, "Amenities"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setAmenities([]),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--green-500)"
    }
  }, "Clear")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      padding: "0 4px 6px"
    }
  }, AMENITIES.map(a => {
    const on = amenities.includes(a);
    return /*#__PURE__*/React.createElement("button", {
      key: a,
      "data-pop-item": true,
      type: "button",
      onClick: () => toggleAmenity(a),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 34,
        padding: "0 12px",
        borderRadius: 999,
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: 600,
        color: on ? "var(--green-700)" : "var(--ink-700)",
        background: on ? "var(--brand-wash)" : "var(--white)",
        border: `1px solid ${on ? "var(--brand-vibrant)" : "var(--border-default)"}`
      }
    }, on && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14,
      color: "var(--brand)"
    }), a);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 4px 2px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    size: "md",
    onClick: () => setOpenChip(null)
  }, "Show ", count, " places")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: "14px 16px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: heroRef
  }, /*#__PURE__*/React.createElement(Photo, {
    h: 150,
    src: data.hero,
    scene: data.scene,
    tone: data.tone,
    label: data.label
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: "center",
      margin: "16px 0 12px",
      fontFamily: "var(--font-sans)",
      fontSize: 18,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, "Camping style"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(OptionRow, {
    icon: "caravan",
    title: "RV",
    subtitle: "find places that fit your rig",
    selected: style === "rv",
    onClick: () => setStyle("rv")
  }), /*#__PURE__*/React.createElement(OptionRow, {
    icon: "tent",
    title: "Tent",
    subtitle: "Pitch your own tent",
    selected: style === "tent",
    onClick: () => setStyle("tent")
  }), /*#__PURE__*/React.createElement(OptionRow, {
    icon: "house",
    title: "Lodging",
    subtitle: "Accommodations provided",
    selected: style === "lodging",
    onClick: () => setStyle("lodging")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "22px 0 12px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, data.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--green-500)"
    }
  }, data.options.length, " types")), /*#__PURE__*/React.createElement("div", {
    ref: subRef,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, data.options.map(o => /*#__PURE__*/React.createElement("div", {
    key: o.t,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 14px",
      background: "var(--white)",
      border: "1px solid var(--border-hairline)",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      borderRadius: 999,
      background: "var(--brand-wash)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: o.icon,
    size: 22,
    color: "var(--green-600)",
    strokeWidth: 1.9
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, o.t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--ink-500)"
    }
  }, o.s)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--green-500)",
      whiteSpace: "nowrap"
    }
  }, o.n))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 16px 12px",
      borderTop: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 700,
      color: "var(--ink-900)",
      cursor: "pointer"
    }
  }, "clear"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => setTab("trails")
  }, "show ", count, " places")));
}

/* ================= 3. TRAILS / MAP (real Leaflet map) ================= */
const STOPS = [{
  name: "Snowbowl Trailhead",
  type: "Trailhead",
  icon: "map-pin",
  pos: [35.3306, -111.7119],
  note: "Parking · restrooms"
}, {
  name: "Humphreys Trailhead",
  type: "Trailhead",
  icon: "map-pin",
  pos: [35.3313, -111.7108],
  note: "Parking · trail info"
}, {
  name: "Aspen Trail",
  type: "Trail",
  icon: "compass",
  pos: [35.3190, -111.6960],
  note: "1.8 mi loop · easy · shaded aspens"
}, {
  name: "Kachina Overlook",
  type: "Viewpoint",
  icon: "compass",
  pos: [35.3067, -111.6771],
  note: "Scenic overlook"
}, {
  name: "US-180 Rest Stop",
  type: "Highway rest stop",
  icon: "caravan",
  pos: [35.2760, -111.6640],
  note: "Restrooms · water · picnic tables"
}, {
  name: "Lockett Meadow Camp",
  type: "Campground",
  icon: "caravan",
  pos: [35.3560, -111.6230],
  note: "17 sites · vault toilets"
}, {
  name: "Fatman's Rest Bench",
  type: "Rest stop",
  icon: "tent",
  pos: [35.2408, -111.6045],
  note: "Shaded bench · viewpoint"
}];
function pinIcon(L, color, active) {
  const c = active ? "#349369" : "#ffffff";
  const glyph = active ? "#ffffff" : "#349369";
  return L.divIcon({
    className: "hiku-pin",
    html: `<div style="width:30px;height:30px;border-radius:999px;background:${c};border:1px solid ${active ? "#349369" : "#e0e0e0"};box-shadow:0 4px 16px rgba(26,26,26,.25);display:flex;align-items:center;justify-content:center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${glyph}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14]
  });
}
function wpIcon(L, label) {
  return L.divIcon({
    className: "hiku-wp",
    html: `<div style="width:28px;height:28px;border-radius:999px;background:#349369;border:2px solid #fff;box-shadow:0 3px 12px rgba(26,26,26,.35);display:flex;align-items:center;justify-content:center;color:#fff;font:700 13px/1 Satoshi,sans-serif;">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}
const ROUTE_PROFILES = {
  walking: {
    key: "walking",
    label: "Easy walk",
    brouter: "hiking-beta",
    kmh: 4.5
  },
  "hiking-mountain": {
    key: "hiking-mountain",
    label: "Mountain hike",
    brouter: "hiking-mountain",
    kmh: 3.2
  }
};
function TrailsScreen() {
  const mapEl = React.useRef(null);
  const mapRef = React.useRef(null);
  const layerRef = React.useRef(null);
  const routeRef = React.useRef(null);
  const wpsRef = React.useRef([]); // [{latlng, marker}]
  const profileRef = React.useRef("hiking-mountain");
  const [style, setStyle] = React.useState("topo");
  const [profile, setProfile] = React.useState("hiking-mountain");
  const [route, setRoute] = React.useState(null); // {dist, mins, approx} | null
  const [busy, setBusy] = React.useState(false);
  const TILES = {
    topo: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attr: "© CARTO · OSM",
      max: 19
    },
    street: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attr: "© CARTO · OSM",
      max: 19
    }
  };
  const drawRoute = async () => {
    const L = window.L,
      map = mapRef.current;
    if (!map || wpsRef.current.length < 2) return;
    const [a, b] = wpsRef.current;
    if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }
    const prof = ROUTE_PROFILES[profileRef.current];
    setBusy(true);
    setRoute(null);
    const straightKm = map.distance(a.latlng, b.latlng) / 1000;
    try {
      const url = `https://brouter.de/brouter?lonlats=${a.latlng.lng},${a.latlng.lat}|${b.latlng.lng},${b.latlng.lat}&profile=${prof.brouter}&alternativeidx=0&format=geojson`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("route");
      const gj = await res.json();
      const coords = gj.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
      const p = gj.features[0].properties || {};
      const km = (p["track-length"] ? +p["track-length"] : straightKm * 1000) / 1000;
      const mins = p["total-time"] ? Math.round(+p["total-time"] / 60) : Math.round(km / prof.kmh * 60);
      routeRef.current = L.layerGroup([L.polyline(coords, {
        color: "#ffffff",
        weight: 9,
        opacity: 0.9,
        lineCap: "round"
      }), L.polyline(coords, {
        color: "#349369",
        weight: 5,
        opacity: 1,
        lineCap: "round"
      })]).addTo(map);
      map.fitBounds(L.polyline(coords).getBounds().pad(0.25));
      setRoute({
        dist: km,
        mins,
        approx: false
      });
    } catch (e) {
      // fallback: straight dashed line so the app still shows a route
      routeRef.current = L.polyline([a.latlng, b.latlng], {
        color: "#349369",
        weight: 4,
        opacity: 0.9,
        dashArray: "2 10",
        lineCap: "round"
      }).addTo(map);
      setRoute({
        dist: straightKm,
        mins: Math.round(straightKm / prof.kmh * 60),
        approx: true
      });
    } finally {
      setBusy(false);
    }
  };
  const addWaypoint = latlng => {
    const L = window.L,
      map = mapRef.current;
    if (!map) return;
    if (wpsRef.current.length >= 2 || wpsRef.current.length === 0) {
      // start fresh
      clearRoute();
      const m = L.marker(latlng, {
        icon: wpIcon(L, "A")
      }).addTo(map);
      wpsRef.current = [{
        latlng,
        marker: m
      }];
    } else {
      const m = L.marker(latlng, {
        icon: wpIcon(L, "B")
      }).addTo(map);
      wpsRef.current.push({
        latlng,
        marker: m
      });
      drawRoute();
    }
  };
  const clearRoute = () => {
    const map = mapRef.current;
    if (!map) return;
    if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }
    wpsRef.current.forEach(w => map.removeLayer(w.marker));
    wpsRef.current = [];
    setRoute(null);
  };
  React.useEffect(() => {
    const L = window.L;
    if (!L || !mapEl.current) return;
    const map = L.map(mapEl.current, {
      zoomControl: false,
      attributionControl: true
    }).setView([35.30, -111.66], 12);
    mapRef.current = map;
    layerRef.current = L.tileLayer(TILES.topo.url, {
      maxZoom: TILES.topo.max,
      attribution: TILES.topo.attr,
      subdomains: "abcd"
    }).addTo(map);
    STOPS.forEach(s => {
      L.marker(s.pos, {
        icon: pinIcon(L, s.color, false)
      }).addTo(map).bindTooltip(s.name, {
        permanent: true,
        direction: "right",
        offset: [12, 0],
        className: "hiku-label"
      }).bindPopup(`<b style="font-size:14px;color:#1a1a1a">${s.name}</b><br><span style="color:#349369;font-size:11px;font-weight:600">${s.type}</span><br><span style="color:#717171;font-size:12px">${s.note}</span><br><span style="color:#349369;font-size:11px;font-weight:700">Tap the map to route here</span>`).on("click", ev => {
        addWaypoint(L.latLng(s.pos[0], s.pos[1]));
        ev.target.openPopup();
      });
    });
    map.on("click", e => addWaypoint(e.latlng));
    const grp = L.featureGroup(STOPS.map(s => L.marker(s.pos)));
    map.fitBounds(grp.getBounds().pad(0.3));
    const t = setTimeout(() => map.invalidateSize(), 260);
    return () => {
      clearTimeout(t);
      map.remove();
      mapRef.current = null;
    };
  }, []);
  const setProf = key => {
    setProfile(key);
    profileRef.current = key;
    if (wpsRef.current.length === 2) drawRoute(); // re-route with new profile
  };
  const toggleLayer = () => {
    const next = style === "topo" ? "street" : "topo";
    setStyle(next);
    const map = mapRef.current,
      L = window.L;
    if (map && layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = L.tileLayer(TILES[next].url, {
        maxZoom: TILES[next].max,
        attribution: TILES[next].attr,
        subdomains: "abcd"
      }).addTo(map);
    }
  };
  const locate = () => {
    const map = mapRef.current;
    if (map) map.locate({
      setView: true,
      maxZoom: 14
    });
  };
  const mi = km => (km * 0.621371).toFixed(1);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppHeader, {
    logoSrc: ASSET + "/logo-mark.png",
    height: 56
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px 10px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    title: "Flagstaff, AZ",
    subtitle: "Tap to route a hike"
  })), /*#__PURE__*/React.createElement(IconButton, {
    icon: "sliders-horizontal",
    ariaLabel: "Filters"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      background: "var(--surface-sunken)",
      borderRadius: 999,
      padding: 4
    }
  }, Object.values(ROUTE_PROFILES).map(p => /*#__PURE__*/React.createElement("button", {
    key: p.key,
    type: "button",
    onClick: () => setProf(p.key),
    style: {
      flex: 1,
      height: 30,
      borderRadius: 999,
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      background: profile === p.key ? "var(--green-500)" : "transparent",
      color: profile === p.key ? "#fff" : "var(--ink-700)",
      transition: "background 160ms"
    }
  }, p.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      background: "var(--map-bg)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: mapEl,
    className: "hiku-map hiku-map-" + style,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 16,
      top: 16,
      zIndex: 500
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "layers",
    shape: "round",
    variant: "float",
    ariaLabel: "Toggle map layer",
    active: style === "street",
    onClick: toggleLayer
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 16,
      bottom: 16,
      zIndex: 500
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "navigation",
    shape: "round",
    variant: "float",
    ariaLabel: "Locate me",
    onClick: locate
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 12,
      right: 68,
      bottom: 12,
      zIndex: 500,
      background: "rgba(255,255,255,0.96)",
      borderRadius: 12,
      padding: "10px 12px",
      boxShadow: "var(--shadow-card)",
      fontFamily: "var(--font-sans)"
    }
  }, route ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, mi(route.dist), " mi \xB7 ", route.mins, " min"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-500)"
    }
  }, ROUTE_PROFILES[profile].label, route.approx ? " · straight-line estimate" : " · on-trail route")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: clearRoute,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      border: "1px solid var(--border-default)",
      background: "#fff",
      borderRadius: 999,
      padding: "6px 12px",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--ink-700)",
      cursor: "pointer"
    }
  }, "Clear")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: busy ? "compass" : "map-pin",
    size: 18,
    color: "var(--brand)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--ink-700)"
    }
  }, busy ? "Finding your trail…" : "Tap a start point, then a destination")))));
}

/* ================= 4. REGISTER ================= */
function RegisterScreen({
  setTab
}) {
  const [done, setDone] = React.useState(false);
  const cardRef = React.useRef(null);
  const fireConfetti = () => {
    const c = window.__hikuConfetti;
    if (!c) return;
    c({
      particleCount: 90,
      spread: 70,
      startVelocity: 42,
      origin: {
        y: 0.7
      }
    });
    setTimeout(() => c({
      particleCount: 55,
      angle: 60,
      spread: 55,
      origin: {
        x: 0,
        y: 0.75
      }
    }), 120);
    setTimeout(() => c({
      particleCount: 55,
      angle: 120,
      spread: 55,
      origin: {
        x: 1,
        y: 0.75
      }
    }), 120);
  };
  const register = () => {
    setDone(true);
    fireConfetti();
    const g = window.gsap;
    if (g && cardRef.current) {
      g.fromTo(cardRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.55,
        ease: "back.out(1.7)"
      });
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: 168
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    h: 168,
    r: 0,
    src: PHOTOS.group,
    scene: "forest",
    tone: "deep"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      left: 12,
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "arrow-left",
    shape: "round",
    variant: "float",
    ariaLabel: "Back",
    onClick: () => setTab("community")
  }))), done ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 76,
      height: 76,
      borderRadius: 999,
      background: "var(--brand-wash)",
      border: "2px solid var(--brand-vibrant)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 38,
    color: "var(--green-500)",
    strokeWidth: 2.6
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 22,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, "You're registered!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      lineHeight: 1.5,
      color: "var(--ink-500)",
      maxWidth: 260
    }
  }, "Welcome to the ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--green-600)"
    }
  }, "ASU Outdoors Club"), ". Check your email for your first trip invite."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: fireConfetti
  }, "Celebrate \uD83C\uDF89"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => setTab("community")
  }, "Done")))) : /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "16px 16px 0",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "2px 0 4px",
      fontFamily: "var(--font-sans)",
      fontSize: 18,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, "ASU Outdoors Club"), /*#__PURE__*/React.createElement(Input, {
    defaultValue: "Jaden Smith"
  }), /*#__PURE__*/React.createElement(Input, {
    type: "email",
    defaultValue: "jsmith1@asu.edu"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      paddingBottom: 16,
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "vibrant",
    onClick: register
  }, "Register"))));
}

/* ================= 5. SHOP ================= */
const PRODUCTS = [{
  id: "tent2p",
  name: "Trail Tent 2P",
  price: 189,
  scene: "tent",
  photo: PHOTOS.gearTent,
  cat: "Shelter",
  rating: 4.9,
  blurb: "Freestanding 2-person tent, 2.4kg packed. Weatherproof to 3-season storms.",
  specs: ["2.4 kg", "3-season", "Sleeps 2"]
}, {
  id: "pack45",
  name: "Alpine Pack 45L",
  price: 140,
  scene: "forest",
  photo: PHOTOS.pack,
  cat: "Packs",
  rating: 4.8,
  blurb: "45L internal-frame pack with vented back panel and rain cover included.",
  specs: ["45 L", "1.3 kg", "Rain cover"]
}, {
  id: "stove",
  name: "Camp Stove",
  price: 65,
  scene: "campfire",
  photo: PHOTOS.stove,
  cat: "Cooking",
  rating: 4.7,
  blurb: "Compact canister stove, boils 1L in 3.5 min. Piezo ignition.",
  specs: ["104 g", "3.5 min/L", "Piezo"]
}, {
  id: "boots",
  name: "Trek Boots",
  price: 120,
  scene: "trail",
  photo: PHOTOS.boots,
  cat: "Footwear",
  rating: 4.6,
  blurb: "Waterproof mid boots with Vibram outsole and cushioned midsole.",
  specs: ["Waterproof", "Vibram", "Unisex"]
}, {
  id: "bag",
  name: "Down Bag −5°",
  price: 210,
  scene: "tent",
  photo: PHOTOS.bag,
  cat: "Sleep",
  rating: 4.9,
  blurb: "650-fill down mummy bag rated to −5°C. Packs to 6L.",
  specs: ["−5 °C", "650 fill", "900 g"]
}, {
  id: "bottle",
  name: "Water Bottle",
  price: 32,
  scene: "mountains",
  photo: PHOTOS.bottle,
  cat: "Hydration",
  rating: 4.5,
  blurb: "Insulated 750ml bottle, keeps cold 24h. Leakproof cap.",
  specs: ["750 ml", "24h cold", "Leakproof"]
}];
function ShopViewWrap({
  viewKey,
  dir,
  children
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const g = window.gsap,
      el = ref.current;
    if (!g || !el) return;
    const x = dir === "back" ? -26 : 26;
    g.killTweensOf(el);
    g.fromTo(el, {
      opacity: 0,
      x
    }, {
      opacity: 1,
      x: 0,
      duration: 0.34,
      ease: "power3.out",
      clearProps: "transform,opacity"
    });
    const items = el.querySelectorAll("[data-shop-stagger]");
    if (items.length) g.fromTo(items, {
      opacity: 0,
      y: 14
    }, {
      opacity: 1,
      y: 0,
      duration: 0.36,
      stagger: 0.05,
      delay: 0.05,
      ease: "power2.out",
      clearProps: "transform,opacity"
    });
    const safety = setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "none";
      items.forEach(n => {
        n.style.opacity = "1";
        n.style.transform = "none";
      });
    }, 700);
    return () => clearTimeout(safety);
  }, [viewKey]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: 0
    }
  }, children);
}
function ShopScreen2() {
  const [view, setView] = React.useState("grid"); // grid | detail | cart | success
  const [sel, setSel] = React.useState(null);
  const [cart, setCart] = React.useState([]);
  const [saved, setSaved] = React.useState({});
  const bumpRef = React.useRef(null);
  const dirRef = React.useRef("fwd");
  const ORDER = {
    grid: 0,
    detail: 1,
    cart: 2,
    success: 3
  };
  const nav = next => {
    dirRef.current = ORDER[next] < ORDER[view] ? "back" : "fwd";
    setView(next);
  };
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const total = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const addToCart = (p, qty = 1) => {
    setCart(c => {
      const ex = c.find(i => i.id === p.id);
      if (ex) return c.map(i => i.id === p.id ? {
        ...i,
        qty: i.qty + qty
      } : i);
      return [...c, {
        ...p,
        qty
      }];
    });
    const g = window.gsap;
    if (g && bumpRef.current) g.fromTo(bumpRef.current, {
      scale: 0.6
    }, {
      scale: 1,
      duration: 0.4,
      ease: "back.out(2.5)"
    });
  };
  const setQty = (id, d) => setCart(c => c.map(i => i.id === id ? {
    ...i,
    qty: Math.max(1, i.qty + d)
  } : i));
  const remove = id => setCart(c => c.filter(i => i.id !== id));
  const openP = p => {
    setSel(p);
    nav("detail");
  };
  const Header = ({
    title,
    back
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 16px 10px",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, back && /*#__PURE__*/React.createElement(IconButton, {
    icon: "arrow-left",
    shape: "round",
    variant: "plain",
    ariaLabel: "Back",
    onClick: back
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--font-sans)",
      fontSize: 18,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    ref: bumpRef,
    style: {
      position: "relative",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "shopping-bag",
    shape: "round",
    variant: "outline",
    ariaLabel: "Cart",
    onClick: () => nav("cart")
  }), count > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -4,
      right: -4,
      minWidth: 18,
      height: 18,
      padding: "0 5px",
      borderRadius: 999,
      background: "var(--green-500)",
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, count)));
  if (view === "grid") {
    return /*#__PURE__*/React.createElement(ShopViewWrap, {
      viewKey: "grid",
      dir: dirRef.current
    }, /*#__PURE__*/React.createElement(AppHeader, {
      logoSrc: ASSET + "/logo-mark.png",
      height: 56
    }), /*#__PURE__*/React.createElement(Header, {
      title: "Shop gear"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "10px 16px 0"
      }
    }, /*#__PURE__*/React.createElement(SearchBar, {
      title: "Shop gear",
      subtitle: "Tents \xB7 Packs \xB7 Boots"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "14px 16px 16px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16
      }
    }, PRODUCTS.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      "data-shop-stagger": true,
      onClick: () => openP(p),
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
        cursor: "pointer",
        fontFamily: "var(--font-sans)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Photo, {
      h: 110,
      src: p.photo,
      scene: p.scene
    }), /*#__PURE__*/React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        setSaved(s => ({
          ...s,
          [p.id]: !s[p.id]
        }));
      },
      "aria-label": "Save",
      style: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 30,
        height: 30,
        borderRadius: 999,
        border: "none",
        background: "rgba(255,255,255,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "var(--shadow-sm)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "heart",
      size: 16,
      color: saved[p.id] ? "var(--brand)" : "var(--ink-700)",
      style: {
        fill: saved[p.id] ? "var(--brand)" : "none"
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: "var(--ink-500)"
      }
    }, p.cat), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: "var(--ink-900)",
        lineHeight: 1.2
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: "var(--green-500)"
      }
    }, "$", p.price), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        fontSize: 12,
        fontWeight: 600,
        color: "var(--ink-700)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 12,
      color: "var(--ink-900)",
      style: {
        fill: "var(--ink-900)"
      }
    }), p.rating)))))));
  }
  if (view === "detail" && sel) {
    const inCart = cart.find(i => i.id === sel.id);
    return /*#__PURE__*/React.createElement(ShopViewWrap, {
      viewKey: "detail-" + sel.id,
      dir: dirRef.current
    }, /*#__PURE__*/React.createElement(Header, {
      title: sel.cat,
      back: () => nav("grid")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      "data-shop-stagger": true,
      style: {
        padding: 16
      }
    }, /*#__PURE__*/React.createElement(Photo, {
      h: 220,
      src: sel.photo,
      scene: sel.scene
    })), /*#__PURE__*/React.createElement("div", {
      "data-shop-stagger": true,
      style: {
        padding: "0 18px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: "var(--font-sans)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        color: "var(--ink-900)"
      }
    }, sel.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 22,
        fontWeight: 700,
        color: "var(--green-500)",
        whiteSpace: "nowrap"
      }
    }, "$", sel.price)), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 13,
        fontWeight: 600,
        color: "var(--ink-700)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "star",
      size: 14,
      color: "var(--ink-900)",
      style: {
        fill: "var(--ink-900)"
      }
    }), sel.rating, " \xB7 ", sel.cat), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 14,
        lineHeight: 1.55,
        color: "var(--text-secondary)"
      }
    }, sel.blurb), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8
      }
    }, sel.specs.map(s => /*#__PURE__*/React.createElement("span", {
      key: s,
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: "var(--green-700)",
        background: "var(--brand-wash)",
        border: "1px solid var(--brand-soft)",
        borderRadius: 999,
        padding: "5px 12px"
      }
    }, s))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: "10px 16px 14px",
        borderTop: "1px solid var(--border-hairline)"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => addToCart(sel)
    }, inCart ? `In cart · ${inCart.qty}` : "Add to cart"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      fullWidth: true,
      onClick: () => {
        addToCart(sel);
        nav("cart");
      }
    }, "Buy now \xB7 $", sel.price)));
  }
  if (view === "cart") {
    return /*#__PURE__*/React.createElement(ShopViewWrap, {
      viewKey: "cart-" + cart.length,
      dir: dirRef.current
    }, /*#__PURE__*/React.createElement(Header, {
      title: "Your cart",
      back: () => nav("grid")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: "var(--font-sans)"
      }
    }, cart.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        color: "var(--ink-500)",
        padding: "40px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shopping-bag",
      size: 40,
      color: "var(--green-300)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15
      }
    }, "Your cart is empty"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => nav("grid")
    }, "Browse gear")), cart.map(i => /*#__PURE__*/React.createElement("div", {
      key: i.id,
      "data-shop-stagger": true,
      style: {
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: 10,
        background: "var(--white)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-md)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 64,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Photo, {
      h: 64,
      src: i.photo,
      scene: i.scene,
      r: 10
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: "var(--ink-900)"
      }
    }, i.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: "var(--green-500)"
      }
    }, "$", i.price), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setQty(i.id, -1),
      "aria-label": "Less",
      style: qtyBtn
    }, "\u2212"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        minWidth: 16,
        textAlign: "center"
      }
    }, i.qty), /*#__PURE__*/React.createElement("button", {
      onClick: () => setQty(i.id, 1),
      "aria-label": "More",
      style: qtyBtn
    }, "+"), /*#__PURE__*/React.createElement("button", {
      onClick: () => remove(i.id),
      style: {
        marginLeft: "auto",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        fontWeight: 600,
        color: "var(--ink-500)"
      }
    }, "Remove"))))), cart.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        padding: "12px 14px",
        background: "var(--brand-wash)",
        borderRadius: "var(--radius-md)"
      }
    }, /*#__PURE__*/React.createElement(ShopRow, {
      k: "Subtotal",
      v: `$${total}`
    }), /*#__PURE__*/React.createElement(ShopRow, {
      k: "Shipping",
      v: "Free"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: "var(--brand-soft)",
        margin: "8px 0"
      }
    }), /*#__PURE__*/React.createElement(ShopRow, {
      k: "Total",
      v: `$${total}`,
      bold: true
    }))), cart.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "10px 16px 14px",
        borderTop: "1px solid var(--border-hairline)"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      fullWidth: true,
      onClick: () => {
        nav("success");
        setTimeout(() => window.__hikuConfetti && window.__hikuConfetti({
          particleCount: 90,
          spread: 70,
          origin: {
            y: 0.7
          }
        }), 150);
      }
    }, "Checkout \xB7 $", total)));
  }
  return /*#__PURE__*/React.createElement(ShopViewWrap, {
    viewKey: "success",
    dir: dirRef.current
  }, /*#__PURE__*/React.createElement(AppHeader, {
    logoSrc: ASSET + "/logo-mark.png",
    height: 56
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      textAlign: "center",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-shop-stagger": true,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 76,
      height: 76,
      borderRadius: 999,
      background: "var(--brand-wash)",
      border: "2px solid var(--brand-vibrant)",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 38,
    color: "var(--green-500)",
    strokeWidth: 2.6
  })), /*#__PURE__*/React.createElement("h2", {
    "data-shop-stagger": true,
    style: {
      margin: "0 0 8px",
      fontSize: 22,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, "Order placed!"), /*#__PURE__*/React.createElement("p", {
    "data-shop-stagger": true,
    style: {
      margin: "0 0 20px",
      fontSize: 14,
      lineHeight: 1.5,
      color: "var(--ink-500)",
      maxWidth: 260
    }
  }, "Your gear is on the way. We'll email tracking to jsmith1@asu.edu."), /*#__PURE__*/React.createElement("div", {
    "data-shop-stagger": true
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => {
      setCart([]);
      nav("grid");
    }
  }, "Keep shopping"))));
}
const qtyBtn = {
  width: 26,
  height: 26,
  borderRadius: 999,
  border: "1px solid var(--border-default)",
  background: "var(--white)",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
  fontSize: 16,
  fontWeight: 700,
  color: "var(--ink-900)",
  lineHeight: 1
};
function ShopRow({
  k,
  v,
  bold
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "2px 0",
      fontFamily: "var(--font-sans)",
      fontSize: bold ? 16 : 13,
      fontWeight: bold ? 700 : 500,
      color: bold ? "var(--ink-900)" : "var(--ink-700)"
    }
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", null, v));
}

/* ================= 6. COMMUNITY ================= */
const CLUBS = [{
  id: "asu",
  title: "ASU Outdoors Club",
  members: 412,
  image: PHOTOS.group,
  tags: ["Hiking", "Camping", "Gear swaps"],
  description: "Weekend hikes, gear swaps and trail cleanups across northern Arizona. We run beginner-friendly trips every Saturday plus monthly backpacking overnights. Open to all skill levels — borrow gear from the club library for your first trip."
}, {
  id: "sedona",
  title: "Sedona Trail Runners",
  members: 128,
  image: PHOTOS.trail,
  tags: ["Trail running", "Sunrise"],
  description: "Sunrise trail runs on the red-rock singletrack around Sedona. Two paces every run so nobody gets dropped, coffee after at the trailhead. Weekly Tuesday and Saturday meetups, all abilities welcome."
}, {
  id: "night",
  title: "Desert Night Hikers",
  members: 87,
  image: PHOTOS.camp,
  tags: ["Night hikes", "Stargazing"],
  description: "Full-moon and new-moon desert hikes with stargazing stops. We cover headlamp basics, desert safety and Leave No Trace. Bring water — we bring the telescope."
}];
function ExpandableClub({
  club,
  open,
  onToggle,
  onJoin
}) {
  const bodyRef = React.useRef(null);
  const chevRef = React.useRef(null);
  const first = React.useRef(true);
  const [joined, setJoined] = React.useState(false);
  React.useEffect(() => {
    const body = bodyRef.current,
      chev = chevRef.current,
      g = window.gsap;
    if (!body) return;
    if (!g) {
      body.style.height = open ? "auto" : "0px";
      return;
    } // graceful fallback
    if (first.current) {
      // no animation on initial mount
      body.style.height = open ? "auto" : "0px";
      first.current = false;
      return;
    }
    g.killTweensOf(body);
    if (open) {
      body.style.height = "auto";
      const h = body.offsetHeight;
      g.fromTo(body, {
        height: 0
      }, {
        height: h,
        duration: 0.42,
        ease: "power3.out",
        onComplete: () => {
          body.style.height = "auto";
        }
      });
      g.fromTo(body.children, {
        opacity: 0,
        y: 12
      }, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06,
        delay: 0.08,
        ease: "power2.out"
      });
      if (chev) g.to(chev, {
        rotate: 180,
        duration: 0.4,
        ease: "power2.out"
      });
    } else {
      g.to(body, {
        height: 0,
        duration: 0.34,
        ease: "power3.inOut"
      });
      if (chev) g.to(chev, {
        rotate: 0,
        duration: 0.34,
        ease: "power2.inOut"
      });
    }
  }, [open]);
  return /*#__PURE__*/React.createElement("article", {
    style: {
      background: "var(--surface-card)",
      border: `1px solid ${open ? "var(--brand-vibrant)" : "var(--border-hairline)"}`,
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      boxShadow: "var(--shadow-card)",
      fontFamily: "var(--font-sans)",
      flexShrink: 0,
      transition: "border-color 200ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "button",
    onClick: onToggle,
    style: {
      display: "block",
      width: "100%",
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: 104,
      background: club.image ? `center/cover no-repeat url(${club.image})` : "var(--green-100)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 12,
      bottom: 10,
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: 17,
      textShadow: "0 1px 6px rgba(0,0,0,.45)"
    }
  }, club.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "var(--space-5)",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 13,
      fontWeight: 500,
      color: "var(--ink-500)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 14,
    color: "var(--ink-500)"
  }), club.members, " members"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    ref: chevRef,
    style: {
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 20,
    color: "var(--brand)",
    strokeWidth: 2.4
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: bodyRef,
    style: {
      height: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--space-5) var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 10px",
      fontSize: 14,
      lineHeight: 1.5,
      color: "var(--text-secondary)"
    }
  }, club.description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 14
    }
  }, club.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "var(--green-700)",
      background: "var(--brand-wash)",
      border: "1px solid var(--brand-soft)",
      borderRadius: 999,
      padding: "3px 10px"
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: joined ? "secondary" : "vibrant",
    fullWidth: true,
    onClick: () => setJoined(j => !j)
  }, joined ? "Joined ✓" : "Join"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: () => onJoin(club)
  }, "Register")))));
}
function CommunityScreen({
  setTab
}) {
  const [open, setOpen] = React.useState("asu");
  const listRef = React.useRef(null);
  React.useEffect(() => {
    const g = window.gsap;
    if (g && listRef.current) {
      // slide-only entrance (no opacity) so content is never left hidden if paused
      g.fromTo(listRef.current.children, {
        y: 16
      }, {
        y: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: "power3.out"
      });
    }
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppHeader, {
    logoSrc: ASSET + "/logo-mark.png",
    height: 56
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px 10px",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    title: "Find clubs",
    subtitle: "Near Tempe, AZ"
  })), /*#__PURE__*/React.createElement("div", {
    ref: listRef,
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: "14px 16px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, CLUBS.map(club => /*#__PURE__*/React.createElement(ExpandableClub, {
    key: club.id,
    club: club,
    open: open === club.id,
    onToggle: () => setOpen(open === club.id ? null : club.id),
    onJoin: () => setTab("register")
  }))));
}

/* ================= APP SHELL ================= */
/* Entrance via a CSS transition (not keyframes). Content is opaque at every
   frame — worst case (throttled/never-settled) it just sits slightly offset
   and at 55% opacity, never blank. */
function ScreenAnim({
  animKey,
  children
}) {
  const ref = React.useRef(null);
  const [enter, setEnter] = React.useState(false);
  React.useEffect(() => {
    setEnter(false);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEnter(true)));
    const t = setTimeout(() => setEnter(true), 80);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [animKey]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: 0,
      opacity: enter ? 1 : 0.55,
      transform: enter ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)"
    }
  }, children);
}
function PhoneFrame({
  children
}) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const el = canvasRef.current;
    if (el && window.confetti && window.confetti.create) {
      const inst = window.confetti.create(el, {
        resize: true,
        useWorker: false
      });
      window.__hikuConfetti = opts => inst(Object.assign({
        colors: ["#8dcaaf", "#4fb889", "#349369", "#216044", "#ffffff"],
        disableForReducedMotion: true
      }, opts));
    }
    return () => {
      window.__hikuConfetti = null;
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "min(390px, 92vw)",
      height: "min(800px, 86vh)",
      aspectRatio: "390 / 800",
      background: "#000",
      borderRadius: 46,
      padding: 10,
      boxSizing: "border-box",
      boxShadow: "0 30px 80px rgba(0,0,0,0.35)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      background: "var(--white)",
      borderRadius: 38,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 130,
      height: 26,
      background: "#000",
      borderRadius: "0 0 16px 16px",
      zIndex: 30
    }
  }), children, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 60
    }
  })));
}
function App() {
  const [tab, setTab] = React.useState("explore");
  const [started, setStarted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const go = t => {
    if (t === "explore") {
      setLoading(true);
      return;
    } // play loader before entering the app
    setStarted(true);
    setTab(t);
  };
  React.useEffect(() => {
    window.__hikuJump = id => {
      if (id === "splash") {
        setStarted(false);
        setLoading(false);
        setTab("explore");
      } else if (id === "loading") {
        setStarted(false);
        setLoading(true);
      } else {
        setLoading(false);
        setStarted(true);
        setTab(id);
      }
    };
  }, []);
  let screen, animKey;
  if (loading) {
    screen = /*#__PURE__*/React.createElement(LoadingScreen, {
      onDone: () => {
        setLoading(false);
        setStarted(true);
        setTab("explore");
      }
    });
    animKey = "loading";
  } else if (!started) {
    screen = /*#__PURE__*/React.createElement(SplashScreen, {
      go: go
    });
    animKey = "splash";
  } else if (tab === "explore") {
    screen = /*#__PURE__*/React.createElement(ExploreScreen, {
      tab: tab,
      setTab: setTab
    });
    animKey = "explore";
  } else if (tab === "trails") {
    screen = /*#__PURE__*/React.createElement(TrailsScreen, null);
    animKey = "trails";
  } else if (tab === "community") {
    screen = /*#__PURE__*/React.createElement(CommunityScreen, {
      setTab: setTab
    });
    animKey = "community";
  } else if (tab === "register") {
    screen = /*#__PURE__*/React.createElement(RegisterScreen, {
      setTab: setTab
    });
    animKey = "register";
  } else if (tab === "shop") {
    screen = /*#__PURE__*/React.createElement(ShopScreen2, null);
    animKey = "shop";
  } else if (tab === "account") {
    screen = /*#__PURE__*/React.createElement(AccountScreen, null);
    animKey = "account";
  }
  const showNav = started && !loading;
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement(ScreenAnim, {
    animKey: animKey
  }, screen), showNav && tab !== "register" && /*#__PURE__*/React.createElement(BottomNav, {
    active: tab === "explore" ? "explore" : tab,
    onChange: setTab
  }), showNav && tab === "register" && /*#__PURE__*/React.createElement(BottomNav, {
    active: "community",
    onChange: setTab
  }));
}

/* ================= ACCOUNT (bonus) ================= */
function AccountScreen() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppHeader, {
    logoSrc: ASSET + "/logo-mark.png",
    height: 56
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Jaden Smith",
    size: 64,
    ring: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 18,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, "Jaden Smith"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: "var(--ink-500)"
    }
  }, "jsmith1@asu.edu"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(OptionRow, {
    icon: "map-pin",
    title: "Saved trails",
    subtitle: "12 places"
  }), /*#__PURE__*/React.createElement(OptionRow, {
    icon: "shopping-bag",
    title: "Orders",
    subtitle: "2 in transit"
  }), /*#__PURE__*/React.createElement(OptionRow, {
    icon: "globe",
    title: "My clubs",
    subtitle: "ASU Outdoors Club"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true
  }, "Sign out")));
}
window.__HikuApp = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/hiku-app/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.BottomNav = __ds_scope.BottomNav;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CommunityCard = __ds_scope.CommunityCard;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Illustration = __ds_scope.Illustration;

__ds_ns.ILLUSTRATION_SCENES = __ds_scope.ILLUSTRATION_SCENES;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.MapMarker = __ds_scope.MapMarker;

__ds_ns.OptionRow = __ds_scope.OptionRow;

__ds_ns.PlaceCard = __ds_scope.PlaceCard;

__ds_ns.SearchBar = __ds_scope.SearchBar;

})();

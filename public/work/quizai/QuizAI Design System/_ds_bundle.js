/* @ds-bundle: {"format":4,"namespace":"QuizAIDesignSystem_ab923d","components":[{"name":"BrainMark","sourcePath":"components/brand/BrainMark.jsx"},{"name":"Logo","sourcePath":"components/brand/BrainMark.jsx"},{"name":"Card","sourcePath":"components/cards/Card.jsx"},{"name":"QuizHistoryItem","sourcePath":"components/cards/QuizHistoryItem.jsx"},{"name":"StatTile","sourcePath":"components/cards/StatTile.jsx"},{"name":"SummaryCard","sourcePath":"components/cards/SummaryCard.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"NavBar","sourcePath":"components/core/NavBar.jsx"}],"sourceHashes":{"components/brand/BrainMark.jsx":"c29361905533","components/cards/Card.jsx":"d3d0342dc1f0","components/cards/QuizHistoryItem.jsx":"4f8057a3bd10","components/cards/StatTile.jsx":"d4945ee5c892","components/cards/SummaryCard.jsx":"022c6f3e1c98","components/core/Avatar.jsx":"43523f8d5612","components/core/Badge.jsx":"4859f6f1ec01","components/core/Button.jsx":"7c48c6282410","components/core/Input.jsx":"de2d2544e7fc","components/core/NavBar.jsx":"219fb74f3549","ui_kits/quizai-app/App.jsx":"4177ba817828","ui_kits/quizai-app/DashboardScreen.jsx":"1c3e98d82c4b","ui_kits/quizai-app/LoginScreen.jsx":"61a69442fda8","ui_kits/quizai-app/SummariesScreen.jsx":"59ac631a09fc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.QuizAIDesignSystem_ab923d = window.QuizAIDesignSystem_ab923d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/BrainMark.jsx
try { (() => {
function BrainMark({
  size = 24
}) {
  return /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-brain",
    "aria-hidden": "true",
    style: {
      fontSize: size,
      color: "var(--brand-primary)"
    }
  });
}
function Logo({
  size = 20
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px"
    }
  }, /*#__PURE__*/React.createElement(BrainMark, {
    size: size
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-h3)",
      color: "var(--brand-primary)"
    }
  }, "QuizAI"));
}
Object.assign(__ds_scope, { BrainMark, Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/BrainMark.jsx", error: String((e && e.message) || e) }); }

// components/cards/Card.jsx
try { (() => {
function Card({
  tint = "neutral",
  interactive = false,
  children,
  style
}) {
  const tints = {
    neutral: {
      background: "var(--white)",
      borderColor: "var(--hairline)"
    },
    maroon: {
      background: "var(--surface-maroon-tint)",
      borderColor: "var(--border-maroon-tint)"
    },
    gold: {
      background: "var(--surface-gold-tint)",
      borderColor: "var(--border-gold-tint)"
    },
    white: {
      background: "var(--white)",
      borderColor: "var(--hairline)"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "var(--border-width) solid",
      ...tints[tint],
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-5)",
      boxShadow: "var(--shadow-card)",
      transition: "transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard)",
      cursor: interactive ? "pointer" : "default",
      ...style
    },
    onMouseEnter: e => {
      if (interactive) {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "var(--shadow-raised)";
      }
    },
    onMouseLeave: e => {
      if (interactive) {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
      }
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/Card.jsx", error: String((e && e.message) || e) }); }

// components/cards/StatTile.jsx
try { (() => {
function StatTile({
  icon,
  value,
  label,
  sublabel,
  tint = "neutral"
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    tint: tint,
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "8px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      color: "var(--gray-3)",
      fontSize: "15px"
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-h1)",
      letterSpacing: "var(--ls-tight)",
      color: "var(--gray-1)"
    }
  }, value)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body)",
      fontWeight: "var(--fw-semibold)",
      letterSpacing: "var(--ls-snug)",
      color: "var(--gray-1)"
    }
  }, label), sublabel ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-small)",
      color: "var(--gray-3)"
    }
  }, sublabel) : null);
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function Avatar({
  initials = "LT",
  size = 32
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: "var(--radius-round)",
      background: "var(--surface-maroon-tint)",
      color: "var(--brand-primary)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      font: "var(--text-label)",
      fontSize: size * 0.4,
      flexShrink: 0
    }
  }, initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = "neutral",
  children
}) {
  const tones = {
    neutral: {
      background: "var(--surface-chip)",
      color: "var(--gray-2)",
      fontWeight: "var(--fw-regular)"
    },
    gold: {
      background: "var(--accent-badge-bg)",
      color: "var(--accent-badge-text)"
    },
    success: {
      background: "var(--success-bg)",
      color: "var(--success)"
    },
    danger: {
      background: "var(--danger-bg)",
      color: "var(--danger)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      ...tones[tone],
      font: "var(--text-label)",
      letterSpacing: "var(--ls-snug)",
      padding: "5px 12px",
      borderRadius: "var(--radius-sm)",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      whiteSpace: "nowrap",
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  icon,
  children,
  onClick,
  type = "button",
  fullWidth
}) {
  const base = {
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--fw-semibold)",
    fontSize: size === "sm" ? "var(--fs-sm)" : "var(--fs-base)",
    padding: size === "sm" ? "8px 16px" : "12px 20px",
    borderRadius: "var(--radius-md)",
    border: "var(--border-width) solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    whiteSpace: "nowrap",
    width: fullWidth === false ? "auto" : "100%",
    transition: "background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)"
  };
  const variants = {
    primary: {
      background: "var(--brand-primary)",
      color: "var(--white)",
      borderColor: "var(--brand-primary)"
    },
    secondary: {
      background: "var(--white)",
      color: "var(--brand-primary)",
      borderColor: "var(--brand-primary)"
    },
    ghost: {
      background: "transparent",
      color: "var(--brand-primary)",
      borderColor: "transparent"
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant]
    },
    onMouseEnter: e => {
      if (!disabled && variant === "primary") e.currentTarget.style.background = "var(--brand-primary-hover)";
    },
    onMouseLeave: e => {
      if (!disabled && variant === "primary") e.currentTarget.style.background = "var(--brand-primary)";
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.98)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, icon ? /*#__PURE__*/React.createElement("i", {
    className: icon,
    "aria-hidden": "true"
  }) : null, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/cards/QuizHistoryItem.jsx
try { (() => {
function QuizHistoryItem({
  title,
  date,
  questions,
  correct,
  incorrect,
  score
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    tint: "neutral",
    interactive: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-h3)",
      letterSpacing: "var(--ls-snug)",
      color: "var(--gray-1)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-small)",
      color: "var(--gray-3)",
      marginTop: "4px"
    }
  }, date)), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "neutral"
  }, score, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginTop: "14px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-small)",
      color: "var(--gray-3)",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-question",
    "aria-hidden": "true"
  }), questions, " Questions"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-small)",
      color: "var(--success)",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check",
    "aria-hidden": "true"
  }), correct, " Correct"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-small)",
      color: "var(--danger)",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark",
    "aria-hidden": "true"
  }), incorrect, " Incorrect"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "sm",
    fullWidth: false
  }, "View Details \u2192"))));
}
Object.assign(__ds_scope, { QuizHistoryItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/QuizHistoryItem.jsx", error: String((e && e.message) || e) }); }

// components/cards/SummaryCard.jsx
try { (() => {
const {
  useState
} = React;
function SummaryCard({
  title,
  date,
  pages,
  excerpt,
  abstract
}) {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    tint: "neutral"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-file-lines",
    style: {
      color: "var(--gray-3)"
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-pen",
    style: {
      color: "var(--gray-3)",
      fontSize: "12px"
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-rotate",
    style: {
      color: "var(--gray-3)",
      fontSize: "12px"
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-trash-can",
    style: {
      color: "var(--gray-3)",
      fontSize: "12px"
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-h3)",
      letterSpacing: "var(--ls-snug)",
      color: "var(--gray-1)"
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      font: "var(--text-small)",
      color: "var(--gray-3)"
    }
  }, /*#__PURE__*/React.createElement("div", null, date), /*#__PURE__*/React.createElement("div", null, "Pages ", pages))), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body)",
      color: "var(--text-body)",
      marginTop: "12px"
    }
  }, excerpt), open ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-label)",
      letterSpacing: "var(--ls-caps)",
      textTransform: "uppercase",
      fontSize: "var(--fs-xs)",
      color: "var(--gray-3)",
      marginBottom: "6px"
    }
  }, "Abstract"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-small)",
      color: "var(--gray-1)",
      lineHeight: "var(--lh-loose)"
    }
  }, abstract)) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "10px",
      width: "fit-content"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "sm",
    fullWidth: false,
    icon: open ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down",
    onClick: () => setOpen(!open)
  }, "Read More")));
}
Object.assign(__ds_scope, { SummaryCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/SummaryCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      width: "100%"
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    style: {
      font: "var(--text-label)",
      color: "var(--text-body)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    style: {
      font: "var(--text-body)",
      padding: "12px 16px",
      borderRadius: "var(--radius-md)",
      border: "var(--border-width) solid var(--border-default)",
      background: "var(--white)",
      color: "var(--text-body)",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
      transition: "border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)"
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = "var(--brand-primary)";
      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(140,29,64,0.15)";
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = "var(--border-default)";
      e.currentTarget.style.boxShadow = "none";
    }
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/NavBar.jsx
try { (() => {
function NavBar({
  active = "Dashboard",
  userName = "Lakshman Thota",
  userInitials = "LT",
  onNavClick
}) {
  const links = ["Dashboard", "Summaries", "Quizzes"];
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 32px",
      borderBottom: "var(--border-width) solid var(--border-subtle)",
      background: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "28px"
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => {
      e.preventDefault();
      if (onNavClick) onNavClick(l);
    },
    style: {
      font: "var(--text-label)",
      color: l === active ? "var(--brand-primary)" : "var(--text-muted)",
      textDecoration: "none"
    }
  }, l)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    initials: userInitials
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-small)",
      color: "var(--text-body)"
    }
  }, userName))));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quizai-app/App.jsx
try { (() => {
function App() {
  const [view, setView] = React.useState("login");
  if (view === "login") return /*#__PURE__*/React.createElement(window.LoginScreen, {
    onSignIn: () => setView("dashboard")
  });
  const nav = label => {
    if (label === "Dashboard" || label === "Quizzes") setView("dashboard");
    if (label === "Summaries") setView("summaries");
  };
  if (view === "summaries") return /*#__PURE__*/React.createElement(window.SummariesScreen, {
    active: "Summaries",
    onNav: nav
  });
  return /*#__PURE__*/React.createElement(window.DashboardScreen, {
    active: "Dashboard",
    onNav: nav
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quizai-app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quizai-app/DashboardScreen.jsx
try { (() => {
const {
  useRef,
  useEffect
} = React;
const {
  NavBar,
  StatTile,
  QuizHistoryItem,
  Card
} = window.QuizAIDesignSystem_ab923d;
const HISTORY = [{
  title: "Electromagnet.pdf",
  date: "10/11/2024",
  questions: 8,
  correct: 5,
  incorrect: 3,
  score: 62.5
}, {
  title: "Electromagnet.pdf",
  date: "10/11/2024",
  questions: 5,
  correct: 2,
  incorrect: 1,
  score: 40
}, {
  title: "Thermodynamics_Ch3.pdf",
  date: "9/28/2024",
  questions: 10,
  correct: 7,
  incorrect: 3,
  score: 70
}];
function DashboardScreen({
  active,
  onNav
}) {
  const listRef = useRef(null);
  const statRefs = useRef([]);
  useEffect(() => {
    const rows = listRef.current.querySelectorAll("[data-row]");
    gsap.fromTo(rows, {
      y: 16,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      stagger: 0.08,
      ease: "power2.out"
    });
    const targets = [{
      el: statRefs.current[0],
      value: 37,
      suffix: ""
    }, {
      el: statRefs.current[1],
      value: 35,
      suffix: "%"
    }, {
      el: statRefs.current[2],
      value: 0,
      suffix: "h"
    }];
    targets.forEach(({
      el,
      value,
      suffix
    }) => {
      if (!el) return;
      const counter = {
        n: 0
      };
      gsap.to(counter, {
        n: value,
        duration: 1,
        ease: "power1.out",
        onUpdate: () => {
          el.textContent = Math.round(counter.n) + suffix;
        }
      });
    });
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    active: active,
    onNavClick: onNav
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "40px 32px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--text-h1)",
      color: "var(--text-heading)",
      textAlign: "center",
      marginBottom: "32px"
    }
  }, "Your Quiz History"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "16px",
      marginBottom: "28px"
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    icon: "fa-solid fa-circle-question",
    value: /*#__PURE__*/React.createElement("span", {
      ref: el => statRefs.current[0] = el
    }, "0"),
    label: "Total Quizzes",
    sublabel: "Completed"
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "fa-solid fa-chart-simple",
    value: /*#__PURE__*/React.createElement("span", {
      ref: el => statRefs.current[1] = el
    }, "0%"),
    label: "Average Score",
    sublabel: "Across all quizzes"
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "fa-regular fa-clock",
    value: /*#__PURE__*/React.createElement("span", {
      ref: el => statRefs.current[2] = el
    }, "0h"),
    label: "Total Time",
    sublabel: "Spent on quizzes"
  })), /*#__PURE__*/React.createElement("div", {
    ref: listRef,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "14px"
    }
  }, HISTORY.map((h, i) => /*#__PURE__*/React.createElement("div", {
    "data-row": true,
    key: i
  }, /*#__PURE__*/React.createElement(QuizHistoryItem, h))))));
}
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quizai-app/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quizai-app/LoginScreen.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect
} = React;
const {
  Button,
  Input,
  Logo
} = window.QuizAIDesignSystem_ab923d;
function LoginScreen({
  onSignIn
}) {
  const cardRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(cardRef.current, {
      y: 24,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power3.out"
    });
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--surface-maroon-tint)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    style: {
      width: 380,
      background: "var(--white)",
      border: "1px solid var(--border-maroon-tint)",
      borderRadius: "28px",
      padding: "36px 32px",
      boxShadow: "var(--shadow-elevated)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      marginBottom: "24px"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 28
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-h2)",
      color: "var(--text-heading)",
      marginTop: "4px"
    }
  }, "Welcome to QuizAI"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-small)",
      color: "var(--text-muted)"
    }
  }, "Sign in to your account")), /*#__PURE__*/React.createElement("form", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    },
    onSubmit: e => {
      e.preventDefault();
      onSignIn();
    }
  }, /*#__PURE__*/React.createElement(Input, {
    type: "email",
    placeholder: "Email"
  }), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    placeholder: "Password"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    type: "submit"
  }, "Sign In")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Don't have an account? Sign Up"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Back to Options"))));
}
window.LoginScreen = LoginScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quizai-app/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quizai-app/SummariesScreen.jsx
try { (() => {
const {
  useRef,
  useEffect
} = React;
const {
  NavBar,
  StatTile,
  SummaryCard
} = window.QuizAIDesignSystem_ab923d;
function SummariesScreen({
  active,
  onNav
}) {
  const listRef = useRef(null);
  useEffect(() => {
    const rows = listRef.current.querySelectorAll("[data-row]");
    gsap.fromTo(rows, {
      y: 16,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement(NavBar, {
    active: active,
    onNavClick: onNav
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "40px 32px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--text-h1)",
      color: "var(--text-heading)",
      textAlign: "center",
      marginBottom: "32px"
    }
  }, "Study Session Summaries"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "16px",
      marginBottom: "28px"
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    tint: "gold",
    icon: "fa-regular fa-file-lines",
    value: 1,
    label: "Total Summaries",
    sublabel: "Study sessions"
  }), /*#__PURE__*/React.createElement(StatTile, {
    tint: "gold",
    icon: "fa-solid fa-book-open",
    value: 1,
    label: "Pages Studied",
    sublabel: "Total pages covered"
  }), /*#__PURE__*/React.createElement(StatTile, {
    tint: "gold",
    icon: "fa-solid fa-chart-simple",
    value: 1,
    label: "Average Pages",
    sublabel: "Per session"
  })), /*#__PURE__*/React.createElement("div", {
    ref: listRef,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-row": true
  }, /*#__PURE__*/React.createElement(SummaryCard, {
    title: "GR00T_1_Whitepaper.pdf",
    date: "4/14/2025",
    pages: "1 - 1",
    excerpt: "Here\\u2019s a structured summary of the document titled \"GR00T N1: An Open Foundation Model for Generalist Humanoid Robots\" by NVIDIA.",
    abstract: "General-purpose robots require both a versatile body and an intelligent mind."
  })))));
}
window.SummariesScreen = SummariesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quizai-app/SummariesScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BrainMark = __ds_scope.BrainMark;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.QuizHistoryItem = __ds_scope.QuizHistoryItem;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.SummaryCard = __ds_scope.SummaryCard;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.NavBar = __ds_scope.NavBar;

})();

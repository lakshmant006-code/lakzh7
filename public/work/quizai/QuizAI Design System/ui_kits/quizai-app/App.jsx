function App() {
  const [view, setView] = React.useState("login");

  if (view === "login") {
    return React.createElement(window.LoginScreen, {
      onSignIn: () => setView("dashboard"),
    });
  }

  const nav = (label) => {
    if (label === "Dashboard" || label === "Quizzes") setView("dashboard");
    if (label === "Summaries") setView("summaries");
  };

  if (view === "summaries") {
    return React.createElement(window.SummariesScreen, {
      active: "Summaries",
      onNav: nav,
    });
  }

  return React.createElement(window.DashboardScreen, {
    active: "Dashboard",
    onNav: nav,
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(App)
);

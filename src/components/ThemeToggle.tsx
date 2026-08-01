"use client";

type Theme = "light" | "dark";

export function ThemeToggle() {
  function toggleTheme() {
    const currentTheme: Theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("netwise-theme", nextTheme);
  }

  return <button type="button" className="themeToggle" onClick={toggleTheme} aria-label="Chuyển đổi giao diện sáng tối" title="Chuyển giao diện">
    <span className="themeToggleTrack"><i className="themeSun">☀</i><i className="themeMoon">☾</i><b /></span>
  </button>;
}

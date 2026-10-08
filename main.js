const themes = {
  light: {
    label: "Claro",
    background: "#f8fafc",
    foreground: "#172033",
    surface: "#ffffff",
    accent: "#2457c5",
    colorScheme: "light",
  },
  dark: {
    label: "Oscuro",
    background: "#171a21",
    foreground: "#f1f3f5",
    surface: "#242936",
    accent: "#9bb8ff",
    colorScheme: "dark",
  },
  ocean: {
    label: "Océano",
    background: "#e8f5f8",
    foreground: "#12313b",
    surface: "#ffffff",
    accent: "#067087",
    colorScheme: "light",
  },
  forest: {
    label: "Bosque",
    background: "#edf4eb",
    foreground: "#203626",
    surface: "#ffffff",
    accent: "#347347",
    colorScheme: "light",
  },
  sunset: {
    label: "Atardecer",
    background: "#fff1e8",
    foreground: "#472b29",
    surface: "#ffffff",
    accent: "#b84e36",
    colorScheme: "light",
  },
};

const themeStorageKey = "page-theme";
const themeControlId = "page-theme-control";

/**
 * Prepara los estilos y el selector de temas cuando el documento está listo.
 * @returns {void} No devuelve ningún valor.
 */
function initializeThemeControl() {
  if (document.getElementById(themeControlId)) {
    return;
  }

  addThemeStyles();
  const control = createThemeControl();
  document.body.prepend(control);
  applyTheme(getSavedTheme(), false);
}

/**
 * Añade los estilos base del selector y los colores de cada tema.
 * @returns {void} No devuelve ningún valor.
 */
function addThemeStyles() {
  if (document.getElementById("page-theme-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "page-theme-styles";
  style.textContent = `
    :root[data-theme="light"],
    :root[data-theme="dark"],
    :root[data-theme="ocean"],
    :root[data-theme="forest"],
    :root[data-theme="sunset"] {
      color-scheme: var(--theme-color-scheme);
      background-color: var(--theme-background);
      color: var(--theme-foreground);
    }

    body {
      background-color: var(--theme-background);
      color: var(--theme-foreground);
    }

    a {
      color: var(--theme-accent);
    }

    .page-theme-control {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 0.75rem max(1rem, calc((100vw - 72rem) / 2));
      background-color: var(--theme-surface);
      color: var(--theme-foreground);
      border-bottom: 1px solid var(--theme-accent);
      font: inherit;
    }

    .page-theme-control label {
      font-weight: 600;
    }

    .page-theme-control select {
      max-width: 100%;
      padding: 0.45rem 2rem 0.45rem 0.65rem;
      border: 1px solid var(--theme-accent);
      border-radius: 0.35rem;
      background-color: var(--theme-surface);
      color: var(--theme-foreground);
      font: inherit;
    }

    .page-theme-control select:focus-visible {
      outline: 3px solid var(--theme-accent);
      outline-offset: 2px;
    }

    @media (max-width: 30rem) {
      .page-theme-control {
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
      }
    }
  `;
  document.head.append(style);
}

/**
 * Crea un selector accesible con las cinco opciones de tema disponibles.
 * @returns {HTMLDivElement} El control listo para añadirse al documento.
 */
function createThemeControl() {
  const control = document.createElement("div");
  control.className = "page-theme-control";
  control.id = themeControlId;

  const label = document.createElement("label");
  label.htmlFor = "page-theme-select";
  label.textContent = "Tema de la página";

  const select = document.createElement("select");
  select.id = "page-theme-select";
  select.addEventListener("change", handleThemeChange);

  for (const [themeName, theme] of Object.entries(themes)) {
    const option = document.createElement("option");
    option.value = themeName;
    option.textContent = theme.label;
    select.append(option);
  }

  control.append(label, select);
  return control;
}

/**
 * Aplica un tema válido a la página y, si corresponde, guarda la preferencia.
 * @param {string} themeName Clave del tema que se quiere aplicar.
 * @param {boolean} persist Indica si la selección debe guardarse en el navegador.
 * @returns {void} No devuelve ningún valor.
 */
function applyTheme(themeName, persist = true) {
  if (!Object.prototype.hasOwnProperty.call(themes, themeName)) {
    return;
  }
  const theme = themes[themeName];

  const root = document.documentElement;
  root.dataset.theme = themeName;
  root.style.setProperty("--theme-background", theme.background);
  root.style.setProperty("--theme-foreground", theme.foreground);
  root.style.setProperty("--theme-surface", theme.surface);
  root.style.setProperty("--theme-accent", theme.accent);
  root.style.setProperty("--theme-color-scheme", theme.colorScheme);

  const select = document.getElementById("page-theme-select");
  if (select) {
    select.value = themeName;
  }

  if (persist) {
    try {
      window.localStorage.setItem(themeStorageKey, themeName);
    } catch {
      // La selección sigue funcionando aunque el navegador bloquee el almacenamiento.
    }
  }
}

/**
 * Recupera la preferencia guardada y usa el tema claro si no es válida o accesible.
 * @returns {string} Clave de un tema disponible.
 */
function getSavedTheme() {
  try {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    return Object.prototype.hasOwnProperty.call(themes, savedTheme) ? savedTheme : "light";
  } catch {
    return "light";
  }
}

/**
 * Aplica el tema elegido en el selector.
 * @param {Event} event Evento de cambio del selector de temas.
 * @returns {void} No devuelve ningún valor.
 */
function handleThemeChange(event) {
  applyTheme(event.currentTarget.value);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeThemeControl, { once: true });
} else {
  initializeThemeControl();
}
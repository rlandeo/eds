/* SCRIPT PARA HABILITAR UN CSS DE MODO DEV */

document.addEventListener("DOMContentLoaded", () => {
    const DEV_CSS_HOST = "https://localhost:3000";
    const ORIGINAL_CSS_PATH = document.getElementById("pent-styles").href;
    const LOCAL_STORAGE_KEY = "devModeEnabled";

    let devUpdateInterval = null;

    const pageHeader = document.querySelector("#page-header");

    if (!pageHeader) {
        console.error("El elemento #page-header no existe en la página.");
        return;
    }

    // Verificar si el body tiene la clase "editing"
    /* if (!document.body.classList.contains("editing")) {
        return;
    } */

    // Crear el switch de modo dev
    const devSwitchContainer = document.createElement("div");
    devSwitchContainer.style.display = "flex";
    devSwitchContainer.style.alignItems = "center";
    devSwitchContainer.style.gap = "0.5rem";
    devSwitchContainer.style.marginTop = "1rem";

    const devSwitchLabel = document.createElement("label");
    devSwitchLabel.textContent = "Modo Dev";
    devSwitchLabel.style.cursor = "pointer";

    const devSwitch = document.createElement("input");
    devSwitch.type = "checkbox";
    devSwitch.id = "dev-mode-toggle";
    devSwitch.style.cursor = "pointer";

    devSwitchContainer.appendChild(devSwitch);
    devSwitchContainer.appendChild(devSwitchLabel);
    pageHeader.appendChild(devSwitchContainer);

    // Leer estado inicial de localStorage
    const isDevModeEnabled = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
    devSwitch.checked = isDevModeEnabled;
    toggleDevMode(isDevModeEnabled);

    // Manejar el evento de cambio del switch
    devSwitch.addEventListener("change", () => {
        const isEnabled = devSwitch.checked;
        localStorage.setItem(LOCAL_STORAGE_KEY, isEnabled);
        toggleDevMode(isEnabled);
    });

    function toggleDevMode(enabled) {
        const stylesLink = document.getElementById("pent-styles");
        if (!stylesLink) {
            console.error("El elemento <link id=\"pent-styles\"> no existe en la página.");
            return;
        }

        clearInterval(devUpdateInterval);

        if (enabled) {
            updateDevStyles();
            devUpdateInterval = setInterval(updateDevStyles, 2000);
        } else {
            stylesLink.href = ORIGINAL_CSS_PATH;
        }
    }

    function updateDevStyles() {
        const stylesLink = document.getElementById("pent-styles");
        if (!stylesLink) {
            console.error("El elemento <link id=\"pent-styles\"> no existe en la página.");
            return;
        }

        // Extraer la ruta del archivo CSS original
        const originalURL = new URL(ORIGINAL_CSS_PATH);
        const cssPath = originalURL.pathname; // Ruta interna del archivo

        // Construir la nueva URL con el host de desarrollo
        const devCSSURL = new URL(cssPath, DEV_CSS_HOST);

        // Añadir un timestamp para evitar el caché
        const timestamp = new Date().getTime();
        stylesLink.href = `${devCSSURL.href}?t=${timestamp}`;
    }
});



// ABRIR LOS RECURSOS URL EN VENTANA NUEVA
document.addEventListener("DOMContentLoaded", function() {
  // Busca todos los enlaces dentro de <li class="url">
  const enlaces = document.querySelectorAll("li.url a");

  enlaces.forEach(function(enlace) {
    enlace.setAttribute("target", "_blank");
    enlace.setAttribute("rel", "noopener noreferrer"); // seguridad extra
  });
});

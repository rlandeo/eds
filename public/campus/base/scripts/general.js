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

// Espera a que el DOM esté completamente cargado

document.addEventListener("DOMContentLoaded", function() {
    let body = document.body;

    //SI estamos en la portada del curso
    if (body.classList.contains('pagelayout-course')) {
        /**
         * Función para colapsar todas las secciones del curso excepto la primera válida
         */

        if (document.body.classList.contains('editing')) return;

        const allSections = document.querySelectorAll('ul.topics li.course-section');

        let firstValidSection = null;

        // Encontrar la primera sección válida que no sea section-0 ni tenga .separate
        for (const section of allSections) {
            if (section.id !== 'section-0' && !section.querySelector('.separate')) {
                firstValidSection = section;
                break;
            }
        }

        // Iterar sobre todas las secciones
        allSections.forEach(section => {
            // Si contiene un .separate, marcar la sección como separador
            if (section.querySelector('.separate')) {
                section.classList.add('section-divider');
            }

            const content = section.querySelector('.course-content-item-content');
            const link = section.querySelector('a.icons-collapse-expand');
            if (section === firstValidSection || section.id == "section-0") {
                // Expandir la primera sección válida
                if (content) content.classList.add('show');

                if (link) {
                    link.classList.remove('collapsed');
                    link.setAttribute('aria-expanded', 'true');
                }
            } else {
                // Colapsar todas las demás
                if (content) content.classList.remove('show');

                if (link) {
                    if (!link.classList.contains('collapsed')) {
                        link.classList.add('collapsed');
                    }

                    link.setAttribute('aria-expanded', 'false');
                }
            }

            //Numeradores para los separadores
            const divider_number = [...document.querySelectorAll('li.section-divider')].reverse();

            divider_number.forEach((el, index) => {
                el.style.setProperty('--count', `'${index + 1}'`);
            });
        });

    } else {
        newQuiz();

        finishQuiz();

        quizInputCheck();

        reviewQuiz();

        // Si hay entradas nuevas, redirecciona para agregar una nueva entrada
        newEntries();

        const breadcrumb = document.querySelector('.breadcrumb');

        if (breadcrumb) {
            const firstBreadcrumbItem = breadcrumb.querySelector('li.breadcrumb-item a');

            if (firstBreadcrumbItem) {
                let href = firstBreadcrumbItem.getAttribute('href');
                const title = firstBreadcrumbItem.getAttribute('title');

                // 2. Crear el nuevo elemento <div class="back"><a ...>← Volver</a></div>
                const backDiv = document.createElement('div');
                backDiv.className = 'back';

                const backLink = document.createElement('a');
                href = href.split('#')[0];

                backLink.href = href;

                backLink.title = title;
                backLink.textContent = 'Recorrido';

                backDiv.appendChild(backLink);

                // 3. Insertar div.back al principio del elemento con id="topofscroll"
                const pageContent = document.querySelector('#page-content');

                if (pageContent && pageContent.parentNode) {
                    pageContent.parentNode.insertBefore(backDiv, pageContent);
                }
            }
        }

        /**
         * Si la pagina es de edición de datos, reemplaza los inputs de texto por textareas
         * 
         */
        replaceTextInputs();

        /**
         * Funcion para agregar un enlace "Avanzar" al sticky footer en la página de vista de datos
         */
        stickyFooter(breadcrumb);

        /**
         * Función para reorganizar las tarjetas dentro de la base de datos
         * y colocarlas en el contenedor correspondiente según su clase.
         */
        accordionCardBd();


        accordionWhatsAppBd();
    }


    //Remplazos de input tipo text a textarea
    function replaceTextInputs() {
        // 1. Verificar si el body tiene el ID correcto
        if (document.body.id !== 'page-mod-data-edit') return;

        const textInputs = document.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            const textarea = document.createElement('textarea');
            const parentInput = input.parentNode;

            textarea.value = input.value;
            textarea.className = input.className;
            textarea.id = input.id;
            textarea.name = input.name;
            textarea.placeholder = parentInput.title ? parentInput.title : input.placeholder;

            // Reemplazar el input por el textarea
            input.parentNode.replaceChild(textarea, input);
        });
    }

    /**
     * Función para agregar un enlace "Avanzar" al sticky footer en la página de vista de datos
     * y cambiar el texto del botón "Agregar nota" a "Escribir" si es necesario.
     * 
     * Si el body tiene el Clase "base-libreta" y mode es "single",
     * Incorpora un botón "Ver todo" que redirige a la vista de todas las notas.
     * 
     * Si el mode es "single" y el body tiene la clase "bd-sv-pagination-none"
     * oculta la paginación.
     * 
     */

    function stickyFooter(breadcrumb) {
        const text_btn_new_entry = document.querySelector(".base-libreta") ? 'Agregar nota' : "Escribir";

        if (document.body.id !== 'page-mod-data-view') return;

        let breadcrumbUrl = '#';
        let breadcrumbTitle = '';

        if (breadcrumb) {
            const firstItem = breadcrumb.querySelector('li.breadcrumb-item a');

            if (firstItem) {
                breadcrumbUrl = firstItem.getAttribute('href');
                breadcrumbTitle = firstItem.getAttribute('title') || firstItem.textContent.trim();
            }
        }

        // Obtener el valor del parámetro "mode" en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode') == 'single' || urlParams.get('rid') ? 'single' : 'list';

        // 2. Verifica si existe el contenedor del sticky footer
        const stickyFooter = document.querySelector('#page-mod-data-view #sticky-footer');

        if (stickyFooter) {
            const navItems = stickyFooter.querySelectorAll('div.navitem');

            navItems.forEach(item => {
                // Asegura que el div tenga solo la clase "navitem"
                if (item.classList.length === 1 && item.classList.contains('navitem')) {
                    // Crear el nuevo enlace "Avanzar"
                    const avanzarLink = document.createElement('a');
                    avanzarLink.href = breadcrumbUrl;
                    avanzarLink.title = breadcrumbTitle;
                    avanzarLink.textContent = 'Avanzar';
                    avanzarLink.className = 'btn btn-secondary';

                    // Agregar el nuevo enlace al final del navitem
                    item.appendChild(avanzarLink);

                    //Si la BD de la libreta es de modo "single"
                    if (mode == 'single' && text_btn_new_entry == 'Agregar nota') {
                        const d = urlParams.get('d');

                        let seeAllUrl = window.location.origin + window.location.pathname;

                        if (d) {
                            seeAllUrl += `?d=${encodeURIComponent(d)}`;
                        }

                        const seeAllBtn = document.createElement('a');
                        seeAllBtn.href = seeAllUrl;
                        seeAllBtn.textContent = 'Ver todo';
                        seeAllBtn.className = 'btn btn-secondary';

                        item.insertBefore(seeAllBtn, item.firstChild);
                    }

                    // Buscar un <a> con clase "btn-primary" y cambiar su texto
                    const btnPrimary = item.querySelector('a.btn-primary');
                    if (btnPrimary) {
                        btnPrimary.textContent = text_btn_new_entry;
                    }

                } else {
                    /**
                     * Si existe en el body la clase "bd-sv-pagination-none"
                     * y el modo es "single", ocultar paginación
                     */

                    if (!document.body.classList.contains('bd-sv-pagination-none')) return;
                    if (document.body.classList.contains('editing')) return;

                    if (mode !== 'single') return;

                    const pagination = item.querySelectorAll('nav.pagination');

                    //Display none si no hay paginación
                    if (pagination.length > 0) {
                        item.style.display = 'none';
                    }
                }
            });
        }
    }

    /**
     * @returns Reorganiza las tarjetas dentro de la base de datos
     * y las coloca en el contenedor accordeón correspondiente según su clase.
     * 
     */
    function accordionCardBd() {
        // 1. Verificar si el body tiene el ID correcto
        if (document.body.id !== 'page-mod-data-view') return;

        // 2. Verificar si existe el contenedor de la tabla acordeón
        const accordionContainer = document.querySelector('.accordion-table-bd');

        // 3. Si no existe, salir de la función
        if (!accordionContainer) return;

        // 4. Seleccionar todas las tarjetas dentro de la BD
        const cards = document.querySelectorAll('.card-bd');

        cards.forEach(card => {
            // 5. Buscar la clase que sigue el patrón "C1", "C2", etc.
            const classList = Array.from(card.classList);
            const matchClass = classList.find(cls => /^C\d+$/.test(cls));

            // 6. Si se encuentra una clase que coincide, buscar el contenedor correspondiente
            if (matchClass) {
                const contentCard = document.querySelector(`.content-card-bd[data-collect="${matchClass}"]`);

                const targetCollapse = contentCard.querySelector('.contentcollapse-bd');

                if (targetCollapse) {
                    targetCollapse.appendChild(card);
                }
            }
        });

        // 4. Comportamiento del acordeón exclusivo
        const allContentCards = document.querySelectorAll('.content-card-bd');

        allContentCards.forEach((card, index) => {
            const title = card.querySelector('.title-card-bd');
            const content = card.querySelector('.collapse-bd');

            if (!title || !content) return;

            // Estado inicial: el primero colapsado, el resto abiertos
            if (index === 0) {
                content.classList.add('show');
                title.classList.add('icon-collapse');
            } else {
                content.classList.remove('show');
                title.classList.remove('icon-collapse');
            }

            // Agregar evento de clic
            title.addEventListener('click', () => {

                const isOpen = content.classList.contains('show');

                // Si ya está abierto, contraer y al resto no hacer nada
                if (isOpen) {
                    // Si ya está abierto, colapsar
                    content.classList.remove('show');
                    title.classList.remove('icon-collapse');
                    return;
                }

                // Contraer todos
                allContentCards.forEach(otherCard => {
                    const otherTitle = otherCard.querySelector('.title-card-bd');
                    const otherContent = otherCard.querySelector('.collapse-bd');
                    if (otherContent && otherTitle) {
                        otherContent.classList.remove('show');
                        otherTitle.classList.remove('icon-collapse');
                    }
                });

                // Expandir solo el clickeado
                content.classList.add('show');
                title.classList.add('icon-collapse');

                title.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }


    /**
     * @returns Reorganiza las tarjetas dentro de la base de datos
     * y las coloca en el contenedor accordeón correspondiente según su clase.
     * 
     */
    function accordionWhatsAppBd() {
        // 1. Verificar si el body tiene el ID correcto
        if (document.body.id !== 'page-mod-data-view') return;
        // 2. Verificar si existe el contenedor de la tabla acordeón
        const accordionContainer = document.querySelector('.accordion-whatsapp');

        // 3. Si no existe, salir de la función
        if (!accordionContainer) return;

        // 4. Seleccionar todas las tarjetas dentro de la BD
        const cards = document.querySelectorAll('.message-row');

        //Contador para alternar entre left y right
        let counter = 0;

        cards.forEach(card => {
            // 5. Buscar la clase que sigue el patrón "C1", "C2", etc.
            const classList = Array.from(card.classList);
            const matchClass = classList.find(cls => /^C\d+$/.test(cls));

            // 6. Si se encuentra una clase que coincide, buscar el contenedor correspondiente
            if (matchClass) {
                const contentCard = document.querySelector(`.whatsapp-component[data-collect="${matchClass}"]`);

                const targetCollapse = contentCard.querySelector('.wrapper-messages');

                if (targetCollapse) {
                    // 8. Alternar la clase en el div.message-card
                    const messageCard = card.querySelector('.message-card');
                    if (messageCard) {
                        messageCard.classList.add(counter % 2 === 0 ? 'left' : 'right');
                        counter++;
                    }

                    // 9. Agregar la card al contenedor
                    targetCollapse.appendChild(card);
                }
            }
        });

        // 4. Comportamiento del acordeón exclusivo
        const allContentCards = document.querySelectorAll('.whatsapp-component');

        allContentCards.forEach((card, index) => {
            const title = card.querySelector('.title-card-bd');
            const content = card.querySelector('.wrapper-messages');

            if (!title || !content) return;

            // Estado inicial: el primero colapsado, el resto abiertos
            if (index === 0) {
                content.classList.add('show');
                title.classList.add('icon-collapse');
            } else {
                content.classList.remove('show');
                title.classList.remove('icon-collapse');
            }

            // Agregar evento de clic
            title.addEventListener('click', () => {

                const isOpen = content.classList.contains('show');

                // Si ya está abierto, contraer y al resto no hacer nada
                if (isOpen) {
                    // Si ya está abierto, colapsar
                    content.classList.remove('show');
                    title.classList.remove('icon-collapse');
                    return;
                }

                // Contraer todos
                allContentCards.forEach(otherCard => {
                    const otherTitle = otherCard.querySelector('.title-card-bd');
                    const otherContent = otherCard.querySelector('.wrapper-messages');
                    if (otherContent && otherTitle) {
                        otherContent.classList.remove('show');
                        otherTitle.classList.remove('icon-collapse');
                    }
                });

                // Expandir solo el clickeado
                content.classList.add('show');
                title.classList.add('icon-collapse');

                title.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    /**
     * Función para verificar si hay entradas nuevas en la base de datos
     * @returns Si hay entradas nuevas, redirecciona para agregar una nueva entrada
     * Verifica existe el templete de "empty-message"
     * busca formularios dentro de los divs con clase "singlebutton"
     * Si encuentra un formulario con la acción que termina en "/edit.php", lo envía.
     */
    function newEntries() {
        // Verificar si el body tiene el ID correcto
        if (document.body.id !== 'page-mod-data-view') return;

        // Verificar si existe el mensaje de "empty-message"
        const emptyMessage = document.querySelector('div[data-region="empty-message"]');
        if (!emptyMessage) return;

        // Buscar formularios dentro de los divs con clase "singlebutton"
        const singleButtons = document.querySelectorAll('div[data-region="empty-message"] .singlebutton form');

        for (const form of singleButtons) {
            if (form.action.endsWith('/edit.php')) {
                form.submit();
                return;
            }
        }
    }


    function newQuiz() {
        if (document.body.classList.contains('editing')) return;
        // Verificar si el body tiene el ID correcto
        if (document.body.id !== 'page-mod-quiz-view') return;

        const tableQuizSummary = document.querySelector('.quizattemptsummary');

        if (tableQuizSummary) return;

        // Verificar si existe el formulario con la clase "quizstartbuttondiv"
        const formReadyForm = document.querySelector('.quizstartbuttondiv form');

        if (!formReadyForm) return;

        formReadyForm.submit();
    }

    function finishQuiz() {
        if (document.body.classList.contains('editing')) return;
        // Verificar si el body tiene el ID correcto
        if (document.body.id !== 'page-mod-quiz-summary') return;
        // Verificar si existe el botón de finalizar el cuestionario
        const finishFrom = document.querySelector('#frm-finishattempt');

        finishFrom.submit();
    }


    function reviewQuiz() {
        if (document.body.classList.contains('editing')) return;
        // Verificar si el body tiene el ID correcto
        if (document.body.id !== 'page-mod-quiz-review') return;
        // Verificar si existe el botón de finalizar el cuestionario
        const finishReview = document.querySelector('.submitbtns .mod_quiz-next-nav');

        if (finishReview) finishReview.click();
    }

    function quizInputCheck() {
        if (document.body.classList.contains('editing')) return;
        // Verificar si el body tiene el ID correcto
        if (document.body.id !== 'page-mod-quiz-attempt') return;

        const form = document.querySelector('#responseform');
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        const submitButton = form.querySelector('.submitbtns input#mod_quiz-next-nav');

        if (!form || checkboxes.length === 0 || !submitButton) return;

        verificarCheckboxes(checkboxes, submitButton, form);

        // Agregar listeners a todos los checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                verificarCheckboxes(checkboxes, submitButton, form);
            });
        });
    }

    // Función para verificar si hay al menos un checkbox seleccionado
    function verificarCheckboxes(checkboxes, submitButton, form) {
        const algunoSeleccionado = Array.from(checkboxes).some(cb => cb.checked);
        let msj = document.querySelector('.alert-checkbox');

        if (algunoSeleccionado) {
            submitButton.disabled = false;
            submitButton.classList.remove('btn-secondary');
            submitButton.classList.add('btn-primary');

            // Si ya existe el mensaje, eliminarlo
            if (msj) {
                form.removeChild(msj);
            }

        } else {
            submitButton.disabled = true;
            submitButton.classList.remove('btn-primary');
            submitButton.classList.add('btn-secondary');
        }

        // Si el formulario existe y no hay checkboxes seleccionados, mostrar mensaje
        if (form && algunoSeleccionado) return;

        const divInfo = document.createElement('div');
        divInfo.className = 'alert alert-danger alert-block fade in alert-dismissible alert-checkbox';
        divInfo.textContent = 'Por favor, selecciona al menos una opción antes de continuar.';

        form.insertBefore(divInfo, form.firstChild);
    }
});
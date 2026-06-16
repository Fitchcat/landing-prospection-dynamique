/**
 * Logique Dynamique pour Landing Page Prospection (Studios Sport)
 * Parse les attributs "activite" et "ville" de l'URL pour adapter le DOM.
 */

function updateLandingPage(rawActivite, rawCity) {
    // Fallback valeurs par défaut
    const defaultActivite = 'yoga';
    const defaultCity = 'Montpellier';

    // Récupération (et nettoyage) des variables
    let activite = (rawActivite || defaultActivite).toLowerCase().trim();
    let cityRaw = rawCity || defaultCity;
    // Capitalisation de la première lettre de la ville (ex: montpellier -> Montpellier)
    let city = cityRaw.charAt(0).toUpperCase() + cityRaw.slice(1).trim();

    // Mapping des thèmes et textes
    const themeMap = {
        'yoga': {
            theme: 'yoga',
            badge: '✦ Spécialiste studios Yoga',
            heroTitleActivite: 'YOGA',
            textActivite: 'yoga',
            textStudioSingulier: 'studio',
            textStudioPluriel: 'studios',
        },
        'pilates': {
            theme: 'pilates',
            badge: '✦ Spécialiste studios Pilates',
            heroTitleActivite: 'PILATES',
            textActivite: 'pilates',
            textStudioSingulier: 'studio',
            textStudioPluriel: 'studios',
        },
        'fitness': {
            theme: 'fitness',
            badge: '✦ Spécialiste Salles de Fitness',
            heroTitleActivite: 'FITNESS',
            textActivite: 'fitness',
            textStudioSingulier: 'salle',
            textStudioPluriel: 'salles',
        },
        'padel': {
            theme: 'padel',
            badge: '✦ Spécialiste Clubs de Padel',
            heroTitleActivite: 'PADEL',
            textActivite: 'padel',
            textStudioSingulier: 'club',
            textStudioPluriel: 'clubs',
        },
        'crossfit': {
            theme: 'crossfit',
            badge: '✦ Spécialiste Box Crossfit',
            heroTitleActivite: 'CROSSFIT',
            textActivite: 'crossfit',
            textStudioSingulier: 'box',
            textStudioPluriel: 'box',
        }
    };

    // Tolérance d'erreur si la niche n'est pas reconnue
    const currentConfig = themeMap[activite] || themeMap['yoga'];

    // Application du Thème CSS
    document.documentElement.setAttribute('data-theme', currentConfig.theme);

    // Mise à jour du Contenu Textuel (DOM)
    const elementsToUpdate = {
        badge: document.getElementById('specialist-badge'),
        heroActivity: document.getElementById('hero-activity'),
        heroCity: document.getElementById('hero-city'),
        textActiviteLowercaseElements: document.querySelectorAll('.text-activite-lowercase'),
        textCityElements: document.querySelectorAll('.text-city'),
        studioPlurielElements: document.querySelectorAll('.text-studio-pluriel'),
        studioPlurielMajElements: document.querySelectorAll('.text-studio-pluriel-maj'),
        studioSingulierElements: document.querySelectorAll('.text-studio-singulier'),
        pageTitle: document.querySelector('title')
    };

    // Mise à jour de la balise <title>
    if (elementsToUpdate.pageTitle) {
        elementsToUpdate.pageTitle.textContent = `Boostez vos réservations de ${currentConfig.heroTitleActivite}`;
    }

    // Mise à jour du Hero
    if (elementsToUpdate.badge) elementsToUpdate.badge.textContent = currentConfig.badge;
    if (elementsToUpdate.heroActivity) elementsToUpdate.heroActivity.textContent = currentConfig.heroTitleActivite;
    if (elementsToUpdate.heroCity) elementsToUpdate.heroCity.textContent = city;

    elementsToUpdate.textActiviteLowercaseElements.forEach(el => {
        el.textContent = currentConfig.textActivite;
    });

    elementsToUpdate.textCityElements.forEach(el => {
        el.textContent = city;
    });

    elementsToUpdate.studioPlurielElements.forEach(el => {
        el.textContent = currentConfig.textStudioPluriel;
    });

    elementsToUpdate.studioPlurielMajElements.forEach(el => {
        let pluriel = currentConfig.textStudioPluriel;
        el.textContent = pluriel.charAt(0).toUpperCase() + pluriel.slice(1);
    });

    elementsToUpdate.studioSingulierElements.forEach(el => {
        el.textContent = currentConfig.textStudioSingulier;
    });

    console.log(`[Landing] Page mise à jour pour: ${currentConfig.heroTitleActivite} à ${city}`);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialisation depuis l'URL au chargement
    const params = new URLSearchParams(window.location.search);
    const initialActivite = params.get('activite');
    const initialCity = params.get('ville');
    
    updateLandingPage(initialActivite, initialCity);
    
    // 2. Initialisation du Panneau de Démo interactif
    const demoUpdateBtn = document.getElementById('demo-update-btn');
    if (demoUpdateBtn) {
        // Pré-remplir le panneau avec les valeurs de l'URL si elles existent
        if (initialActivite) {
            const select = document.getElementById('demo-activite');
            if(Array.from(select.options).some(opt => opt.value === initialActivite.toLowerCase())) {
                select.value = initialActivite.toLowerCase();
            }
        }
        if (initialCity) document.getElementById('demo-ville').value = initialCity;
        
        // Ecouteur d'événement sur le bouton "Appliquer"
        demoUpdateBtn.addEventListener('click', () => {
            const selectedActivite = document.getElementById('demo-activite').value;
            const selectedCity = document.getElementById('demo-ville').value;
            
            // Met à jour l'URL sans recharger la page complète afin de garder l'état propre
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('activite', selectedActivite);
            newUrl.searchParams.set('ville', selectedCity);
            window.history.pushState({}, '', newUrl);
            
            // Appliquer les changements visuels
            updateLandingPage(selectedActivite, selectedCity);
        });
        
        // 3. Logique du bouton d'affichage/masquage du panneau
        const toggleBtn = document.getElementById('demo-toggle-btn');
        const panel = document.getElementById('demo-panel');
        let isPanelVisible = true;

        if (toggleBtn && panel) {
            toggleBtn.addEventListener('click', () => {
                isPanelVisible = !isPanelVisible;
                if (isPanelVisible) {
                    panel.style.opacity = '1';
                    panel.style.transform = 'scale(1)';
                    panel.style.pointerEvents = 'auto';
                } else {
                    panel.style.opacity = '0';
                    panel.style.transform = 'scale(0.9)';
                    panel.style.pointerEvents = 'none';
                }
            });
        }
    }
    
    // 4. Initialisation des animations au défilement (Scroll Reveal)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
});

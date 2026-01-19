// Navigation mobile et fonctionnalités générales
document.addEventListener('DOMContentLoaded', function() {
    // Navigation hamburger
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fermer le menu mobile quand on clique sur un lien
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Scroll fluide pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Compensation pour la navbar fixe
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Filtres de galerie
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        console.log('Filtres galerie initialisés:', filterButtons.length, 'boutons et', galleryItems.length, 'items');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Filtre cliqué:', button.getAttribute('data-filter'));
                
                // Enlever la classe active de tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    } else {
        console.log('Aucun filtre de galerie trouvé');
    }
    
    // Validation du formulaire intelligent
    const contactForm = document.getElementById('contactForm');
    const intentionSelect = document.getElementById('intention');
    
    // Attacher l'événement change au select intention
    if (intentionSelect) {
        intentionSelect.addEventListener('change', function() {
            toggleFormSections();
        });
    } else {
        console.log('Select intention non trouvé');
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const intentionElement = document.getElementById('intention');
            
            if (!intentionElement) {
                // Pas de formulaire intelligent, laisser passer
                e.preventDefault();
                alert('Formulaire de contact standard (fonctionnalité à implémenter)');
                return false;
            }
            
            const intention = intentionElement.value;
            
            if (!intention) {
                e.preventDefault();
                alert('Veuillez sélectionner le type de votre demande.');
                return false;
            }
            
            // Validation spécifique selon l'intention
            if (intention === 'adhesion') {
                const disciplinesChecked = document.querySelectorAll('input[name="disciplines[]"]:checked');
                const objectifsChecked = document.querySelectorAll('input[name="objectifs[]"]:checked');
                const disponibilitesChecked = document.querySelectorAll('input[name="disponibilites[]"]:checked');
                
                if (disciplinesChecked.length === 0) {
                    e.preventDefault();
                    alert('Veuillez sélectionner au moins une discipline que vous pratiquez.');
                    return false;
                }
                
                if (objectifsChecked.length === 0) {
                    e.preventDefault();
                    alert('Veuillez sélectionner au moins un objectif.');
                    return false;
                }
                
                if (disponibilitesChecked.length === 0) {
                    e.preventDefault();
                    alert('Veuillez indiquer vos disponibilités.');
                    return false;
                }
            }
            
            if (intention === 'evenement') {
                const evenementsChecked = document.querySelectorAll('input[name="evenements[]"]:checked');
                if (evenementsChecked.length === 0) {
                    e.preventDefault();
                    alert('Veuillez sélectionner au moins un événement qui vous intéresse.');
                    return false;
                }
            }
            
            // Si on arrive ici, le formulaire est valide
            e.preventDefault();
            alert('Formulaire validé avec succès ! Dans la vraie version, les données seraient envoyées.');
            return false;
        });
    }
    
    // Ajouter les styles CSS pour les animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .gallery-item {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

// FONCTION pour le formulaire intelligent
function toggleFormSections() {
    const intention = document.getElementById('intention');
    if (!intention) {
        console.log('Élément intention non trouvé');
        return;
    }
    
    const intentionValue = intention.value;
    console.log('Intention sélectionnée:', intentionValue);
    
    // Récupérer toutes les sections
    const sections = document.querySelectorAll('.conditional-section');
    
    // Cacher toutes les sections
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Afficher la section correspondante
    if (intentionValue) {
        const targetSection = document.getElementById('section-' + intentionValue);
        if (targetSection) {
            targetSection.style.display = 'block';
            console.log('Section affichée:', targetSection.id);
            
            // Scroll vers la section
            setTimeout(() => {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
        }
    }
}

function updateRequiredFields(intention) {
    // Fonction simplifiée pour les champs obligatoires conditionnels
    // À implémenter selon les besoins spécifiques
    console.log('Updating required fields for:', intention);
}
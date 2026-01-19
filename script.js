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

// FONCTION GLOBALE pour le formulaire intelligent
function toggleFormSections() {
    console.log('toggleFormSections appelée');
    
    const intention = document.getElementById('intention');
    if (!intention) {
        console.log('Élément intention non trouvé');
        return;
    }
    
    const intentionValue = intention.value;
    console.log('Intention sélectionnée:', intentionValue);
    
    const sections = {
        'adhesion': document.getElementById('section-adhesion'),
        'evenement': document.getElementById('section-evenement'), 
        'question': document.getElementById('section-question'),
        'partenariat': document.getElementById('section-partenariat')
    };
    
    // Cacher toutes les sections
    Object.values(sections).forEach(section => {
        if (section) {
            section.style.display = 'none';
            console.log('Section cachée:', section.id);
        }
    });
    
    // Afficher la section correspondante
    if (sections[intentionValue]) {
        sections[intentionValue].style.display = 'block';
        console.log('Section affichée:', sections[intentionValue].id);
        
        // Faire défiler vers la section qui vient d'apparaître
        setTimeout(() => {
            sections[intentionValue].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }
    
    // Gérer les champs obligatoires conditionnels
    updateRequiredFields(intentionValue);
}

function updateRequiredFields(intention) {
    // Retirer tous les required conditionnels
    document.querySelectorAll('[data-conditional-required]').forEach(field => {
        field.removeAttribute('required');
    });
    
    // Ajouter les required selon l'intention
    switch(intention) {
        case 'adhesion':
            const niveauGlobal = document.getElementById('niveau-global');
            const motivationAdhesion = document.getElementById('motivation-adhesion');
            if (niveauGlobal) niveauGlobal.setAttribute('required', '');
            if (motivationAdhesion) motivationAdhesion.setAttribute('required', '');
            console.log('Champs obligatoires ajoutés pour adhésion');
            break;
        case 'question':
            const messageQuestion = document.getElementById('message-question');
            if (messageQuestion) messageQuestion.setAttribute('required', '');
            console.log('Champs obligatoires ajoutés pour question');
            break;
        case 'partenariat':
            const entreprise = document.getElementById('entreprise');
            if (entreprise) entreprise.setAttribute('required', '');
            console.log('Champs obligatoires ajoutés pour partenariat');
            break;
    }
}
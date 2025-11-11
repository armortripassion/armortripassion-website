// Navigation mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fermer le menu mobile quand on clique sur un lien
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

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

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupération des données du formulaire
    const formData = new FormData(this);
    const data = {};
    
    // Traitement des champs normaux
    for (let [key, value] of formData.entries()) {
        if (key.includes('[]')) {
            // Traitement des checkboxes (interet[])
            const cleanKey = key.replace('[]', '');
            if (!data[cleanKey]) {
                data[cleanKey] = [];
            }
            data[cleanKey].push(value);
        } else {
            data[cleanKey] = value;
        }
    }
    
    // Validation basique
    if (!data.nom || !data.email) {
        alert('Veuillez remplir les champs obligatoires (nom et email).');
        return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Veuillez saisir une adresse email valide.');
        return;
    }
    
    // Simulation d'envoi (à remplacer par l'intégration réelle)
    const submitButton = this.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;
    
    // Simulation d'un délai d'envoi
    setTimeout(() => {
        // Ici, vous devrez intégrer un service d'envoi d'emails
        // comme EmailJS, Netlify Forms, ou un backend personnalisé
        
        // Création du contenu de l'email
        const emailContent = createEmailContent(data);
        
        // Pour le moment, on simule un succès et on copie le contenu dans le presse-papier
        copyToClipboard(emailContent);
        
        alert('Votre message a été préparé ! Le contenu a été copié dans votre presse-papier. Vous pouvez maintenant l\'envoyer par email à contact@armortripassion.fr');
        
        // Reset du formulaire
        this.reset();
        
        // Restoration du bouton
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
    }, 2000);
});

// Fonction pour créer le contenu de l'email
function createEmailContent(data) {
    let content = `Nouvelle demande de contact - Armor Tri Passion

Informations personnelles :
- Nom : ${data.nom || 'Non renseigné'}
- Email : ${data.email || 'Non renseigné'}
- Téléphone : ${data.telephone || 'Non renseigné'}

Profil sportif :
- Niveau en triathlon : ${data.niveau || 'Non renseigné'}

Intérêts :`;
    
    if (data.interet && data.interet.length > 0) {
        data.interet.forEach(interest => {
            const labels = {
                'adhesion': 'Adhésion à l\'association',
                'swim-roz': 'Participation à La Swim Roz',
                'tro-enez-veur': 'Participation au Tro Enez Veur',
                'benevole': 'Bénévolat lors des événements'
            };
            content += `\n- ${labels[interest] || interest}`;
        });
    } else {
        content += '\n- Aucun intérêt spécifié';
    }
    
    content += `

Disponibilités :
${data.disponibilite || 'Non renseignées'}

Motivation :
${data.motivation || 'Non renseignée'}

Message libre :
${data.message || 'Aucun message'}

---
Message envoyé depuis le site armortripassion.fr
Date : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`;

    return content;
}

// Fonction pour copier dans le presse-papier
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Erreur lors de la copie :', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// Méthode de fallback pour la copie
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Erreur lors de la copie avec la méthode de fallback :', err);
    }
    
    document.body.removeChild(textArea);
}

// Animation au scroll pour révéler les éléments
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les cartes d'événements
document.addEventListener('DOMContentLoaded', () => {
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observer la section contact
    const contactSection = document.querySelector('.contact-form');
    if (contactSection) {
        contactSection.style.opacity = '0';
        contactSection.style.transform = 'translateY(30px)';
        contactSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(contactSection);
    }
});

// Effet sur la navbar lors du scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--white)';
        navbar.style.backdropFilter = 'none';
    }
});
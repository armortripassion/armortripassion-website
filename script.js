/* Armor Tri Passion — interactions */
document.addEventListener('DOMContentLoaded', function () {

    /* ---- Navbar : solidification au scroll ---- */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const onScroll = () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
                navbar.classList.remove('navbar--transparent');
            } else {
                navbar.classList.remove('scrolled');
                if (navbar.dataset.transparent !== 'false') {
                    navbar.classList.add('navbar--transparent');
                }
            }
        };
        // Mémorise si la navbar démarre transparente (pages avec hero)
        navbar.dataset.transparent = navbar.classList.contains('navbar--transparent') ? 'true' : 'false';
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- Menu mobile ---- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const open = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', String(open));
        });
        navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }));
    }

    /* ---- Anti-spam : reconstruit les emails au clic ---- */
    document.querySelectorAll('.email-link').forEach(el => {
        const user = el.dataset.user;
        const domain = el.dataset.domain;
        if (!user || !domain) return;
        const address = user + '@' + domain;
        el.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'mailto:' + address;
        }, { once: false });
        el.textContent = address;
        el.setAttribute('href', 'mailto:' + address);
    });

    /* ---- Filtres galerie ---- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            galleryItems.forEach(item => {
                const show = filter === 'all' || item.dataset.category === filter;
                item.style.display = show ? '' : 'none';
            });
        });
    });

    /* ---- Formulaire intelligent : sections conditionnelles ---- */
    const intention = document.getElementById('intention');
    const sections = document.querySelectorAll('.conditional-section');
    if (intention) {
        intention.addEventListener('change', () => {
            sections.forEach(s => { s.hidden = true; });
            const target = document.getElementById('section-' + intention.value);
            if (target) target.hidden = false;
        });
    }

    /* ---- Soumission du formulaire (Formspree, sans rechargement) ---- */
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (status) { status.className = 'form-status'; status.textContent = ''; }

            // Garde-fou si Formspree n'est pas encore configuré
            if (form.action.includes('YOUR_FORM_ID')) {
                showStatus('error', "Le formulaire n'est pas encore connecté. Configurez Formspree (voir le commentaire dans index.html) ou écrivez-nous directement par email.");
                return;
            }

            const submitBtn = form.querySelector('[type="submit"]');
            const originalLabel = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours...'; }

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });
                if (response.ok) {
                    form.reset();
                    sections.forEach(s => { s.hidden = true; });
                    showStatus('success', 'Merci ! Votre demande a bien été envoyée. Nous vous recontactons sous 48h.');
                } else {
                    showStatus('error', "Une erreur est survenue. Réessayez ou écrivez-nous directement par email.");
                }
            } catch (err) {
                showStatus('error', "Impossible d'envoyer le formulaire. Vérifiez votre connexion ou écrivez-nous par email.");
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
            }
        });
    }

    function showStatus(type, message) {
        if (!status) { alert(message); return; }
        status.className = 'form-status ' + type;
        status.textContent = message;
        status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* ---- Scrollspy de la sous-navigation (page événement) ---- */
    const subnavLinks = document.querySelectorAll('.subnav-links a');
    if (subnavLinks.length && 'IntersectionObserver' in window) {
        const map = {};
        subnavLinks.forEach(a => {
            const id = a.getAttribute('href').slice(1);
            const section = document.getElementById(id);
            if (section) map[id] = a;
        });
        const spy = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    subnavLinks.forEach(a => a.classList.remove('active'));
                    if (map[entry.target.id]) map[entry.target.id].classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        Object.keys(map).forEach(id => spy.observe(document.getElementById(id)));
    }

    /* ---- Animations au scroll (reveal) ---- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }
});

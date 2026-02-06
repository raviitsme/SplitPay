function animateCardsOnScroll(sectionSelector, cardSelector, stagger = 150) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const cards = section.querySelectorAll(cardSelector);
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('show');
                    }, index * stagger);
                });
                observer.unobserve(section);
            }
        });
    }, {
        root: null,
        rootMargin: "-50px 0px -50px 0px",
        threshold: 0.5
    });

    observer.observe(section);
}

animateCardsOnScroll('#how-it-works', '.step-card');
animateCardsOnScroll('#features', '.feature-card');

const ctaButtons = document.querySelectorAll('.cta-btn');

ctaButtons.forEach(btn => btn.addEventListener('click', () => {
    window.location.href = '../Auth/index.html'
}));
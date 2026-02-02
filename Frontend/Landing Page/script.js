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
                        card.classList.add('show'); // ✅ FIXED
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


// Calls
animateCardsOnScroll('#how-it-works', '.step-card');
animateCardsOnScroll('#features', '.feature-card');

const section = document.getElementById('how-it-works');
const btn = document.querySelector('.secondary-btn');

btn.addEventListener('click', e => {
    e.preventDefault(); // prevent default jump
    section.scrollIntoView({ behavior: 'smooth' });
});

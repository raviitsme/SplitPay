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
const registerModal = document.querySelector('.register-modal');
const closeBtn = document.querySelector('.close-btn');

// OPEN
ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        registerModal.classList.add('active');
    });
});

// CLOSE when clicking outside
registerModal.addEventListener('click', (e) => {
    if (e.target === registerModal) {
        closeModal();
    }
});

closeBtn.addEventListener('click', () => {
    closeModal();
})

// CLOSE on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

function closeModal() {
    registerModal.classList.remove('active');
}

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('msg');

    if(!name || !email || !password) {
        msg.style.color = 'red';
        msg.innerText = 'Please fill all fields!'
    }
    setTimeout(() => {
        msg.innerText = '';
    }, 1800)
    try {
        const response = await fetch('http://localhost:3000/authentication/register', {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if(!result.success) {
            msg.innerText = result.message;
        } 

        msg.style.color = 'green'
        msg.innerText = 'Registered Successfully, Login now';
        setTimeout(() => {
            closeModal();
        }, 2500);

    } catch (err) {
        console.error("Error : ", err);
    }

})
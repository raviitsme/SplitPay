const themeBtn = document.querySelector('.theme');

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    });
}

const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.querySelector('.page-title');

menuItems.forEach(item => {
    item.addEventListener('click', () => {

        // sidebar active
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // hide all pages
        pages.forEach(page => page.classList.remove('active'));

        // show selected page
        const target = item.dataset.page;
        document.getElementById(target).classList.add('active');

        // update title
        pageTitle.textContent = item.textContent.trim();
    });
});

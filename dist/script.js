document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const year = document.querySelector('[data-year]');

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
};

if (year) year.textContent = new Date().getFullYear();
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px' },
);

revealItems.forEach((item) => revealObserver.observe(item));

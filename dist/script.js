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

const motionCard = document.querySelector('[data-motion-card]');
const motionShell = motionCard?.querySelector('.image-shell');
const motionImage = motionCard?.querySelector('[data-motion-image]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (motionCard && motionShell && motionImage && !reduceMotion.matches) {
  let ticking = false;

  const updateParallax = () => {
    const rect = motionCard.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const cardCenter = rect.top + rect.height / 2;
    const distance = Math.max(-1, Math.min(1, (cardCenter - viewportCenter) / window.innerHeight));
    motionImage.style.setProperty('--parallax', `${distance * -22}px`);
    ticking = false;
  };

  const queueParallax = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  };

  motionCard.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = motionCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    motionShell.style.setProperty('--tilt-x', `${(x - 0.5) * 6}deg`);
    motionShell.style.setProperty('--tilt-y', `${(0.5 - y) * 6}deg`);
    motionShell.style.setProperty('--pointer-x', `${x * 100}%`);
    motionShell.style.setProperty('--pointer-y', `${y * 100}%`);
  });

  motionCard.addEventListener('pointerleave', () => {
    motionShell.style.setProperty('--tilt-x', '0deg');
    motionShell.style.setProperty('--tilt-y', '0deg');
    motionShell.style.setProperty('--pointer-x', '50%');
    motionShell.style.setProperty('--pointer-y', '50%');
  });

  updateParallax();
  window.addEventListener('scroll', queueParallax, { passive: true });
  window.addEventListener('resize', queueParallax);
}

document.querySelectorAll('[role="tablist"]').forEach((tabList) => {
  const tabContainer = tabList.closest('.concept-tabs');
  const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const panels = Array.from(tabContainer?.querySelectorAll('[role="tabpanel"]') ?? []);

  const activateTab = (nextTab, moveFocus = false) => {
    tabs.forEach((tab) => {
      const isActive = tab === nextTab;
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    panels.forEach((panel) => {
      panel.hidden = panel.id !== nextTab.getAttribute('aria-controls');
    });

    if (moveFocus) nextTab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;

      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;

      if (nextIndex !== index || event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        activateTab(tabs[nextIndex], true);
      }
    });
  });
});


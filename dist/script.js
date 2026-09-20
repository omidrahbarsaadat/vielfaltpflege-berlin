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

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const menuButton = document.querySelector('.menu-toggle');
const drawer = document.querySelector('.menu-drawer');

// A native dialog provides keyboard focus containment and an inert background.
// Without JavaScript, the ordinary navigation links remain available.
if (menuButton && drawer && typeof drawer.showModal === 'function') {
  root.classList.add('has-menu');
  menuButton.hidden = false;
  let closingTimer;

  function closeMenu(immediate = false) {
    if (!drawer.open) return;
    clearTimeout(closingTimer);
    if (immediate || reducedMotion.matches) {
      drawer.close();
    } else {
      drawer.classList.add('is-closing');
      closingTimer = setTimeout(() => drawer.close(), 260);
    }
  }

  menuButton.addEventListener('click', () => {
    hideProjectCursor();
    clearTimeout(closingTimer);
    drawer.classList.remove('is-closing');
    drawer.showModal();
    root.classList.add('menu-open');
    menuButton.setAttribute('aria-expanded', 'true');
  });
  drawer.querySelector('.menu-close').addEventListener('click', () => closeMenu());
  drawer.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeMenu();
  });
  drawer.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = drawer.querySelectorAll('button, a[href]');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  drawer.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu(true);
    if (event.target === drawer) {
      const bounds = drawer.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeMenu();
    }
  });
  drawer.addEventListener('close', () => {
    hideProjectCursor();
    clearTimeout(closingTimer);
    drawer.classList.remove('is-closing');
    root.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
  window.addEventListener('pagehide', () => closeMenu(true));
}

// Motion is progressive enhancement: the page is readable before this runs.
const revealTargets = document.querySelectorAll('.section-intro, .rth-feature, .project-meta, .project-visual, .project-copy, .archive > h2, .archive-list li, .about-copy, .experience li, .contact-heading, .case-facts, .case-system, .contributions > div, .contributions li, .engineering-focus, .case-cta');
let revealObserver;

function setMotionPreference() {
  root.classList.toggle('motion-ready', !reducedMotion.matches);
  revealObserver?.disconnect();
  if (reducedMotion.matches) {
    if (drawer?.classList.contains('is-closing')) drawer.close();
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
    revealTargets.forEach((element) => {
      element.classList.add('reveal');
      revealObserver.observe(element);
    });
  }
  document.querySelectorAll('.circle-arrow').forEach((element) => element.style.removeProperty('translate'));
  hideProjectCursor();
  updateScroll();
}

// Only update scroll-linked elements once per frame; native scrolling stays intact.
const portrait = document.querySelector('.portrait');
const heroName = document.querySelector('.hero-name');
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);
let scrollFrame = 0;

function updateScroll() {
  scrollFrame = 0;
  const scrollTop = Math.max(0, window.scrollY);
  root.classList.toggle('is-scrolled', scrollTop > 160);
  const availableScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${availableScroll > 0 ? Math.min(1, scrollTop / availableScroll) : 0})`;
  const offset = !reducedMotion.matches && finePointer.matches ? Math.min(scrollTop, 700) : 0;
  portrait?.style.setProperty('--portrait-y', `${Math.min(offset * 0.035, 22)}px`);
  heroName?.style.setProperty('--name-x', `${Math.min(offset * 0.025, 16)}px`);
}

function scheduleScroll() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  hideProjectCursor();
}
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
window.addEventListener('pageshow', scheduleScroll);

// Magnetic movement stays within the link's hit area and is disabled on touch.
document.querySelectorAll('.circle-arrow').forEach((circle) => {
  const link = circle.closest('a');
  if (!link) return;
  let bounds;
  link.addEventListener('pointerenter', () => { bounds = circle.getBoundingClientRect(); });
  link.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || !finePointer.matches || !bounds) return;
    const x = Math.max(-14, Math.min(14, (event.clientX - bounds.left - bounds.width / 2) * 0.16));
    const y = Math.max(-14, Math.min(14, (event.clientY - bounds.top - bounds.height / 2) * 0.16));
    circle.style.translate = `${x}px ${y}px`;
  });
  link.addEventListener('pointerleave', () => circle.style.removeProperty('translate'));
});

// The project cue follows the real pointer without replacing the native cursor.
const projectCursor = document.createElement('div');
projectCursor.className = 'project-cursor';
projectCursor.setAttribute('aria-hidden', 'true');
document.body.append(projectCursor);
let cursorTarget = null;
let cursorFrame = 0;
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

function hideProjectCursor() {
  projectCursor.classList.remove('is-active');
  cursorTarget = null;
  cancelAnimationFrame(cursorFrame);
  cursorFrame = 0;
}

function moveProjectCursor() {
  cursorFrame = 0;
  currentX += (targetX - currentX) * 0.22;
  currentY += (targetY - currentY) * 0.22;
  projectCursor.style.left = `${currentX}px`;
  projectCursor.style.top = `${currentY}px`;
  if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.5) cursorFrame = requestAnimationFrame(moveProjectCursor);
}

document.addEventListener('pointermove', (event) => {
  if (reducedMotion.matches || !finePointer.matches || drawer?.open) return;
  const target = event.target.closest('[data-cursor]');
  if (!target) return hideProjectCursor();
  targetX = Math.max(60, Math.min(window.innerWidth - 60, event.clientX));
  targetY = Math.max(60, Math.min(window.innerHeight - 60, event.clientY));
  if (target !== cursorTarget) {
    cursorTarget = target;
    projectCursor.textContent = target.dataset.cursor;
    currentX = targetX;
    currentY = targetY;
    projectCursor.style.left = `${currentX}px`;
    projectCursor.style.top = `${currentY}px`;
    projectCursor.classList.add('is-active');
  }
  if (!cursorFrame) cursorFrame = requestAnimationFrame(moveProjectCursor);
}, { passive: true });
document.addEventListener('pointerout', (event) => { if (!event.relatedTarget) hideProjectCursor(); });
window.addEventListener('blur', hideProjectCursor);
finePointer.addEventListener('change', () => {
  hideProjectCursor();
  document.querySelectorAll('.circle-arrow').forEach((element) => element.style.removeProperty('translate'));
  updateScroll();
});
reducedMotion.addEventListener('change', setMotionPreference);
setMotionPreference();

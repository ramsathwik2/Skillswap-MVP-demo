// app.js (vanilla, minimal, fast)


// ----- motion preference -----
const prefersReducedMotion =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;


// ----- Menu -----
(() => {
  const btn = document.querySelector(".menuBtn");
  const overlay = document.querySelector(".menuOverlay");
  const panel = document.querySelector(".menuPanel");
  const closeBtn = document.querySelector(".menuClose");


  if (!btn || !overlay) return;


  // Ensure initial a11y state
  btn.setAttribute("aria-expanded", "false");


  // Basic focus trap (minimal but effective)
  const getFocusables = () => {
    const root = panel || overlay;
    if (!root) return [];
    return Array.from(
      root.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  };


  let lastActive = null;


  const open = () => {
    lastActive = document.activeElement;
    overlay.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  };


  const close = () => {
    overlay.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    (lastActive instanceof HTMLElement ? lastActive : btn).focus();
  };


  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    if (isOpen) close();
    else open();
  });


  closeBtn?.addEventListener("click", close);


  // Click outside panel closes
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });


  // ESC closes + Tab traps focus when open
  window.addEventListener("keydown", (e) => {
    if (overlay.hidden) return;


    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }


    if (e.key !== "Tab") return;


    const focusables = getFocusables();
    if (!focusables.length) return;


    const first = focusables[0];
    const last = focusables[focusables.length - 1];


    // If Shift+Tab on first -> wrap to last
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
      return;
    }


    // If Tab on last -> wrap to first
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();


// ----- Cards rail (scroll + snap assist) -----
(() => {
  const rail = document.querySelector(".cardsRail");
  if (!rail) return;


  const btnPrev = document.querySelector(".railBtn.prev");
  const btnNext = document.querySelector(".railBtn.next");


  const cards = () => Array.from(rail.querySelectorAll(".card"));


  const getStep = () => {
    const first = cards()[0];
    if (!first) return 360;


    const style = getComputedStyle(rail);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;


    return first.getBoundingClientRect().width + gap;
  };


  const scrollByCards = (dir) => {
    const step = getStep() * dir;
    rail.scrollBy({
      left: step,
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };


  btnPrev?.addEventListener("click", () => scrollByCards(-1));
  btnNext?.addEventListener("click", () => scrollByCards(1));


  // Vertical wheel => horizontal scroll when cursor is over the rail
  rail.addEventListener(
    "wheel",
    (e) => {
      const dominantVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
      if (!dominantVertical) return;


      e.preventDefault();
      rail.scrollLeft += e.deltaY * 1.1;
    },
    { passive: false }
  );


  // Keyboard support
  if (!rail.hasAttribute("tabindex")) rail.setAttribute("tabindex", "0");


  rail.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") scrollByCards(1);
    if (e.key === "ArrowLeft") scrollByCards(-1);
  });
})();
/* ===== FORCE MENU BEHAVIOR (paste under your current code) ===== */
(() => {
  const btn = document.querySelector(".menuBtn");
  const overlay = document.querySelector(".menuOverlay");
  const closeBtn = document.querySelector(".menuClose");
  if (!btn || !overlay || !closeBtn) return;


  const open = () => {
    overlay.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };


  const close = () => {
    overlay.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };


  // OPEN only from hamburger (capture phase, kill other handlers)
  btn.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); // stops duplicate handlers on same element [web:71]
      if (overlay.hidden) open();
    },
    true
  );


  // CLOSE only from close button (capture phase, kill other handlers)
  closeBtn.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); // stops duplicate handlers on same element [web:71]
      close();
      btn.focus();
    },
    true
  );


  // If old code closes on overlay click, block it.
  overlay.addEventListener(
    "click",
    (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      // do nothing on overlay click
    },
    true
  );


  // If old code closes on Escape, block it.
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Escape") return;
      if (overlay.hidden) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      // do nothing on Escape
    },
    true
  );
})();
/* ===== MENU CLOSE FIX: force close button to always work ===== */
(() => {
  const btn = document.querySelector(".menuBtn");
  const overlay = document.querySelector(".menuOverlay");
  const closeBtn = document.querySelector(".menuClose");
  if (!btn || !overlay || !closeBtn) return;


  const close = () => {
    overlay.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    btn.focus();
  };


  closeBtn.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); // prevents other listeners blocking close [web:112]
      close();
    },
    true
  );
})();
window.addEventListener("click", (e) => console.log("clicked:", e.target), true);
/* ===== MENU HARD FIX (delegation) ===== */
(() => {
  const overlay = document.querySelector(".menuOverlay");
  const btn = document.querySelector(".menuBtn");
  if (!overlay || !btn) return;


  const open = () => {
    overlay.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };


  const close = () => {
    overlay.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };


  // Open only when hamburger is pressed
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    open();
  });


  // Close ONLY when the close button is pressed (any element with .menuClose)
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;


      if (t.closest(".menuClose")) {
        e.preventDefault();
        close();
        btn.focus();
      }
    },
    true
  );
})();
/* ===== MENU OVERRIDE (PASTE AT VERY BOTTOM) ===== */
(() => {
  const btn = document.querySelector(".menuBtn");
  const overlay = document.querySelector(".menuOverlay");
  const closeBtn = document.querySelector(".menuClose");
  if (!btn || !overlay || !closeBtn) return;


  // start closed
  overlay.hidden = true;
  btn.setAttribute("aria-expanded", "false");


  const open = () => {
    overlay.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };


  const close = () => {
    overlay.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    btn.focus();
  };


  // Kill any other handlers by capturing first and stopping propagation
  btn.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); // blocks other listeners on same element [web:112]
      open();
    },
    true
  );


  closeBtn.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); // blocks other listeners on same element [web:112]
      close();
    },
    true
  );
})();
/* ===== MENU: FORCE CLOSED ON LOAD (ADD) ===== */
(() => {
  const overlay = document.querySelector(".menuOverlay");
  const btn = document.querySelector(".menuBtn");
  if (!overlay || !btn) return;


  overlay.hidden = true;
  btn.setAttribute("aria-expanded", "false");
})();
/* ===== MENU: CLASS TOGGLE (ADD) ===== */
(() => {
  const btn = document.querySelector(".menuBtn");
  const overlay = document.querySelector(".menuOverlay");
  const closeBtn = document.querySelector(".menuClose");
  if (!btn || !overlay || !closeBtn) return;


  const open = () => {
    overlay.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };


  const close = () => {
    overlay.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    btn.focus();
  };


  // open only from hamburger
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    open();
  });


  // close only from close button
  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    close();
  });
})();
/* ===== STACK CARDS: active state (ADD) ===== */
(() => {
  const cards = Array.from(document.querySelectorAll("[data-stack]"));
  if (!cards.length) return;


  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cards.forEach((c) => c.classList.remove("is-active"));
          entry.target.classList.add("is-active");
        }
      });
    },
    { threshold: 0.6 }
  );


  cards.forEach((c) => obs.observe(c));
})();
// Hamburger menu toggle
const menuBtn = document.querySelector('.menuBtn');
const menuOverlay = document.querySelector('.menuOverlay');
const menuClose = document.querySelector('.menuClose');
const menu = document.querySelector('#menu');


menuBtn.addEventListener('click', () => {
  menuOverlay.hidden = false;
  menuBtn.setAttribute('aria-expanded', 'true');
});


menuClose.addEventListener('click', () => {
  menuOverlay.hidden = true;
  menuBtn.setAttribute('aria-expanded', 'false');
});


// Close menu when clicking outside
menuOverlay.addEventListener('click', (e) => {
  if (e.target === menuOverlay) {
    menuOverlay.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

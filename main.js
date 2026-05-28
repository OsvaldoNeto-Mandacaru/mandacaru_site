/* ===========================
   CRÔNICAS DE MANDACARU
   main.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll behaviour ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger children if multiple in same parent batch
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80; // slight stagger per group
    revealObserver.observe(el);
  });

  /* ---- Screenshot upload placeholders ---- */
  document.querySelectorAll('.screenshot-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        // Remove placeholder content
        slot.querySelectorAll('.slot-icon, .slot-text').forEach(el => el.remove());
        // Add image
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Screenshot do jogo';
        slot.appendChild(img);
      };
      input.click();
    });
  });

  /* ---- Active nav link highlight on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle(
            'active',
            a.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---- Pixel cursor trail (fun easter egg) ---- */
  const trail = [];
  const TRAIL_LEN = 6;
  const COLORS = ['#F5A623','#E8622A','#F7C948','#7B4F9E','#3A6B35'];

  for (let i = 0; i < TRAIL_LEN; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      width:6px; height:6px;
      background:${COLORS[i % COLORS.length]};
      opacity:${1 - i / TRAIL_LEN};
      image-rendering:pixelated;
      transition: left 0.04s, top 0.04s;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const tickTrail = () => {
    trail[0].x = mx; trail[0].y = my;
    for (let i = 1; i < TRAIL_LEN; i++) {
      trail[i].x += (trail[i-1].x - trail[i].x) * 0.45;
      trail[i].y += (trail[i-1].y - trail[i].y) * 0.45;
    }
    trail.forEach(t => {
      t.el.style.left = (t.x - 3) + 'px';
      t.el.style.top  = (t.y - 3) + 'px';
    });
    requestAnimationFrame(tickTrail);
  };
  tickTrail();

});
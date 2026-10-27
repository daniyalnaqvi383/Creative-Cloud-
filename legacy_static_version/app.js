/**
 * CREATIVE CLOUD - SOCIAL MEDIA AGENCY INTERACTION ENGINE
 * SaaS-Style Micro-Interactions, Ambient Mouse Spotlight,
 * Parallax Scroll Physics, 3D Card Tilt, Interactive Scheduler, Custom Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnhancedCursor();
  initGlobalMouseGlow();
  initDynamicSpotlights();
  init3DTilt();
  initMagneticButtons();
  initHeroCanvas();
  initScrollAnimations();
  initParallaxFloating();
  initKpiCounters();
  initPortfolioFilter();
  initMeetingScheduler();
  initCaseStudyModal();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. ENHANCED CUSTOM CURSOR WITH SPRING PHYSICS
   -------------------------------------------------------------------------- */
function initEnhancedCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const follower = document.querySelector('.custom-cursor-follower');
  if (!dot || !follower) return;

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768) {
    dot.style.display = 'none';
    follower.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      dot.style.opacity = '1';
      follower.style.opacity = '1';
      isVisible = true;
    }

    // Direct instant update for center dot
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Spring animation loop for trailing follower
  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Link & Button hover states
  const interactives = document.querySelectorAll('a, button, .date-pill-btn, .time-pill-btn, .tab-btn, input, textarea');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovering-link'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovering-link'));
  });

  // Project Card hover states (shows "WATCH" inside expanded cursor)
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      follower.classList.add('hovering-project');
      const badge = follower.querySelector('.cursor-badge');
      if (badge) badge.textContent = 'WATCH';
    });
    card.addEventListener('mouseleave', () => {
      follower.classList.remove('hovering-project');
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    follower.style.opacity = '0';
    isVisible = false;
  });
}

/* --------------------------------------------------------------------------
   2. GLOBAL AMBIENT MOUSE GLOW TRACKER
   -------------------------------------------------------------------------- */
function initGlobalMouseGlow() {
  const glow = document.querySelector('.global-mouse-glow');
  if (!glow || window.innerWidth < 768) return;

  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let targetX = glowX;
  let targetY = glowY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function updateGlow() {
    glowX += (targetX - glowX) * 0.1;
    glowY += (targetY - glowY) * 0.1;

    glow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
    requestAnimationFrame(updateGlow);
  }
  requestAnimationFrame(updateGlow);
}

/* --------------------------------------------------------------------------
   3. DYNAMIC CARD SPOTLIGHTS
   -------------------------------------------------------------------------- */
function initDynamicSpotlights() {
  const cards = document.querySelectorAll('.spotlight-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   4. 3D TILT EFFECT WITH DEPTH
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  if (!tiltElements.length || window.innerWidth < 1024) return;

  tiltElements.forEach(el => {
    const maxTilt = parseFloat(el.getAttribute('data-tilt-max') || '14');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* --------------------------------------------------------------------------
   5. MAGNETIC BUTTONS (ELASTIC PULL)
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  if (!magneticButtons.length || window.innerWidth < 768) return;

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   6. HERO PARTICLE CANVAS
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 48 : 22, 60);
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    const heroRect = canvas.getBoundingClientRect();
    if (e.clientY <= heroRect.bottom) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2.2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(244, 63, 94, ' : 'rgba(168, 85, 247, ';
      this.alpha = Math.random() * 0.5 + 0.25;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push/pull
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(244, 63, 94, ${(1 - dist / 115) * 0.2})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
}

/* --------------------------------------------------------------------------
   7. ENHANCED SCROLL PROGRESS & REVEALS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollTop > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // IntersectionObserver for elements with .reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   8. PARALLAX FLOATING ELEMENTS ON SCROLL
   -------------------------------------------------------------------------- */
function initParallaxFloating() {
  const parallaxItems = document.querySelectorAll('.parallax-float');
  if (!parallaxItems.length || window.innerWidth < 1024) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxItems.forEach(item => {
      const speed = parseFloat(item.getAttribute('data-speed') || '0.12');
      item.style.transform = `translateY(${-(scrollY * speed)}px)`;
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   9. LIVE KPI NUMERICAL COUNTERS
   -------------------------------------------------------------------------- */
function initKpiCounters() {
  const counters = document.querySelectorAll('[data-counter-target]');
  if (!counters.length) return;

  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter-target'));
        const prefix = el.getAttribute('data-counter-prefix') || '';
        const suffix = el.getAttribute('data-counter-suffix') || '';
        const isDecimal = target % 1 !== 0;

        let current = 0;
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

          current = target * easeProgress;
          el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.round(current)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${isDecimal ? target.toFixed(1) : target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => countObserver.observe(c));
}

/* --------------------------------------------------------------------------
   10. PORTFOLIO FILTER TABS
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const tabs = document.querySelectorAll('.portfolio-tabs .tab-btn');
  const projects = document.querySelectorAll('.portfolio-grid .project-card');

  if (!tabs.length || !projects.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      projects.forEach(project => {
        const category = project.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          project.style.display = 'block';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'translateY(20px) scale(0.96)';
          setTimeout(() => {
            project.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. INTERACTIVE MEETING & PHONE CALL SCHEDULER
   -------------------------------------------------------------------------- */
function initMeetingScheduler() {
  const dateBtns = document.querySelectorAll('.date-pill-btn');
  const timeBtns = document.querySelectorAll('.time-pill-btn');
  const scheduleForm = document.getElementById('meetingScheduleForm');
  const selectedDateInput = document.getElementById('selectedDateInput');
  const selectedTimeInput = document.getElementById('selectedTimeInput');

  dateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dateBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (selectedDateInput) {
        selectedDateInput.value = btn.getAttribute('data-date');
      }
    });
  });

  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (selectedTimeInput) {
        selectedTimeInput.value = btn.getAttribute('data-time');
      }
    });
  });

  if (!scheduleForm) return;

  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = scheduleForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const chosenDate = selectedDateInput ? selectedDateInput.value : 'Tomorrow';
    const chosenTime = selectedTimeInput ? selectedTimeInput.value : '2:00 PM';
    const name = document.getElementById('schedName')?.value || 'Friend';
    const phone = document.getElementById('schedPhone')?.value || '';

    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Reserving Your Slot...
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Meeting Confirmed!
      `;
      submitBtn.style.background = '#10b981';

      setTimeout(() => {
        alert(`🎉 Strategy Call Booked!\n\nHey ${name}, your 15-minute social media growth audit is scheduled for ${chosenDate} at ${chosenTime}.\n\nOur creative director will call you at ${phone || 'your provided number'}. Calendar invite dispatched to your email!`);
        scheduleForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 700);
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   12. CASE STUDY / CAMPAIGN BREAKDOWN MODAL
   -------------------------------------------------------------------------- */
function initCaseStudyModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalMetrics = document.getElementById('modalMetrics');
  const modalStack = document.getElementById('modalStack');

  if (!modal) return;

  const campaignDetails = {
    '1': {
      title: 'LuxeAura Skincare &bull; Viral TikTok & Reels Launch',
      category: 'Short-Form Video &bull; TikTok Shop',
      desc: 'Engineered a 60-day short-form video sprint focusing on aesthetic ASMR textures, direct skincare routine hooks, and organic micro-influencer product seedings. Generated over 42M organic views with zero initial ad spend.',
      metrics: '42.8M Organic Views &bull; 8.4x ROAS on TikTok Shop &bull; 140k New Instagram Followers',
      stack: ['TikTok Algorithm Pacing', '4K Macro Production', 'ASMR Audio Design', 'Influencer Seeding', 'UGC Ads']
    },
    '2': {
      title: 'Volt Energy Drink &bull; Complete Social Brand Rebrand',
      category: 'Brand Makeover &bull; Content Series',
      desc: 'Took an emerging beverage brand from stale graphics to an electric, dopamine-fueled social media presence. Created a 30-day continuous skit series featuring creator talent and streetwear aesthetic.',
      metrics: '0 to 180k Followers in 60 Days &bull; 18.2M Impressions &bull; Sold Out 3 Batches',
      stack: ['Brand Direction', 'Scriptwriting', 'Comedy Skits', 'Visual Identity', 'Instagram Grids']
    },
    '3': {
      title: 'Kinetix Fitness App &bull; Paid UGC Creative Sprint',
      category: 'Paid Social Ads &bull; Performance Creative',
      desc: 'Produced 45 modular UGC video creatives with 15 unique hooks testing emotional pain points and fitness gamification. Identified 3 winning creative angles that scaled ad spend from $5k/day to $35k/day profitably.',
      metrics: '-54% Customer Acquisition Cost (CAC) &bull; $1.4M App Installs &bull; 4.8★ Rating',
      stack: ['Meta Ads Creative', 'TikTok Spark Ads', 'Direct Response Scripting', 'A/B Hook Testing']
    },
    '4': {
      title: 'Founders Pod &bull; High-Retention Shorts Strategy',
      category: 'Podcast Repurposing &bull; YouTube Shorts',
      desc: 'Transformed 2-hour longform podcast discussions into hyper-retention 45-second vertical clips with dynamic captions, audio sound effects, and kinetic zoom transitions.',
      metrics: '14.5M Shorts Views &bull; +85k YouTube Subscribers &bull; Featured by TechCrunch',
      stack: ['Dynamic Subtitles', 'Sound FX Design', 'Pacing Optimization', 'Multi-Platform Distribution']
    }
  };

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-project-id');
      const data = campaignDetails[id];
      if (data) {
        modalTitle.innerHTML = data.title;
        modalCategory.textContent = data.category;
        modalDesc.textContent = data.desc;
        modalMetrics.innerHTML = `<strong>Campaign Results:</strong> ${data.metrics}`;
        
        modalStack.innerHTML = '';
        data.stack.forEach(tech => {
          const span = document.createElement('span');
          span.className = 'service-tag';
          span.textContent = tech;
          modalStack.appendChild(span);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* --------------------------------------------------------------------------
   13. MOBILE MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeDrawer() {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));
}

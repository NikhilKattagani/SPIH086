/* ═══════════════════════════════════════════════════════════
   RISKRADAR — Script
   ═══════════════════════════════════════════════════════════ */

/* ── Centralized Risk Data (Changes #6, #8) ────────────── */
const riskData = {
  asset: "Pump P-102",
  score: 87,
  level: "HIGH",
  failureCount: 4,
  maintenanceDelay: 35,
  temperatureAnomaly: true,
  inspectionConcern: true,
  factors: [
    { name: "Previous Failures", detail: "4 incidents",  severity: "red",    barWidth: 85 },
    { name: "Overdue Maintenance", detail: "35 days",    severity: "orange", barWidth: 70 },
    { name: "Temperature Anomaly", detail: "Above range", severity: "red",   barWidth: 75 },
    { name: "Inspection Concern",  detail: "Flagged",     severity: "orange", barWidth: 55 }
  ],
  actions: [
    { priority: "CRITICAL", label: "Immediate physical inspection of Pump P-102" },
    { priority: "HIGH",     label: "Schedule preventive maintenance within 48 hours" },
    { priority: "MEDIUM",   label: "Calibrate temperature sensors and verify readings" },
    { priority: "MONITOR",  label: "Increase monitoring frequency until risk reduces" }
  ]
};

const priorityRanking = [
  { rank: 1, asset: "Pump P-102",      score: 87, level: "HIGH",   action: "Immediate Inspection" },
  { rank: 2, asset: "Boiler B-201",    score: 81, level: "HIGH",   action: "Priority Maintenance" },
  { rank: 3, asset: "Compressor C-104", score: 64, level: "MEDIUM", action: "Scheduled Review" },
  { rank: 4, asset: "Tank T-301",      score: 52, level: "MEDIUM", action: "Monitor Closely" }
];

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile hamburger menu ───────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ── Smooth scroll for anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Intersection Observer — viewport entry animations ─ */
  const animElements = document.querySelectorAll('.anim-in');
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  animElements.forEach(el => animObserver.observe(el));

  /* ── Risk score counter animation ────────────────────── */
  function animateScore(numEl, fillEl, targetScore, circumference) {
    const duration = 1500;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * targetScore);

      numEl.textContent = current;

      const offset = circumference - (eased * targetScore / 100) * circumference;
      fillEl.style.strokeDashoffset = offset;

      // Color based on score
      const color = current >= 75 ? '#ff4d4d' : current >= 50 ? '#ff9f1c' : '#00c853';
      fillEl.style.stroke = color;

      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Hero risk score — now data-driven (Change #7)
  const heroScoreObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl  = document.getElementById('heroScoreNum');
        const fillEl = document.getElementById('heroScoreFill');
        // r=52, circumference = 2*PI*52 ≈ 326.73
        animateScore(numEl, fillEl, riskData.score, 326.73);
        heroScoreObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  heroScoreObserver.observe(document.getElementById('heroRiskCard'));

  // Intelligence section risk score — now data-driven (Change #7)
  const intelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl  = document.getElementById('intelScoreNum');
        const fillEl = document.getElementById('intelScoreFill');
        // r=68, circumference = 2*PI*68 ≈ 427.26
        animateScore(numEl, fillEl, riskData.score, 427.26);

        // Also trigger factor bar animation by adding visible class
        entry.target.classList.add('visible');

        intelObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  const intelPanel = document.querySelector('.intelligence-panel');
  if (intelPanel) intelObserver.observe(intelPanel);

  // Pipeline fill animation
  const pipelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        pipelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const pipeline = document.querySelector('.pipeline');
  if (pipeline) pipelineObserver.observe(pipeline);

  /* ── Staggered animation for grids ───────────────────── */
  document.querySelectorAll('.features-grid .feature-card, .data-sources-grid .data-source-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
  });

});
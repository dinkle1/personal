/* ============================================================
   MAIN.JS — Shahak Livne-Tarandach Personal Website
   ============================================================ */

// ── Nav scroll effect ──────────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Sticky section nav active state (research page) ────────
const sectionNav = document.getElementById('sectionNav');
if (sectionNav) {
  const snavBtns = sectionNav.querySelectorAll('.snav-btn');

  snavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const el = document.getElementById(target);
      if (el) {
        const offset = 120;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Highlight active section on scroll
  const sections = Array.from(document.querySelectorAll('.r-section'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        snavBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.target === id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ── Scroll reveal ──────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .cn-item, .bt-item, .method-card, .result-block, .disc-item, .impl-card, .closing-quote, .limitations, .mt-row').forEach(el => {
  revealObserver.observe(el);
});

// ── Animated comparison bars ───────────────────────────────
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.comp-bar').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.comparison-bar-wrap').forEach(el => barObserver.observe(el));

// ── Charts (research page only) ────────────────────────────
if (typeof Chart !== 'undefined') {

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = '#9a9a9a';

  const gridColor = 'rgba(0,0,0,0.05)';
  const maleColor = '#9a9a9a';
  const femaleColor = '#0a0a0a';

  // Helper: rounded bar chart defaults
  function barDefaults(labels, maleData, femaleData, yLabel) {
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Male',
            data: maleData,
            backgroundColor: maleColor,
            borderRadius: 2,
          },
          {
            label: 'Female',
            data: femaleData,
            backgroundColor: femaleColor,
            borderRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
          tooltip: { bodyFont: { size: 11 } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: {
            grid: { color: gridColor },
            ticks: { font: { size: 10 } },
            title: { display: !!yLabel, text: yLabel, font: { size: 10 } },
          },
        },
      },
    };
  }

  // ── Anxiety Chart: Zone 1 time ──────────────────────────
  const anxietyCanvas = document.getElementById('anxietyChart');
  if (anxietyCanvas) {
    new Chart(anxietyCanvas, {
      type: 'bar',
      data: {
        labels: ['Zone 1 Time (s)', 'Zone 1 Entries'],
        datasets: [
          {
            label: 'Male',
            data: [215.23, 3.87],
            backgroundColor: maleColor,
            borderRadius: 2,
          },
          {
            label: 'Female',
            data: [210.81, 3.90],
            backgroundColor: femaleColor,
            borderRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              afterBody: () => ['No significant difference (p > .05)'],
            },
          },
          title: { display: true, text: 'Anxiety Measures — Zone 1', font: { size: 12 }, color: '#555' },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { grid: { color: gridColor }, ticks: { font: { size: 10 } } },
        },
      },
    });
  }

  // ── Weekly Oxycodone Chart ──────────────────────────────
  const oxyCanvas = document.getElementById('oxyWeeklyChart');
  if (oxyCanvas) {
    const weeks = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'];
    // Approximate weekly means based on paper (escalating pattern, female ~2x male)
    const maleWeekly  = [0.58, 0.70, 0.82, 0.90, 1.00, 1.05, 1.10, 1.15];
    const femaleWeekly = [0.85, 1.10, 1.40, 1.70, 1.95, 2.10, 2.30, 2.45];

    new Chart(oxyCanvas, {
      type: 'line',
      data: {
        labels: weeks,
        datasets: [
          {
            label: 'Male',
            data: maleWeekly,
            borderColor: maleColor,
            backgroundColor: 'transparent',
            pointBackgroundColor: maleColor,
            pointRadius: 4,
            tension: 0.3,
            borderWidth: 2,
          },
          {
            label: 'Female',
            data: femaleWeekly,
            borderColor: femaleColor,
            backgroundColor: 'rgba(10,10,10,0.05)',
            pointBackgroundColor: femaleColor,
            pointRadius: 4,
            tension: 0.3,
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
          title: { display: true, text: 'Weekly Oxycodone Consumption (mg/kg)', font: { size: 12 }, color: '#555' },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: {
            grid: { color: gridColor },
            ticks: { font: { size: 10 } },
            title: { display: true, text: 'mg/kg', font: { size: 10 } },
          },
        },
      },
    });
  }

  // ── ENK Expression Chart ────────────────────────────────
  const enkCanvas = document.getElementById('enkChart');
  if (enkCanvas) {
    new Chart(enkCanvas, {
      type: 'bar',
      data: {
        labels: ['Male', 'Female'],
        datasets: [
          {
            label: 'ENK Expression (pg/mL)',
            data: [59.62, 85.15],
            backgroundColor: [maleColor, femaleColor],
            borderRadius: 3,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'ENK Expression in Ventral Pallidum (pg/mL)', font: { size: 12 }, color: '#555' },
          tooltip: {
            callbacks: {
              afterLabel: (ctx) => ctx.dataIndex === 0 ? 'SD ± 34.71' : 'SD ± 21.59',
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: {
            grid: { color: gridColor },
            ticks: { font: { size: 10 } },
            title: { display: true, text: 'pg/mL', font: { size: 10 } },
            min: 0,
            max: 130,
          },
        },
      },
    });
  }
}

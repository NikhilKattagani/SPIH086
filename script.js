/* ── Centralized API Config ────────────────────────────── */
const API_BASE_URL = "spih086-production.up.railway.app";

/* ── Centralized Risk Data (Fallback Demo Data) ────────── */
let riskData = {
  asset: "Pump P-102",
  score: 87,
  previousScore: 54,
  level: "HIGH",
  previousLevel: "MEDIUM",
  confidence: 82,
  dataQuality: 94,
  failureCount: 4,
  maintenanceDelay: 35,

  drivers: [
    { name: "Repeated failures", points: 25, severity: "CRITICAL" },
    { name: "Maintenance overdue", points: 20, severity: "HIGH" },
    { name: "Temperature anomaly", points: 20, severity: "HIGH" },
    { name: "Inspection concern", points: 15, severity: "MEDIUM" },
    { name: "Incident history", points: 7, severity: "LOW" }
  ],

  changes: [
    { points: 12, text: "Maintenance became overdue" },
    { points: 10, text: "Temperature crossed threshold" },
    { points: 11, text: "New failure recorded" }
  ],

  recommendations: [
    { priority: "IMMEDIATE", text: "Inspect Pump P-102" },
    { priority: "HIGH", text: "Schedule maintenance" },
    { priority: "HIGH", text: "Check temperature sensor" },
    { priority: "MEDIUM", text: "Review inspection findings" }
  ],
  
  trendHistory: [54, 59, 63, 71, 87],
  explanation: null
};

let priorityRanking = [
  { rank: 1, asset: "Pump P-102",      score: 87, level: "HIGH",   action: "Immediate Inspection" },
  { rank: 2, asset: "Boiler B-201",    score: 81, level: "HIGH",   action: "Priority Maintenance" },
  { rank: 3, asset: "Compressor C-104", score: 64, level: "MEDIUM", action: "Scheduled Review" },
  { rank: 4, asset: "Tank T-301",      score: 52, level: "MEDIUM", action: "Monitor Closely" }
];

/* ── API Service Functions ─────────────────────────────── */
async function analyzeRisk(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Analysis failed with status ${response.status}`);
  }

  return await response.json();
}

async function fetchRankings() {
  const response = await fetch(`${API_BASE_URL}/api/rankings`);
  if (!response.ok) throw new Error("Failed to fetch rankings");
  return await response.json();
}

async function fetchSummary() {
  const response = await fetch(`${API_BASE_URL}/api/summary`);
  if (!response.ok) throw new Error("Failed to fetch summary");
  return await response.json();
}

async function fetchAudit() {
  const response = await fetch(`${API_BASE_URL}/api/audit`);
  if (!response.ok) throw new Error("Failed to fetch audit log");
  return await response.json();
}

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
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * targetScore);

      numEl.textContent = current;

      const offset = circumference - (eased * targetScore / 100) * circumference;
      fillEl.style.strokeDashoffset = offset;

      const color = current >= 75 ? '#ff4d4d' : current >= 50 ? '#ff9f1c' : '#00c853';
      fillEl.style.stroke = color;

      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Hero risk score observer
  const heroScoreObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl  = document.getElementById('heroScoreNum');
        const fillEl = document.getElementById('heroScoreFill');
        animateScore(numEl, fillEl, riskData.score, 326.73);
        heroScoreObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  heroScoreObserver.observe(document.getElementById('heroRiskCard'));

  // Intelligence section risk score observer
  const intelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl  = document.getElementById('intelScoreNum');
        const fillEl = document.getElementById('intelScoreFill');
        animateScore(numEl, fillEl, riskData.score, 427.26);
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

  /* ── Populate all UI components dynamically from riskData ───────────────── */
  function populateRiskIntelligenceUI() {
    // 1. Asset Name
    const assetNameEl = document.getElementById('intelAssetName');
    if (assetNameEl) assetNameEl.textContent = riskData.asset;

    // 2. Current Risk Level badge & status text
    const assetLevelEl = document.getElementById('intelAssetLevel');
    if (assetLevelEl) {
      assetLevelEl.textContent = riskData.level;
      assetLevelEl.className = 'risk-badge';
      if (riskData.level === 'HIGH') assetLevelEl.classList.add('risk-high');
      else if (riskData.level === 'MEDIUM') assetLevelEl.classList.add('risk-medium');
      else assetLevelEl.classList.add('risk-low');
    }
    
    const scoreLevelTextEl = document.getElementById('intelScoreLevelText');
    if (scoreLevelTextEl) {
      scoreLevelTextEl.textContent = riskData.level;
      scoreLevelTextEl.className = 'metric-sub-badge';
      if (riskData.level === 'HIGH') scoreLevelTextEl.classList.add('risk-high-text');
      else if (riskData.level === 'MEDIUM') scoreLevelTextEl.classList.add('risk-medium-text');
      else scoreLevelTextEl.classList.add('risk-low-text');
    }

    // 3. Confidence Display
    const confValEl = document.getElementById('intelConfidenceVal');
    if (confValEl) confValEl.textContent = riskData.confidence + '%';
    
    const confLevelTextEl = document.getElementById('intelConfidenceLevelText');
    if (confLevelTextEl) {
      let rating = 'GOOD';
      if (riskData.confidence < 70) rating = 'LIMITED';
      else if (riskData.confidence < 90) rating = 'FAIR';
      confLevelTextEl.textContent = rating;
      confLevelTextEl.className = 'metric-sub-badge';
      if (rating === 'GOOD') confLevelTextEl.classList.add('status-good');
      else if (rating === 'FAIR') confLevelTextEl.classList.add('status-fair');
      else confLevelTextEl.classList.add('status-limited');
    }

    // 4. Data Quality Display & Warning Banner
    const dqValEl = document.getElementById('intelDqVal');
    if (dqValEl) dqValEl.textContent = riskData.dataQuality + '%';
    
    const dqLevelTextEl = document.getElementById('intelDqLevelText');
    let dqRating = 'GOOD';
    if (riskData.dataQuality < 70) dqRating = 'LIMITED';
    else if (riskData.dataQuality < 90) dqRating = 'FAIR';
    
    if (dqLevelTextEl) {
      dqLevelTextEl.textContent = dqRating;
      dqLevelTextEl.className = 'metric-sub-badge';
      if (dqRating === 'GOOD') dqLevelTextEl.classList.add('status-good');
      else if (dqRating === 'FAIR') dqLevelTextEl.classList.add('status-fair');
      else dqLevelTextEl.classList.add('status-limited');
    }
    
    const dqWarningEl = document.getElementById('intelDqWarning');
    if (dqWarningEl) {
      if (riskData.dataQuality < 70) {
        dqWarningEl.style.display = 'flex';
      } else {
        dqWarningEl.style.display = 'none';
      }
    }

    // 5. Risk Status Change
    const prevStatusEl = document.getElementById('intelPrevStatus');
    if (prevStatusEl) prevStatusEl.textContent = `${riskData.previousScore} — ${riskData.previousLevel}`;
    
    const currStatusEl = document.getElementById('intelCurrStatus');
    if (currStatusEl) currStatusEl.textContent = `${riskData.score} — ${riskData.level}`;
    
    const changeValEl = document.getElementById('intelChangeVal');
    if (changeValEl) {
      const diff = riskData.score - riskData.previousScore;
      const sign = diff >= 0 ? '+' : '';
      changeValEl.textContent = `↑ ${sign}${diff}`;
      if (diff >= 0) {
        changeValEl.className = 'status-change-val text-red font-bold';
      } else {
        changeValEl.className = 'status-change-val text-green font-bold';
      }
    }

    // 6. Risk Trend
    const trendChangeEl = document.getElementById('intelTrendChange');
    if (trendChangeEl) {
      const diff = riskData.score - riskData.previousScore;
      const sign = diff >= 0 ? '+' : '';
      trendChangeEl.textContent = `↑ ${sign}${diff} points`;
    }
    
    const trendCaptionEl = document.getElementById('intelTrendCaption');
    if (trendCaptionEl) {
      const diff = riskData.score - riskData.previousScore;
      trendCaptionEl.textContent = diff > 20 ? 'Risk increased significantly' : 'Risk trend stable';
    }

    // Dynamically draw trend SVG based on trendHistory
    const trendSvg = document.querySelector('.trend-svg');
    if (trendSvg && riskData.trendHistory) {
      const getX = (index) => 30 + index * 60;
      const getY = (score) => 70 - (score / 100) * 50;
      
      let pathD = '';
      riskData.trendHistory.forEach((score, i) => {
        if (i === 0) pathD += `M ${getX(i)},${getY(score)}`;
        else pathD += ` L ${getX(i)},${getY(score)}`;
      });
      
      const trendLinePath = document.getElementById('trendLinePath');
      if (trendLinePath) trendLinePath.setAttribute('d', pathD);
      
      const pointsGroup = document.getElementById('trendPointsGroup');
      if (pointsGroup) {
        pointsGroup.innerHTML = '';
        riskData.trendHistory.forEach((score, i) => {
          const cx = getX(i);
          const cy = getY(score);
          const isLast = i === riskData.trendHistory.length - 1;
          
          let color = 'var(--green)';
          if (score >= 75) color = 'var(--red)';
          else if (score >= 50) color = 'var(--orange)';
          
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', cx);
          circle.setAttribute('cy', cy);
          if (isLast) {
            circle.setAttribute('r', '6');
            circle.setAttribute('fill', color);
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '1.5');
          } else {
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', color);
          }
          pointsGroup.appendChild(circle);
          
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', cx);
          if (isLast) {
            text.setAttribute('y', cy - 10);
            text.setAttribute('class', 'trend-chart-text font-bold');
            text.setAttribute('fill', color);
          } else {
            text.setAttribute('y', cy + 16);
            text.setAttribute('class', 'trend-chart-text');
          }
          text.setAttribute('text-anchor', 'middle');
          text.textContent = score;
          pointsGroup.appendChild(text);
        });
      }
    }

    // 7. Evidence Breakdown
    const evidenceListEl = document.getElementById('intelEvidenceList');
    if (evidenceListEl && riskData.drivers) {
      evidenceListEl.innerHTML = '';
      let sum = 0;
      riskData.drivers.forEach(drv => {
        sum += drv.points;
        const row = document.createElement('div');
        row.className = 'evidence-row';
        
        let barColorClass = 'bar-red';
        if (drv.points < 10) barColorClass = 'bar-blue';
        else if (drv.points < 18) barColorClass = 'bar-yellow';
        else if (drv.points < 22) barColorClass = 'bar-orange';
        
        row.innerHTML = `
          <span class="evidence-name">${drv.name}</span>
          <div class="evidence-bar-wrap">
            <div class="evidence-bar ${barColorClass}" style="width: ${drv.points}%"></div>
          </div>
          <span class="evidence-points">${drv.points} pts</span>
        `;
        evidenceListEl.appendChild(row);
      });
      
      const evidenceTotalScoreEl = document.getElementById('intelEvidenceTotalScore');
      if (evidenceTotalScoreEl) evidenceTotalScoreEl.textContent = sum;
    }

    // 8. Top Risk Drivers
    const driversListEl = document.getElementById('intelDriversList');
    if (driversListEl && riskData.drivers) {
      driversListEl.innerHTML = '';
      const topDrivers = riskData.drivers.slice(0, 4);
      topDrivers.forEach(drv => {
        const item = document.createElement('div');
        item.className = 'driver-item';
        
        let badgeClass = 'badge-medium';
        if (drv.severity === 'CRITICAL') badgeClass = 'badge-critical';
        else if (drv.severity === 'HIGH') badgeClass = 'badge-high';
        
        item.innerHTML = `
          <span class="driver-badge ${badgeClass}">${drv.severity}</span>
          <span class="driver-name">${drv.name}</span>
          <span class="driver-points">${drv.points} pts</span>
        `;
        driversListEl.appendChild(item);
      });
    }

    // 9. Explanation
    const explanationTextEl = document.getElementById('intelExplanationText');
    if (explanationTextEl) {
      if (riskData.explanation) {
        explanationTextEl.innerHTML = riskData.explanation;
      } else {
        explanationTextEl.innerHTML = `
          <strong>${riskData.asset}</strong> is classified as <strong class="text-red">${riskData.level.toLowerCase()} risk</strong> due to
          <strong>${riskData.failureCount} previous failure incidents</strong>, maintenance that is
          <strong class="text-orange">${riskData.maintenanceDelay} days overdue</strong>, temperature readings
          <strong class="text-red">above the safe operating range</strong>, and a
          concern flagged during the most recent field inspection.
        `;
      }
    }

    // 10. What Changed Expandable
    const whatChangedContentEl = document.getElementById('intelWhatChangedContent');
    if (whatChangedContentEl && riskData.changes) {
      whatChangedContentEl.innerHTML = '';
      riskData.changes.forEach(chg => {
        const item = document.createElement('div');
        item.className = 'change-item change-item-red';
        item.innerHTML = `
          <span class="change-delta">+${chg.points}</span>
          <span>${chg.text}</span>
        `;
        whatChangedContentEl.appendChild(item);
      });
      
      const diff = riskData.score - riskData.previousScore;
      const summary = document.createElement('div');
      summary.className = 'change-summary';
      summary.innerHTML = `
        Risk status changed: <strong>${riskData.previousScore} (${riskData.previousLevel}) → ${riskData.score} (${riskData.level})</strong><br/>
        Increase: <strong>+${diff} points</strong>
      `;
      whatChangedContentEl.appendChild(summary);
    }

    // 11. Recommendations Prioritized
    const actionsListEl = document.getElementById('intelActionsList');
    if (actionsListEl && riskData.recommendations) {
      actionsListEl.innerHTML = '';
      riskData.recommendations.forEach(rec => {
        const li = document.createElement('li');
        let pClass = 'action-medium';
        if (rec.priority === 'IMMEDIATE') pClass = 'action-critical';
        else if (rec.priority === 'HIGH') pClass = 'action-high';
        
        li.innerHTML = `
          <span class="action-priority ${pClass}">${rec.priority}</span>
          <span>${rec.text}</span>
        `;
        actionsListEl.appendChild(li);
      });
    }
  }

  /* ── Dynamic Prioritization Table population ────────────── */
  function populatePriorityRankingUI(rankings) {
    const rankingTable = document.querySelector('.ranking-table');
    if (!rankingTable) return;
    
    const header = rankingTable.querySelector('.ranking-header');
    rankingTable.innerHTML = '';
    if (header) {
      rankingTable.appendChild(header);
    }
    
    rankings.forEach(item => {
      const row = document.createElement('div');
      const isCritical = item.risk_level === 'HIGH' || item.risk_score >= 75;
      row.className = `ranking-row ${isCritical ? 'ranking-row-critical' : ''}`;
      row.setAttribute('data-rank', item.priority_rank || item.rank);
      
      let scorePillClass = 'score-pill-green';
      if (item.risk_score >= 75) scorePillClass = 'score-pill-red';
      else if (item.risk_score >= 50) scorePillClass = 'score-pill-orange';
      
      let levelBadgeClass = 'level-low';
      if (item.risk_level === 'HIGH') levelBadgeClass = 'level-high';
      else if (item.risk_level === 'MEDIUM') levelBadgeClass = 'level-medium';
      
      const icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>`;
      
      row.innerHTML = `
        <span class="rr-rank"><span class="rank-number">#${item.priority_rank || item.rank}</span></span>
        <span class="rr-asset">
          ${icon}
          ${item.asset_name || item.asset}
        </span>
        <span class="rr-score"><span class="score-pill ${scorePillClass}">${item.risk_score || item.score}</span></span>
        <span class="rr-level"><span class="level-badge ${levelBadgeClass}">${item.risk_level || item.level}</span></span>
        <span class="rr-action">${item.recommended_action || item.action || 'Monitor Closely'}</span>
      `;
      rankingTable.appendChild(row);
    });
  }

  /* ── Dynamic Audit Trail population ─────────────────────── */
  function populateAuditTrailUI(auditData) {
    const auditCard = document.querySelector('.audit-trail-card');
    if (!auditCard) return;
    
    const auditBody = auditCard.querySelector('.audit-body');
    if (!auditBody) return;
    
    let factorsStr = '';
    if (Array.isArray(auditData.contributing_factors)) {
      factorsStr = auditData.contributing_factors.join(' · ');
    } else {
      factorsStr = auditData.contributing_factors || auditData.explanation || '';
    }
    
    let scorePillClass = 'score-pill-green';
    if (auditData.risk_score >= 75) scorePillClass = 'score-pill-red';
    else if (auditData.risk_score >= 50) scorePillClass = 'score-pill-orange';

    auditBody.innerHTML = `
      <div class="audit-row">
        <span class="audit-key">Asset</span>
        <span class="audit-val">${auditData.asset_name || auditData.asset || ''}</span>
      </div>
      <div class="audit-row">
        <span class="audit-key">Risk Score</span>
        <span class="audit-val"><span class="score-pill ${scorePillClass}">${auditData.risk_score || auditData.score || ''} / 100</span></span>
      </div>
      <div class="audit-row">
        <span class="audit-key">Contributing Factors</span>
        <span class="audit-val">${factorsStr}</span>
      </div>
      <div class="audit-row">
        <span class="audit-key">Recommendation</span>
        <span class="audit-val">${auditData.recommendation || auditData.recommended_action || ''}</span>
      </div>
      <div class="audit-row">
        <span class="audit-key">Generated</span>
        <span class="audit-val">${auditData.timestamp || auditData.generated || new Date().toLocaleString()}</span>
      </div>
    `;
  }

  /* ── Dynamic Summary Statistics ────────────────────────── */
  function populateSummaryUI(summaryData) {
    const mapping = {
      'total-assets': summaryData.total_assets,
      'high-risk-count': summaryData.high_risk,
      'medium-risk-count': summaryData.medium_risk,
      'low-risk-count': summaryData.low_risk,
      'avg-confidence': (summaryData.avg_confidence || '') + (summaryData.avg_confidence ? '%' : ''),
      'avg-data-quality': (summaryData.avg_data_quality || '') + (summaryData.avg_data_quality ? '%' : '')
    };
    
    for (const [id, value] of Object.entries(mapping)) {
      const el = document.getElementById(id) || document.querySelector(`.${id}`);
      if (el && value !== undefined && value !== null) {
        el.textContent = value;
      }
    }
  }

  /* ── Background Data Fetchers on Load ──────────────────── */
  async function loadBackendData() {
    try {
      const rankings = await fetchRankings();
      if (Array.isArray(rankings)) {
        populatePriorityRankingUI(rankings);
      } else if (rankings && Array.isArray(rankings.results)) {
        populatePriorityRankingUI(rankings.results);
      }
    } catch (e) {
      console.warn("Could not load backend rankings:", e.message);
    }

    try {
      const summary = await fetchSummary();
      if (summary) {
        populateSummaryUI(summary);
      }
    } catch (e) {
      console.warn("Could not load backend summary:", e.message);
    }

    try {
      const auditLog = await fetchAudit();
      if (auditLog) {
        if (Array.isArray(auditLog)) {
          populateAuditTrailUI(auditLog[0]);
        } else {
          populateAuditTrailUI(auditLog);
        }
      }
    } catch (e) {
      console.warn("Could not load backend audit trail:", e.message);
    }
  }

  // Run dynamic populator immediately on DOM load
  populateRiskIntelligenceUI();
  // Fetch supplemental background data from backend
  loadBackendData();

  /* ── Dynamically Created Hidden File Upload Controls ── */
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.csv';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  // Hook into existing CTA / Analysis trigger buttons
  const analyzeButtons = document.querySelectorAll('a[href="#cta"], a[href="#risk-analyzer"], .hero-actions a');
  analyzeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const target = document.getElementById('risk-intelligence') || document.getElementById('risk-analyzer');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      
      fileInput.click();
    });
  });

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const panel = document.getElementById('risk-analyzer');
    if (panel) {
      panel.style.opacity = '0.5';
      panel.style.pointerEvents = 'none';
    }

    try {
      const responseData = await analyzeRisk(file);
      if (responseData && responseData.results && responseData.results.length > 0) {
        const result = responseData.results[0]; // Get the highest priority result

        // Map backend response fields to local riskData structure
        riskData.asset = result.asset_name || result.asset_id;
        riskData.score = result.risk_score;
        riskData.previousScore = result.previous_score;
        riskData.level = result.risk_level;
        riskData.previousLevel = result.previous_level || (result.previous_score >= 75 ? 'HIGH' : result.previous_score >= 50 ? 'MEDIUM' : 'LOW');
        riskData.confidence = result.confidence;
        riskData.dataQuality = result.data_quality;
        riskData.explanation = result.explanation;

        // Extract failure count from evidence contribution if available, do not invent values
        const failEvidence = result.evidence ? result.evidence.find(ev => ev.factor.toLowerCase().includes('failure')) : null;
        riskData.failureCount = result.failure_count || (failEvidence ? parseInt(failEvidence.details || failEvidence.contribution) || 0 : 0);

        // Extract maintenance delay from evidence contribution if available
        const maintEvidence = result.evidence ? result.evidence.find(ev => ev.factor.toLowerCase().includes('maintenance')) : null;
        riskData.maintenanceDelay = result.maintenance_delay || (maintEvidence ? parseInt(maintEvidence.details || maintEvidence.contribution) || 0 : 0);

        // Map drivers
        const evidenceSrc = result.evidence || result.drivers || [];
        riskData.drivers = evidenceSrc.map(ev => ({
          name: ev.factor || ev.name || '',
          points: ev.contribution || ev.points || 0,
          severity: ev.severity || 'MEDIUM'
        }));

        // Map changes
        riskData.changes = result.changes ? (result.changes.items || result.changes || []) : [];

        // Map recommendations
        const actionsSrc = result.actions || result.recommendations || [];
        riskData.recommendations = actionsSrc.map(act => ({
          priority: act.priority || 'MEDIUM',
          text: act.action || act.text || ''
        }));

        // Map trend
        riskData.trendHistory = result.trend || result.trendHistory || [result.previous_score, riskData.score];

        // Refresh panel contents
        populateRiskIntelligenceUI();

        // Refresh animations
        const numEl = document.getElementById('intelScoreNum');
        const fillEl = document.getElementById('intelScoreFill');
        if (numEl && fillEl) {
          animateScore(numEl, fillEl, riskData.score, 427.26);
        }
        const heroNumEl = document.getElementById('heroScoreNum');
        const heroFillEl = document.getElementById('heroScoreFill');
        if (heroNumEl && heroFillEl) {
          animateScore(heroNumEl, heroFillEl, riskData.score, 326.73);
        }

        // Also fetch secondary state endpoints to sync audit trailing and prioritizing rows
        loadBackendData();
      } else {
        alert("Risk analysis completed, but no asset results were returned.");
      }
    } catch (err) {
      console.error(err);
      alert(`Error during analysis: ${err.message}`);
    } finally {
      if (panel) {
        panel.style.opacity = '1';
        panel.style.pointerEvents = 'auto';
      }
      fileInput.value = ''; // Reset file input
    }
  });

});

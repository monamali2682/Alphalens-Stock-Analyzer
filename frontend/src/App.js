import React, { useState } from 'react';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream: #faf8f3;
    --cream2: #f3f0e8;
    --ink: #1c1917;
    --ink2: #44403c;
    --ink3: #78716c;
    --green: #166534;
    --green2: #15803d;
    --green-light: #dcfce7;
    --gold: #b45309;
    --border: #e7e4dc;
    --white: #ffffff;
    --red: #dc2626;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Instrument Sans', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
  }

  /* ── TOPBAR ── */
  .topbar {
    background: var(--ink);
    color: #a8a29e;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 8px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .topbar span { color: #d6d3d1; }

  /* ── NAV ── */
  .nav {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav-logo-icon {
    width: 32px;
    height: 32px;
    background: var(--ink);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-logo-icon svg { width: 18px; height: 18px; }

  .nav-brand {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: -0.3px;
  }

  .nav-brand span { color: var(--green); }

  .nav-links {
    display: flex;
    gap: 32px;
    list-style: none;
  }

  .nav-links a {
    font-size: 13px;
    font-weight: 500;
    color: var(--ink3);
    text-decoration: none;
    letter-spacing: 0.2px;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--ink); }

  .nav-cta {
    background: var(--ink);
    color: var(--white) !important;
    padding: 8px 18px;
    border-radius: 6px;
    font-size: 12px !important;
    font-weight: 600 !important;
    letter-spacing: 0.5px;
  }

  /* ── HERO ── */
  .hero {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: 72px 40px 64px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 20px;
  }

  .hero-eyebrow::before {
    content: '';
    width: 20px;
    height: 1px;
    background: var(--green);
  }

  .hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 52px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -1px;
    color: var(--ink);
    margin-bottom: 20px;
  }

  .hero h1 em {
    font-style: italic;
    color: var(--green);
  }

  .hero-desc {
    font-size: 16px;
    line-height: 1.7;
    color: var(--ink3);
    margin-bottom: 32px;
    font-weight: 300;
  }

  .hero-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 36px;
  }

  .hero-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--ink2);
  }

  .hero-feature-dot {
    width: 6px;
    height: 6px;
    background: var(--green);
    border-radius: 50%;
    flex-shrink: 0;
  }

  .hero-stats {
    display: flex;
    gap: 32px;
  }

  .hero-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--ink);
  }

  .hero-stat-label {
    font-size: 11px;
    color: var(--ink3);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 2px;
  }

  /* Search card in hero */
  .hero-search-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    position: relative;
  }

  .hero-search-card::before {
    content: '"';
    font-family: 'Playfair Display', serif;
    font-size: 120px;
    color: var(--border);
    position: absolute;
    top: -20px;
    right: 24px;
    line-height: 1;
  }

  .search-card-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 16px;
  }

  .search-row {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .search-input {
    flex: 1;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 13px 16px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .search-input:focus {
    border-color: var(--green);
    box-shadow: 0 0 0 3px rgba(22,101,52,0.08);
  }

  .search-input::placeholder { color: #c4bfb8; }

  .search-btn {
    background: var(--green);
    color: var(--white);
    border: none;
    border-radius: 8px;
    padding: 13px 22px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    letter-spacing: 0.3px;
  }

  .search-btn:hover { background: var(--green2); }
  .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .search-hint {
    font-size: 12px;
    color: var(--ink3);
  }

  .search-hint strong { color: var(--ink2); font-weight: 500; }

  /* ── MAIN CONTENT ── */
  .main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 40px;
  }

  /* Loading */
  .loading {
    text-align: center;
    padding: 80px;
    color: var(--ink3);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 2px solid var(--border);
    border-top-color: var(--green);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .error-box {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 14px 18px;
    color: var(--red);
    margin-bottom: 24px;
    font-size: 14px;
  }

  /* ── REPORT ── */
  .report { animation: fadeUp 0.4s ease; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Company masthead */
  .masthead {
    background: var(--ink);
    border-radius: 16px;
    padding: 36px 40px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .masthead::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 40px solid rgba(255,255,255,0.03);
  }

  .masthead::after {
    content: '';
    position: absolute;
    bottom: -60px;
    left: 200px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: 30px solid rgba(255,255,255,0.03);
  }

  .masthead-left { position: relative; z-index: 1; }

  .masthead-tag {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #a8a29e;
    margin-bottom: 10px;
  }

  .masthead-name {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 6px;
    letter-spacing: -0.5px;
  }

  .masthead-symbol {
    font-size: 12px;
    color: #78716c;
    letter-spacing: 2px;
    font-weight: 500;
  }

  .masthead-right {
    text-align: right;
    position: relative;
    z-index: 1;
  }

  .masthead-cmp-label {
    font-size: 10px;
    color: #78716c;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .masthead-cmp {
    font-family: 'Playfair Display', serif;
    font-size: 44px;
    font-weight: 700;
    color: #4ade80;
    letter-spacing: -1px;
    line-height: 1;
  }

  .masthead-date {
    font-size: 11px;
    color: #57534e;
    margin-top: 6px;
  }

  /* Section */
  .section { margin-bottom: 28px; }

  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .section-icon {
    width: 28px;
    height: 28px;
    background: var(--green-light);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .section-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--ink2);
  }

  .section-line { flex: 1; height: 1px; background: var(--border); }

  /* Stat cards */
  .stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

  .stat-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px 22px;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .stat-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--green);
    transform: scaleX(0);
    transition: transform 0.2s;
  }

  .stat-card:hover { border-color: #c9c4bb; box-shadow: var(--shadow); }
  .stat-card:hover::after { transform: scaleX(1); }

  .stat-label {
    font-size: 10px;
    color: var(--ink3);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 10px;
    font-weight: 600;
  }

  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1;
  }

  /* Table */
  .table-wrap {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  table { width: 100%; border-collapse: collapse; }

  thead tr { background: var(--cream2); }

  th {
    padding: 13px 20px;
    text-align: left;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--ink3);
    border-bottom: 1px solid var(--border);
  }

  td {
    padding: 15px 20px;
    font-size: 14px;
    color: var(--ink2);
    border-bottom: 1px solid #f5f2ec;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: #fdfcfa; }

  .positive { color: #15803d; font-weight: 500; }
  .negative { color: var(--red); font-weight: 500; }
  .neutral  { color: var(--ink3); }
  .year-cell { font-weight: 600; color: var(--ink); font-family: 'Playfair Display', serif; }

  /* PE cards */
  .pe-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

  .pe-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px 24px;
    text-align: center;
    box-shadow: var(--shadow);
    transition: all 0.2s;
  }

  .pe-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.08); }

  .pe-period {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 14px;
  }

  .pe-value {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }

  .pe-subtext {
    font-size: 11px;
    color: var(--ink3);
    margin-top: 8px;
  }

  /* Concall placeholder */
  .concall-card {
    background: linear-gradient(135deg, var(--ink) 0%, #292524 100%);
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .concall-card::before {
    content: '◎';
    position: absolute;
    font-size: 200px;
    color: rgba(255,255,255,0.02);
    top: -40px;
    right: -20px;
    line-height: 1;
  }

  .concall-badge {
    display: inline-block;
    background: rgba(74,222,128,0.15);
    color: #4ade80;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 16px;
    border: 1px solid rgba(74,222,128,0.2);
  }

  .concall-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: var(--white);
    margin-bottom: 10px;
  }

  .concall-desc {
    font-size: 13px;
    color: #78716c;
    line-height: 1.6;
  }

  /* Trust bar */
  .trust-bar {
    background: var(--cream2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 32px;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--ink3);
  }

  .trust-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; }

  /* Footer */
  .footer {
    background: var(--ink);
    color: #78716c;
    padding: 48px 40px 32px;
    margin-top: 80px;
  }

  .footer-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid #292524;
    margin-bottom: 24px;
  }

  .footer-brand {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    color: var(--white);
    margin-bottom: 12px;
  }

  .footer-brand span { color: #4ade80; }

  .footer-desc { font-size: 13px; line-height: 1.7; color: #57534e; }

  .footer-col-title {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #a8a29e;
    margin-bottom: 16px;
  }

  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-links a { font-size: 13px; color: #57534e; text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--white); }

  .footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #44403c;
  }

  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; gap: 40px; padding: 48px 24px; }
    .stat-cards { grid-template-columns: repeat(2, 1fr); }
    .pe-cards { grid-template-columns: repeat(3, 1fr); }
    .masthead { flex-direction: column; gap: 20px; text-align: center; }
    .masthead-right { text-align: center; }
    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    .main { padding: 32px 24px; }
    .nav { padding: 0 24px; }
    .trust-bar { flex-direction: column; gap: 12px; }
  }
`;

function GrowthCell({ value }) {
  if (!value || value === '—' || value === 'N/A') return <td className="neutral">{value || 'N/A'}</td>;
  const isPositive = !value.startsWith('-');
  return <td className={isPositive ? 'positive' : 'negative'}>{isPositive ? '▲ ' : '▼ '}{value}</td>;
}

const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!symbol.trim()) return;
    setLoading(true);
    setError('');
    setStockData(null);
    try {
      const res = await axios.get(`/api/stock/${symbol.trim().toUpperCase()}`);
      setStockData(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Could not fetch data. Try symbols like INFY, TCS, RELIANCE, NH');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <>
      <style>{styles}</style>

      {/* TOPBAR */}
      <div className="topbar">
        <span>Indian Equity Research Platform</span>
        <span>Data via Screener.in · <span>NSE / BSE</span></span>
      </div>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <svg viewBox="0 0 18 18" fill="none">
              <path d="M3 14L7 9L10 12L13 7L15 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="15" cy="10" r="1.5" fill="#4ade80"/>
            </svg>
          </div>
          <div className="nav-brand">Alpha<span>Lens</span></div>
        </div>
        <ul className="nav-links">
          <li><a href="#">Research</a></li>
          <li><a href="#">Screener</a></li>
          <li><a href="#">Concall AI</a></li>
          <li><a href="#" className="nav-cta">Get Pro</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div className="hero">
          <div>
            <div className="hero-eyebrow">Equity Research</div>
            <h1>Smarter analysis.<br /><em>Faster decisions.</em></h1>
            <p className="hero-desc">
              Institutional-grade stock research for the modern analyst. Enter any NSE symbol to generate a comprehensive 1-pager in seconds.
            </p>
            <div className="hero-features">
              <div className="hero-feature"><div className="hero-feature-dot"></div>Live data from Screener.in</div>
              <div className="hero-feature"><div className="hero-feature-dot"></div>3-year financial history with growth metrics</div>
              <div className="hero-feature"><div className="hero-feature-dot"></div>Median PE analysis across 1Y · 3Y · 5Y</div>
              <div className="hero-feature"><div className="hero-feature-dot"></div>AI-powered concall summary (coming soon)</div>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">5,000+</div>
                <div className="hero-stat-label">Companies</div>
              </div>
              <div>
                <div className="hero-stat-num">Real-time</div>
                <div className="hero-stat-label">Price Data</div>
              </div>
              <div>
                <div className="hero-stat-num">10Y</div>
                <div className="hero-stat-label">Historical Data</div>
              </div>
            </div>
          </div>

          <div className="hero-search-card">
            <div className="search-card-label">Analyse a company</div>
            <div className="search-row">
              <input
                className="search-input"
                type="text"
                placeholder="e.g. TCS, INFY, NH, RELIANCE"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="search-btn" onClick={handleSearch} disabled={loading || !symbol.trim()}>
                {loading ? '...' : 'Analyse →'}
              </button>
            </div>
            <div className="search-hint">
              Try: <strong>TCS</strong> · <strong>HDFCBANK</strong> · <strong>TATASTEEL</strong> · <strong>NH</strong>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {error && <div className="error-box">⚠ {error}</div>}

        {loading && (
          <div className="loading">
            <div className="spinner" />
            <p style={{ fontSize: 14 }}>Fetching from screener.in...</p>
          </div>
        )}

        {stockData && !loading && (
          <div className="report">

            {/* MASTHEAD */}
            <div className="masthead">
              <div className="masthead-left">
                <div className="masthead-tag">Equity Research · {today}</div>
                <div className="masthead-name">{stockData.companyName || stockData.symbol}</div>
                <div className="masthead-symbol">NSE: {stockData.symbol}</div>
              </div>
              <div className="masthead-right">
                <div className="masthead-cmp-label">Current Market Price</div>
                <div className="masthead-cmp">{stockData.cmp || '—'}</div>
                <div className="masthead-date">As of {today}</div>
              </div>
            </div>

            {/* TABLE 1 — Key Metrics */}
            <div className="section">
              <div className="section-header">
                <div className="section-icon">📊</div>
                <div className="section-title">Key Metrics</div>
                <div className="section-line"></div>
              </div>
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="stat-label">P / E Ratio</div>
                  <div className="stat-value">{stockData.pe || '—'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Market Cap</div>
                  <div className="stat-value" style={{ fontSize: 18 }}>{stockData.marketCap ? `₹${stockData.marketCap}` : '—'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Dividend Yield</div>
                  <div className="stat-value">{stockData.dividendYield || '—'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Book Value</div>
                  <div className="stat-value">{stockData.bookValue ? `₹${stockData.bookValue}` : '—'}</div>
                </div>
              </div>
            </div>

            {/* TABLE 2 — Financials */}
            <div className="section">
              <div className="section-header">
                <div className="section-icon">📈</div>
                <div className="section-title">Financial History · Last 3 Years</div>
                <div className="section-line"></div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Revenue (Cr)</th>
                      <th>Rev Growth</th>
                      <th>Net Profit (Cr)</th>
                      <th>Profit Growth</th>
                      <th>Net Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.financials && stockData.financials.length > 0 ? (
                      stockData.financials.map((f, i) => (
                        <tr key={i}>
                          <td className="year-cell">{f.year}</td>
                          <td>{f.revenue}</td>
                          <GrowthCell value={f.revenueGrowth} />
                          <td>{f.profit}</td>
                          <GrowthCell value={f.profitGrowth} />
                          <td>{f.netProfitMargin}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={6} className="neutral" style={{ textAlign: 'center', padding: 28 }}>No financial data found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLE 3 — Median PE */}
            <div className="section">
              <div className="section-header">
                <div className="section-icon">🎯</div>
                <div className="section-title">Median P/E Analysis</div>
                <div className="section-line"></div>
              </div>
              <div className="pe-cards">
                <div className="pe-card">
                  <div className="pe-period">1 Year Median</div>
                  <div className="pe-value">{stockData.medianPe1Year || '—'}</div>
                  <div className="pe-subtext">Trailing 12 months</div>
                </div>
                <div className="pe-card">
                  <div className="pe-period">3 Year Median</div>
                  <div className="pe-value">{stockData.medianPe3Year || '—'}</div>
                  <div className="pe-subtext">36 month average</div>
                </div>
                <div className="pe-card">
                  <div className="pe-period">5 Year Median</div>
                  <div className="pe-value">{stockData.medianPe5Year || '—'}</div>
                  <div className="pe-subtext">60 month average</div>
                </div>
              </div>
            </div>

            {/* CONCALL */}
            <div className="section">
              <div className="section-header">
                <div className="section-icon">🎙</div>
                <div className="section-title">Concall Intelligence</div>
                <div className="section-line"></div>
              </div>
              <div className="concall-card">
                <div className="concall-badge">Coming Soon</div>
                <div className="concall-title">AI-Powered Concall Analysis</div>
                <div className="concall-desc">
                  Growth commentary · Capex plans · JV announcements · Key Q&A · Management guidance<br />
                  Powered by Claude AI — upgrade to Pro to unlock
                </div>
              </div>
            </div>

            {/* TRUST BAR */}
            <div className="trust-bar">
              <div className="trust-item"><div className="trust-dot"></div>Data sourced from Screener.in</div>
              <div className="trust-item"><div className="trust-dot"></div>For research purposes only</div>
              <div className="trust-item"><div className="trust-dot"></div>Not SEBI registered investment advice</div>
              <div className="trust-item"><div className="trust-dot"></div>AlphaLens © {new Date().getFullYear()}</div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Alpha<span>Lens</span></div>
            <p className="footer-desc">Institutional-grade equity research for independent analysts and retail investors. Built for the Indian market.</p>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            <ul className="footer-links">
              <li><a href="#">Stock Analyser</a></li>
              <li><a href="#">Concall AI</a></li>
              <li><a href="#">Screener</a></li>
              <li><a href="#">Pro Plan</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AlphaLens. All rights reserved.</span>
          <span>Data via Screener.in · NSE · BSE</span>
        </div>
      </footer>
    </>
  );
}

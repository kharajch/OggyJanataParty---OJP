"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// SVG Icons as inline React components to keep it zero-dependency & high quality
const OggyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#0088FF" stroke="#110D0A" strokeWidth="3" />
    {/* Ears */}
    <path d="M12 18 L2 2 L18 10 Z" fill="#005BC4" stroke="#110D0A" strokeWidth="2" strokeLinejoin="round" />
    <path d="M52 18 L62 2 L46 10 Z" fill="#005BC4" stroke="#110D0A" strokeWidth="2" strokeLinejoin="round" />
    {/* Face belly */}
    <ellipse cx="32" cy="48" rx="18" ry="12" fill="#FFFFFF" stroke="#110D0A" strokeWidth="2" />
    {/* Eyes */}
    <ellipse cx="22" cy="24" rx="6" ry="9" fill="#FFEB3B" stroke="#110D0A" strokeWidth="2" />
    <ellipse cx="42" cy="24" rx="6" ry="9" fill="#FFEB3B" stroke="#110D0A" strokeWidth="2" />
    <ellipse cx="23" cy="24" rx="2" ry="4" fill="#110D0A" />
    <ellipse cx="41" cy="24" rx="2" ry="4" fill="#110D0A" />
    {/* Nose (Oggy's iconic big red nose) */}
    <circle cx="32" cy="34" r="8" fill="#FF3B3F" stroke="#110D0A" strokeWidth="3" />
    {/* Whiskers */}
    <path d="M12 36 L2 35 M12 40 L3 42 M52 36 L62 35 M52 40 L61 42" stroke="#110D0A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CockroachIcon = ({ color, type }) => (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Antennae */}
    <path d="M24 16 C 18 6, 8 10, 4 14" stroke="#110D0A" strokeWidth="2" fill="none" />
    <path d="M40 16 C 46 6, 56 10, 60 14" stroke="#110D0A" strokeWidth="2" fill="none" />
    {/* Legs */}
    <path d="M16 28 L4 24 M16 36 L3 36 M18 44 L4 48 M48 28 L60 24 M48 36 L61 36 M46 44 L60 48" stroke="#110D0A" strokeWidth="2.5" strokeLinecap="round" />
    {/* Body */}
    <ellipse cx="32" cy="38" rx="14" ry="20" fill={color} stroke="#110D0A" strokeWidth="3" />
    {/* Head */}
    <circle cx="32" cy="18" r="8" fill="#FF3B3F" stroke="#110D0A" strokeWidth="2.5" />
    {/* Eyes */}
    <circle cx="29" cy="16" r="2.5" fill="#FFFFFF" />
    <circle cx="29" cy="16" r="1" fill="#110D0A" />
    <circle cx="35" cy="16" r="2.5" fill="#FFFFFF" />
    <circle cx="35" cy="16" r="1" fill="#110D0A" />
    {/* Label / Special badge */}
    <text x="32" y="42" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
      {type[0]}
    </text>
  </svg>
);

const FlyswatterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="2" width="10" height="12" rx="1" fill="#FF3B3F" stroke="#110D0A" strokeWidth="2" />
    <path d="M9 2 V14 M11 2 V14 M13 2 V14 M15 2 V14 M7 5 H17 M7 8 H17 M7 11 H17" stroke="#110D0A" strokeWidth="1" />
    <rect x="11" y="14" width="2" height="8" fill="#8B5A2B" stroke="#110D0A" strokeWidth="2" />
  </svg>
);

// Web Audio API Synthesizer Class
class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playSwat() {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);

    // Add noise thump for impact
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 300;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    noise.start();
    noise.stop(this.ctx.currentTime + 0.06);
  }

  playLaugh() {
    this.init();
    if (!this.ctx) return;

    const playChirp = (pitch, startTime, duration, isLow = false) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = isLow ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(pitch, startTime);
      osc.frequency.linearRampToValueAtTime(pitch * 1.3, startTime + duration);
      
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    };

    const now = this.ctx.currentTime;
    const chirps = [
      { pitch: 420, delay: 0, dur: 0.08 },
      { pitch: 520, delay: 0.10, dur: 0.08 },
      { pitch: 450, delay: 0.20, dur: 0.08 },
      { pitch: 580, delay: 0.30, dur: 0.08 },
      { pitch: 480, delay: 0.40, dur: 0.08 },
      { pitch: 620, delay: 0.50, dur: 0.12 },
      { pitch: 350, delay: 0.65, dur: 0.15, low: true },
      { pitch: 350, delay: 0.78, dur: 0.20, low: true },
    ];

    chirps.forEach(c => {
      playChirp(c.pitch, now + c.delay, c.dur, c.low);
    });
  }

  playExplosion() {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);

    // Large low-pass noise filter thud
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.3, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.3);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.3);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    noise.start();
    noise.stop(this.ctx.currentTime + 0.32);
  }
}

export default function Home() {
  const soundEngine = useRef(null);
  
  // App states
  const [soundMuted, setSoundMuted] = useState(true);
  const [swatScore, setSwatScore] = useState(0);
  const [activeTab, setActiveTab] = useState("fridge");
  const [pollVotes, setPollVotes] = useState({ ojp: 58, cjp: 42 });
  const [pollMessage, setPollMessage] = useState("OJP lead remains steady after Oggy successfully locked the kitchen window.");

  // Game board states
  const gameBoardRef = useRef(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [cockroaches, setCockroaches] = useState([]);
  const [splats, setSplats] = useState([]);

  // ID Card Generator states
  const [cardName, setCardName] = useState("");
  const [cardWeapon, setCardWeapon] = useState("Classic Flyswatter");
  const [cardRank, setCardRank] = useState("Fridge Guard Cadet");
  const [generatedCardId, setGeneratedCardId] = useState("OJP-000000-TEMP");
  const [cardCreated, setCardCreated] = useState(false);

  // Initialize sound engine on client side
  useEffect(() => {
    soundEngine.current = new SoundEngine();
  }, []);

  // Set card Rank dynamically based on swat score
  useEffect(() => {
    if (swatScore === 0) setCardRank("Fridge Guard Cadet");
    else if (swatScore < 5) setCardRank("Meme Soldier");
    else if (swatScore < 15) setCardRank("Kitchen Corporal");
    else if (swatScore < 30) setCardRank("Supreme Swatter");
    else setCardRank("Fridge Overlord");
  }, [swatScore]);

  // Handle global sound activation
  const toggleSound = () => {
    if (soundEngine.current) {
      soundEngine.current.init();
      if (soundMuted) {
        soundEngine.current.playLaugh();
      }
    }
    setSoundMuted(!soundMuted);
  };

  // Start swat game automatically when entering viewport / clicking start
  const startGame = () => {
    if (soundEngine.current && !soundMuted) soundEngine.current.playLaugh();
    setGameRunning(true);
    setCockroaches([
      spawnCockroach(1),
      spawnCockroach(2),
      spawnCockroach(3),
    ]);
  };

  const spawnCockroach = (id) => {
    const types = [
      { name: "Joey", color: "#E040FB", speed: 4.5, points: 3 },
      { name: "Dee Dee", color: "#FF9100", speed: 2.2, points: 1 },
      { name: "Marky", color: "#00E676", speed: 3.2, points: 2 }
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: id || Math.random(),
      name: type.name,
      color: type.color,
      speed: type.speed,
      points: type.points,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      angle: Math.random() * 360,
      dx: (Math.random() - 0.5) * type.speed,
      dy: (Math.random() - 0.5) * type.speed,
    };
  };

  // Cockroach movements physics loop
  useEffect(() => {
    if (!gameRunning) return;

    const interval = setInterval(() => {
      setCockroaches((prev) =>
        prev.map((bug) => {
          let nx = bug.x + bug.dx;
          let ny = bug.y + bug.dy;
          let ndx = bug.dx;
          let ndy = bug.dy;
          let nAngle = bug.angle;

          // Wall collision & bounce
          if (nx <= 2 || nx >= 94) {
            ndx = -ndx;
            nx = nx <= 2 ? 3 : 93;
            nAngle = Math.atan2(ndy, ndx) * (180 / Math.PI);
          }
          if (ny <= 2 || ny >= 92) {
            ndy = -ndy;
            ny = ny <= 2 ? 3 : 91;
            nAngle = Math.atan2(ndy, ndx) * (180 / Math.PI);
          }

          // Random direction jitter (makes them crawl erratically like cockroaches)
          if (Math.random() < 0.05) {
            const angleDelta = (Math.random() - 0.5) * 60;
            const speed = bug.speed;
            const currentAngle = Math.atan2(ndy, ndx) + (angleDelta * Math.PI) / 180;
            ndx = Math.cos(currentAngle) * speed;
            ndy = Math.sin(currentAngle) * speed;
            nAngle = currentAngle * (180 / Math.PI);
          }

          return { ...bug, x: nx, y: ny, dx: ndx, dy: ndy, angle: nAngle };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, [gameRunning]);

  // Spawning more bugs over time if board gets empty
  useEffect(() => {
    if (!gameRunning) return;
    if (cockroaches.length < 4 && Math.random() < 0.1) {
      setCockroaches(prev => [...prev, spawnCockroach()]);
    }
  }, [cockroaches, gameRunning]);

  // Splat trigger on cockroach click
  const handleSwatBug = (bug, e) => {
    if (e) e.stopPropagation();
    
    // Play swat sound
    if (soundEngine.current && !soundMuted) {
      soundEngine.current.playSwat();
    }

    // Update scoreboard
    const pointsGained = bug.points;
    setSwatScore(prev => {
      const newScore = prev + pointsGained;
      // Laugh on major score achievements
      if (newScore > 0 && newScore % 10 === 0 && soundEngine.current && !soundMuted) {
        setTimeout(() => soundEngine.current.playLaugh(), 200);
      }
      return newScore;
    });

    // Remove cockroach & spawn new splat animation text
    setCockroaches(prev => prev.filter(b => b.id !== bug.id));
    setSplats(prev => [
      ...prev,
      { id: Math.random(), x: bug.x, y: bug.y, label: `SPLAT! +${pointsGained}` }
    ]);

    // OJP live poll updates when user swats bugs
    setPollVotes(prev => {
      const added = Math.min(prev.ojp + 1, 98);
      const subbed = 100 - added;
      return { ojp: added, cjp: subbed };
    });

    const quotes = [
      "OJP surges after a major cockroach splat in the kitchen zone!",
      "Dee Dee was neutralized trying to steal a cube of cheese.",
      "Joey fled the toaster area in panic after a heavy flyswatter blow.",
      "Marky retreated to the sewer lines. Fridge security level: ORANGE.",
      "OJP sweeps mock polls as kitchen operations return to normal."
    ];
    setPollMessage(quotes[Math.floor(Math.random() * quotes.length)]);

    // Spawn a replacement bug shortly after
    setTimeout(() => {
      setCockroaches(prev => [...prev, spawnCockroach()]);
    }, 400);
  };

  // Clean splat animations
  useEffect(() => {
    if (splats.length === 0) return;
    const timer = setTimeout(() => {
      setSplats(prev => prev.slice(1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [splats]);

  // ID Card Generation Logic
  const handleGenerateCard = (e) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    if (soundEngine.current && !soundMuted) {
      soundEngine.current.playExplosion();
    }

    // Create random unique card number
    const randomId = "OJP-" + Math.floor(100000 + Math.random() * 900000) + "-SWAT";
    setGeneratedCardId(randomId);
    setCardCreated(true);
  };

  // Canvas Image Download Generator
  const downloadCardImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.fillStyle = "#fffbf2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background stripes (OJP pattern)
    ctx.fillStyle = "rgba(0, 136, 255, 0.05)";
    const size = 60;
    for (let x = 0; x < canvas.width; x += size) {
      for (let y = 0; y < canvas.height; y += size) {
        ctx.fillRect(x, y, size/2, size/2);
        ctx.fillRect(x + size/2, y + size/2, size/2, size/2);
      }
    }

    // Heavy Border
    ctx.strokeStyle = "#110d0a";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    // Draw Top Header Bar
    ctx.fillStyle = "#0088ff";
    ctx.fillRect(5, 5, canvas.width - 10, 80);
    ctx.strokeStyle = "#110d0a";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(5, 85);
    ctx.lineTo(canvas.width - 5, 85);
    ctx.stroke();

    // Header Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px ArialBlack, sans-serif";
    ctx.fillText("OGGY JANATA PARTY (OJP)", 40, 55);

    ctx.fillStyle = "#ff3b3f";
    ctx.fillRect(580, 20, 180, 45);
    ctx.strokeStyle = "#110d0a";
    ctx.strokeRect(580, 20, 180, 45);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Arial, sans-serif";
    ctx.fillText("SWAT LICENSE", 605, 48);

    // Avatar Placeholder box (Oggy outline)
    ctx.fillStyle = "#e2f1ff";
    ctx.fillRect(50, 130, 200, 220);
    ctx.strokeStyle = "#110d0a";
    ctx.lineWidth = 5;
    ctx.strokeRect(50, 130, 200, 220);

    // Draw funny blue cat head inside card photo
    ctx.fillStyle = "#0088ff";
    ctx.beginPath();
    ctx.arc(150, 240, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Nose
    ctx.fillStyle = "#ff3b3f";
    ctx.beginPath();
    ctx.arc(150, 255, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Eyes
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(125, 220, 12, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(175, 220, 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#110d0a";
    ctx.beginPath();
    ctx.arc(125, 220, 4, 0, Math.PI * 2);
    ctx.arc(175, 220, 4, 0, Math.PI * 2);
    ctx.fill();

    // Name & Details
    ctx.fillStyle = "#110d0a";
    ctx.font = "bold 44px Arial, sans-serif";
    ctx.fillText(cardName.toUpperCase(), 290, 185);

    ctx.font = "24px Courier New, monospace";
    ctx.fillText(`ID: ${generatedCardId}`, 290, 235);
    
    ctx.font = "22px Arial, sans-serif";
    ctx.fillText("WEAPON OF CHOICE:", 290, 285);
    ctx.fillStyle = "#ff3b3f";
    ctx.fillText(cardWeapon.toUpperCase(), 290, 315);

    ctx.fillStyle = "#110d0a";
    ctx.fillText("RANK LEVEL:", 290, 365);
    ctx.fillStyle = "#4caf50";
    ctx.font = "bold 26px Arial, sans-serif";
    ctx.fillText(cardRank.toUpperCase(), 290, 400);

    // Footer barcode lines
    ctx.fillStyle = "#110d0a";
    for (let i = 0; i < 28; i++) {
      const x = 50 + i * 7;
      const w = Math.random() > 0.4 ? 4 : 2;
      ctx.fillRect(x, 380, w, 60);
    }
    ctx.font = "12px Courier New, monospace";
    ctx.fillText("NO COCKROACH SHALL PASS", 50, 460);

    // Stamp
    ctx.strokeStyle = "rgba(255, 59, 63, 0.4)";
    ctx.lineWidth = 6;
    ctx.strokeRect(600, 320, 150, 70);
    ctx.fillStyle = "rgba(255, 59, 63, 0.4)";
    ctx.font = "bold 20px Arial, sans-serif";
    ctx.fillText("APPROVED", 620, 350);
    ctx.fillText("OJP HIGH CMD", 610, 375);

    // Trigger download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${cardName.replace(/\s+/g, "_")}_OJP_License.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <>
      {/* Top Banner Scrolling News */}
      <div className="ticker-wrap">
        <div className="ticker">
          <span className="ticker-item">BREAKING: Dee Dee spotted climbing toaster, OJP forces deployed</span>
          <span className="ticker-item">OJP demands standardized 3-hour afternoon sleep periods</span>
          <span className="ticker-item">Jack builds new automated swatter; backyard fence reported missing</span>
          <span className="ticker-item">Bob issues formal warnings: "Keep your chases off my lawn!"</span>
          <span className="ticker-item">Hashtags active: #OJP #OggyJanataParty</span>
          <span className="ticker-item">Fridge door left unlocked for 4.2 seconds; emergency alarm triggered</span>
          
          {/* Loop duplicates for smooth scroll */}
          <span className="ticker-item">BREAKING: Dee Dee spotted climbing toaster, OJP forces deployed</span>
          <span className="ticker-item">OJP demands standardized 3-hour afternoon sleep periods</span>
          <span className="ticker-item">Jack builds new automated swatter; backyard fence reported missing</span>
          <span className="ticker-item">Bob issues formal warnings: "Keep your chases off my lawn!"</span>
          <span className="ticker-item">Hashtags active: #OJP #OggyJanataParty</span>
        </div>
      </div>

      {/* Main Header / Nav */}
      <header className="header">
        <div className="nav-container">
          <a href="#" className="logo-group">
            <OggyIcon />
            <div className="logo-text">
              <h1>OGGY JANATA PARTY</h1>
              <p>ऑगी जनता पार्टी · Est. 2026</p>
            </div>
          </a>
          <nav>
            <ul className="nav-links">
              <li><a href="#vision" className="nav-link">Vision</a></li>
              <li><a href="#game" className="nav-link">Extermination Zone</a></li>
              <li><a href="#manifesto" className="nav-link">Manifesto</a></li>
              <li><a href="#license" className="nav-link">Join &amp; License</a></li>
              <li><a href="#contact" className="nav-link">Contact</a></li>
            </ul>
          </nav>
          <a href="#license" className="cartoon-btn blue">Get Swat License</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <span /> Live updates from the kitchen
              </div>
              <h1 className="hero-title">
                For a <span style={{ color: "var(--primary-blue)" }}>Cockroach-Free</span> Kitchen!
              </h1>
              <p className="hero-subtitle">
                Welcome to the official opposition front of the chronically bothered. While the Cockroach Janata Party (CJP) crawls around, we are here with heavy-duty flyswatters, vacuum cleaners, and strategic nap schedules.
              </p>
              <div className="hero-ctas">
                <a href="#game" className="cartoon-btn">
                  Enter Extermination Zone <span style={{ marginLeft: "4px" }}>⚡</span>
                </a>
                <a href="#license" className="cartoon-btn blue">
                  Get Member ID Card
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <h3>0</h3>
                  <p>Days without a fridge raid</p>
                </div>
                <div className="stat-item">
                  <h3>{swatScore}</h3>
                  <p>Cockroaches Swatted</p>
                </div>
                <div className="stat-item">
                  <h3>100%</h3>
                  <p>Jack's device failure rate</p>
                </div>
                <div className="stat-item">
                  <h3>4 hrs</h3>
                  <p>Mandatory Nap Time</p>
                </div>
              </div>
            </div>
            <div className="hero-image-wrap">
              <div className="hero-poster">
                <div className="hero-poster-header">
                  <span>OJP Official Poster · No. 01</span>
                  <span>★ ★ ★</span>
                </div>
                <Image 
                  src="/ojp_campaign_poster.png" 
                  alt="OJP Campaign Poster" 
                  width={380} 
                  height={440} 
                  style={{ display: "block", width: "100%", height: "auto", borderBottom: "var(--border-ink)" }}
                  priority
                />
                <div className="hero-poster-footer">
                  "SPLAT TODAY, SLEEP TOMORROW!"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Extermination Zone (The Game) */}
      <section id="game" className="game-section">
        <div className="container">
          <div className="game-header">
            <h2>The Extermination Zone</h2>
            <p style={{ color: "var(--ink-muted)", fontSize: "16px" }}>
              CJP is swarming! Click and swat them as they crawl. Help Oggy secure the leftovers! 
              {soundMuted && " (Turn on sounds at the bottom right for full slap effects!)"}
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="game-hud">
              <span>Fridges Secured: <strong>{swatScore}</strong></span>
              <span>Active Menace: <strong>{cockroaches.length} bugs</strong></span>
              <span style={{ color: "var(--nose-red)" }}>Weapon: <strong>{cardWeapon}</strong></span>
            </div>

            {!gameRunning ? (
              <div 
                className="game-board" 
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                onClick={startGame}
              >
                <div className="cartoon-card" style={{ maxWidth: "340px", transform: "rotate(-1deg)" }}>
                  <h3 style={{ fontSize: "24px", marginBottom: "12px" }}>Kitchen Under Siege!</h3>
                  <p style={{ fontSize: "14px", color: "var(--ink-muted)", marginBottom: "20px" }}>
                    Dee Dee, Joey, and Marky have broken past the pantry door.
                  </p>
                  <button className="cartoon-btn" onClick={startGame}>
                    Grab Flyswatter
                  </button>
                </div>
              </div>
            ) : (
              <div ref={gameBoardRef} className="game-board">
                {/* Render active crawling cockroaches */}
                {cockroaches.map((bug) => (
                  <div
                    key={bug.id}
                    className="cockroach"
                    style={{
                      left: `${bug.x}%`,
                      top: `${bug.y}%`,
                      transform: `rotate(${bug.angle}deg)`,
                    }}
                    onClick={(e) => handleSwatBug(bug, e)}
                  >
                    <CockroachIcon color={bug.color} type={bug.name} />
                  </div>
                ))}

                {/* Splat Text Popups */}
                {splats.map((splat) => (
                  <div
                    key={splat.id}
                    className="splat"
                    style={{
                      left: `${splat.x}%`,
                      top: `${splat.y}%`,
                    }}
                  >
                    {splat.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* OJP Vision & Live Poll */}
      <section id="vision" className="manifesto-section" style={{ background: "var(--bg-cream)" }}>
        <div className="container">
          <div className="section-title">
            <h2>The Cat-izen Pulse</h2>
            <p>Simulated Live poll comparing OJP (Cat Guardians) vs CJP (Cockroach Swarm)</p>
          </div>

          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div className="cartoon-card">
              <h3 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>
                Who rules the Refrigerator?
              </h3>
              
              {/* Poll bars */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: "bold" }}>
                  <span>Oggy Janata Party (OJP)</span>
                  <span style={{ color: "var(--primary-blue)" }}>{pollVotes.ojp}%</span>
                </div>
                <div style={{ width: "100%", height: "24px", background: "#ddd", border: "2px solid #110d0a", borderRadius: "100px", overflow: "hidden" }}>
                  <div style={{ width: `${pollVotes.ojp}%`, height: "100%", background: "var(--primary-blue)", transition: "width 0.5s ease" }} />
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: "bold" }}>
                  <span>Cockroach Janata Party (CJP)</span>
                  <span style={{ color: "var(--cockroach-purple)" }}>{pollVotes.cjp}%</span>
                </div>
                <div style={{ width: "100%", height: "24px", background: "#ddd", border: "2px solid #110d0a", borderRadius: "100px", overflow: "hidden" }}>
                  <div style={{ width: `${pollVotes.cjp}%`, height: "100%", background: "var(--cockroach-purple)", transition: "width 0.5s ease" }} />
                </div>
              </div>

              <div style={{ background: "var(--bg-cream)", borderLeft: "4px solid var(--nose-red)", padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                <strong>LATEST SURVEY UPDATE:</strong> {pollMessage}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifesto" className="manifesto-section">
        <div className="container">
          <div className="section-title">
            <h2>The Five Kitchen Treaties</h2>
            <p>Our strictly enforced manifesto policies. No compromises on cheese.</p>
          </div>
          <div className="manifesto-grid">
            <div className="cartoon-card manifesto-card">
              <span className="manifesto-num">01</span>
              <h3>Fridge Sovereignty Act</h3>
              <p>All refrigerator handle systems will receive double padlock upgrades. Any cockroach detected in the vegetable crisper or cold-cut drawers faces immediate, unscheduled flyswat contact.</p>
            </div>
            <div className="cartoon-card manifesto-card">
              <span className="manifesto-num">02</span>
              <h3>The Bob Peace Treaty</h3>
              <p>OJP guarantees a formal apology and compensation in garden seeds for every yard fence damaged during high-speed chase operations. Pianos dropped on Bob's head will be replaced with pillows.</p>
            </div>
            <div className="cartoon-card manifesto-card">
              <span className="manifesto-num">03</span>
              <h3>Universal Naptime Mandate</h3>
              <p>A constitutional right to a 3-hour afternoon sleep (2:00 PM to 5:00 PM) for all cats. Ants, mice, and cockroaches found giggling or making antenna-wiggling sounds during these hours will be evicted.</p>
            </div>
            <div className="cartoon-card manifesto-card">
              <span className="manifesto-num">04</span>
              <h3>Antenna Chewing ban</h3>
              <p>Chewing television cables, hiding the remote controller in remote sewer ducts, or messing with the satellite dish orientation will be classified as culinary crimes of the highest order.</p>
            </div>
            <div className="cartoon-card manifesto-card">
              <span className="manifesto-num">05</span>
              <h3>Jack's Patent Safety Clause</h3>
              <p>All traps, chemical sprays, and giant vacuums designed by Jack must be verified by a board of sanity-checked cats. Traps should explode the target cockroach, not our headquarters.</p>
            </div>
            <div className="cartoon-card manifesto-card" style={{ background: "var(--primary-blue-light)" }}>
              <span className="manifesto-num">★</span>
              <h3>Join the swat front</h3>
              <p>Generate your customized membership card below, pick your favorite cleaning utensil, and share your license on Instagram with #OJP to counter the CJP swarm!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate Profiles */}
      <section className="candidates-section" style={{ background: "var(--bg-cream)" }}>
        <div className="container">
          <div className="section-title">
            <h2>The OJP High Command</h2>
            <p>Meet the cats who sit in front of the television set protecting your food.</p>
          </div>
          <div className="candidates-grid">
            <div className="cartoon-card candidate-card">
              <div className="candidate-avatar" style={{ background: "var(--primary-blue-light)" }}>
                <OggyIcon />
              </div>
              <h3>Oggy</h3>
              <div className="candidate-role">Party President / Lazy Visionary</div>
              <p className="candidate-bio">
                Loves watching TV, eating french fries, and knitting. He seeks a quiet life of peace, but is forced into action by the constant threat of fridge raids.
              </p>
            </div>
            <div className="cartoon-card candidate-card">
              <div className="candidate-avatar" style={{ background: "var(--jack-green-light)" }}>
                <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" fill="#4CAF50" stroke="#110D0A" strokeWidth="3" />
                  <ellipse cx="22" cy="24" rx="6" ry="8" fill="#FFF" stroke="#110D0A" strokeWidth="2" />
                  <ellipse cx="42" cy="24" rx="6" ry="8" fill="#FFF" stroke="#110D0A" strokeWidth="2" />
                  <circle cx="22" cy="24" r="2" fill="#110D0A" />
                  <circle cx="42" cy="24" r="2" fill="#110D0A" />
                  <rect x="24" y="32" width="16" height="6" rx="2" fill="#FFEB3B" stroke="#110D0A" strokeWidth="2.5" />
                  {/* angry eyebrows */}
                  <path d="M14 14 L26 20 M50 14 L38 20" stroke="#110D0A" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Jack</h3>
              <div className="candidate-role">Minister of Trap Engineering</div>
              <p className="candidate-bio">
                Oggy's cousin. A green cat with a short temper. He is obsessed with designing weapons, tanks, and chemical traps, which usually end up blowing up his own house.
              </p>
            </div>
            <div className="cartoon-card candidate-card">
              <div className="candidate-avatar" style={{ background: "#FFF0F5" }}>
                <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" fill="#FFF0F5" stroke="#110D0A" strokeWidth="3" />
                  <circle cx="32" cy="32" r="24" fill="#FFB7C5" />
                  <ellipse cx="23" cy="25" rx="5" ry="7" fill="#FFF" stroke="#110D0A" strokeWidth="2" />
                  <ellipse cx="41" cy="25" rx="5" ry="7" fill="#FFF" stroke="#110D0A" strokeWidth="2" />
                  <circle cx="23" cy="25" r="1.5" fill="#110D0A" />
                  <circle cx="41" cy="25" r="1.5" fill="#110D0A" />
                  <path d="M24 38 Q32 44 40 38" stroke="#110D0A" strokeWidth="2" fill="none" strokeLinecap="round" />
                  {/* Flower on head */}
                  <circle cx="32" cy="8" r="4" fill="#FFEB3B" stroke="#110D0A" strokeWidth="1.5" />
                </svg>
              </div>
              <h3>Olivia</h3>
              <div className="candidate-role">Minister of Flower Power</div>
              <p className="candidate-bio">
                Oggy's sweet neighbor. She loves nature and insects, and often advocates for talking to the cockroaches. She keeps OJP grounded with flower power.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section" style={{ borderBottom: "var(--border-ink)", padding: "80px 0" }}>
        <div className="container">
          <div className="cartoon-card founder-card">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div className="candidate-avatar" style={{ background: "var(--primary-blue-light)", width: "160px", height: "160px", boxShadow: "6px 6px 0 var(--ink)" }}>
                {/* Custom SVG for Founder/Humorous Glasses silhouette */}
                <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" fill="#FFD166" stroke="#110D0A" strokeWidth="3" />
                  <ellipse cx="22" cy="26" rx="7" ry="7" fill="#FFF" stroke="#110D0A" strokeWidth="2.5" />
                  <ellipse cx="42" cy="26" rx="7" ry="7" fill="#FFF" stroke="#110D0A" strokeWidth="2.5" />
                  <line x1="29" y1="26" x2="35" y2="26" stroke="#110D0A" strokeWidth="3" />
                  <circle cx="22" cy="26" r="2" fill="#110D0A" />
                  <circle cx="42" cy="26" r="2" fill="#110D0A" />
                  {/* Comical big mustache */}
                  <path d="M22 36 Q32 30 42 36 Q32 46 22 36" fill="#110D0A" stroke="#110D0A" strokeWidth="2" />
                  <path d="M32 38 Q32 44 26 44" stroke="#110D0A" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <h3 style={{ fontSize: "28px", marginTop: "16px" }}>Kharaj Chakraborty</h3>
              <div className="candidate-role" style={{ marginTop: "8px" }}>Founder &amp; Chief Refrigerator Warden</div>
            </div>
            <div>
              <h2 style={{ fontSize: "36px", marginBottom: "16px", color: "var(--primary-blue-dark)" }}>The Mastermind Behind the Swatter</h2>
              <p style={{ fontSize: "16px", lineHeight: "1.7", color: "var(--ink-muted)", marginBottom: "24px" }}>
                A visionary cat-izen who grew tired of the cockroach swarm taking over Instagram feeds. Armed with a heavy-duty flyswatter and a dream of a peaceful kitchen, Kharaj founded the **Oggy Janata Party (OJP)** to give Gen Z and cat lovers a united front to safeguard their leftovers and watch television in peace.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a 
                  href="https://www.instagram.com/kharajch" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cartoon-btn"
                  style={{ background: "var(--nose-red)" }}
                >
                  Founder Insta: @kharajch
                </a>
                <a 
                  href="https://www.instagram.com/oggy.janata.party.india" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cartoon-btn blue"
                >
                  Official Insta: @oggy.janata.party.india
                </a>
                <a 
                  href="mailto:oggyjanatapartyindia@gmail.com" 
                  className="cartoon-btn green"
                >
                  Email Us ✉️
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ID Card Generator Form */}
      <section id="license" className="generator-section">
        <div className="container">
          <div className="section-title">
            <h2>Flyswatter License Registry</h2>
            <p>Generate your official OJP membership card and kitchen weapon permit.</p>
          </div>

          <div className="generator-grid">
            {/* Input Form */}
            <div className="cartoon-card">
              <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>Fill Out Your Details</h3>
              <form onSubmit={handleGenerateCard}>
                <div className="form-group">
                  <label htmlFor="card-name">Agent Name / Handle</label>
                  <input
                    id="card-name"
                    type="text"
                    placeholder="Enter your name (e.g. SwatMaster)"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    maxLength={18}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="card-weapon">Preferred Swatting Weapon</label>
                  <select
                    id="card-weapon"
                    value={cardWeapon}
                    onChange={(e) => setCardWeapon(e.target.value)}
                  >
                    <option value="Classic Flyswatter">Classic Red Flyswatter</option>
                    <option value="Jack's Exploding Trap">Jack's Exploding Trap</option>
                    <option value="Olivia's Sweet Talk">Olivia's Sweet Talk</option>
                    <option value="Super Vacuum 3000">Super Vacuum 3000</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Current Rank Level</label>
                  <input
                    type="text"
                    value={`${cardRank} (Based on ${swatScore} swats)`}
                    disabled
                    style={{ background: "#e2f1ff", cursor: "not-allowed" }}
                  />
                  <p style={{ fontSize: "11px", color: "var(--ink-muted)", marginTop: "4px" }}>
                    Tip: Swat more cockroaches in the Extermination Zone above to increase your rank before generating!
                  </p>
                </div>

                <button type="submit" className="cartoon-btn" style={{ width: "100%", justifyContent: "center" }}>
                  Assemble My License Card 🛠️
                </button>
              </form>
            </div>

            {/* License Preview Display */}
            <div className="card-preview-area">
              <div className="id-card-wrap">
                <div className="id-card">
                  <div className="id-header">
                    <h4>OGGY JANATA PARTY (OJP)</h4>
                    <span>SWAT DEPT</span>
                  </div>
                  <div className="id-body">
                    <div className="id-photo">
                      <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="24" fill="#0088FF" stroke="#110D0A" strokeWidth="2" />
                        <ellipse cx="24" cy="26" rx="4" ry="6" fill="#FFF" />
                        <ellipse cx="40" cy="26" rx="4" ry="6" fill="#FFF" />
                        <circle cx="24" cy="26" r="1.5" fill="#110D0A" />
                        <circle cx="40" cy="26" r="1.5" fill="#110D0A" />
                        <circle cx="32" cy="35" r="7" fill="#FF3B3F" stroke="#110D0A" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="id-details">
                      <div className="id-name">{cardName || "YOUR NAME HERE"}</div>
                      <div className="id-stat">WEAPON: <strong style={{ color: "var(--nose-red)" }}>{cardWeapon}</strong></div>
                      <div className="id-stat">RANK: <strong style={{ color: "var(--jack-green)" }}>{cardRank}</strong></div>
                    </div>
                  </div>
                  <div className="id-footer">
                    <div className="id-footer-item">
                      <span>Serial Number</span>
                      <strong>{cardCreated ? generatedCardId : "OJP-XXXXXX-TEMP"}</strong>
                    </div>
                    <div className="id-footer-item" style={{ textAlign: "right" }}>
                      <span>Status</span>
                      <strong style={{ color: "var(--nose-red)" }}>APPROVED</strong>
                    </div>
                  </div>
                </div>
              </div>

              {cardCreated && (
                <button className="cartoon-btn green" onClick={downloadCardImage}>
                  Download PNG License Image 📥
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Satirical FAQ */}
      <section className="faq-section">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Queried Rants</h2>
            <p>Answers to questions you probably didn't think of asking.</p>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Are you guys related to any real-world political party?</h3>
              <p>Absolutely not! OJP is a purely fictional, satirical fan website built to celebrate the classic "Oggy and the Cockroaches" cartoon and counter the funny CJP meme trend on Instagram. We only care about fridge security.</p>
            </div>
            <div className="faq-item">
              <h3>What happens if Jack's trap blows up the website?</h3>
              <p>Our engineering department (led by Jack) has assured us that the backup servers are shielded with high-grade cardboard. If the site goes down, check if Oggy left the fridge open.</p>
            </div>
            <div className="faq-item">
              <h3>Can a cockroach join the OJP?</h3>
              <p>No. Our membership form checks for antennae or gluttony (looking at you, Dee Dee). Any cockroach attempting to register will be redirected to a flyswatter page.</p>
            </div>
            <div className="faq-item">
              <h3>How do I increase my rank to "Fridge Overlord"?</h3>
              <p>Spend time in the Extermination Zone above swatting cockroaches. Spanking Joey nets you 3 points, Marky 2 points, and Dee Dee 1 point. Your rank increases automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h2>OGGY JANATA PARTY</h2>
              <p>For a Cockroach-Free Kitchen</p>
              <div className="footer-blurb" style={{ marginBottom: "16px" }}>
                We are a digital-first, cartoon-loving front dedicated to keeping the cheese slices secure, napping properly, and swatting the kitchen menace. 
              </div>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                Contact Us: <a href="mailto:oggyjanatapartyindia@gmail.com" style={{ color: "var(--primary-blue)", textDecoration: "underline" }}>oggyjanatapartyindia@gmail.com</a>
              </p>
            </div>
            <div className="footer-social">
              <h4>Spread the word on Instagram</h4>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
                Use the tags <strong>#OJP</strong> and <strong>#OggyJanataParty</strong> to show off your SWAT license card!
              </p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>
                Follow Official: <a href="https://www.instagram.com/oggy.janata.party.india" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-blue)", textDecoration: "underline" }}>@oggy.janata.party.india</a><br/>
                Follow Founder: <a href="https://www.instagram.com/kharajch" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-blue)", textDecoration: "underline" }}>@kharajch</a>
              </p>
              <div className="social-links">
                <a href="#license" className="social-btn">Register License</a>
                <a href="#game" className="social-btn">Exterminate Bugs</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} Oggy Janata Party (OJP). No rights reserved. Satirical fan site.
            </div>
            <div className="disclaimer-badge">
              100% SATIRICAL FAN CONTENT
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Sound Floating Button */}
      <div className="sound-float">
        <button className="cartoon-btn" onClick={toggleSound} style={{ background: soundMuted ? "var(--ink)" : "var(--nose-red)" }}>
          {soundMuted ? "🔇 Enable Sounds" : "🔊 Sound Effects ON"}
        </button>
      </div>
    </>
  );
}

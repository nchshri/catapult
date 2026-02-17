'use client';

import { useState, useEffect, useRef } from 'react';

function SpiralLines() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.parentElement.offsetWidth;
    let height = canvas.parentElement.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let animId;
    let time = 0;

    // Define spiral configs — two mirrored spirals on left and right
    const spirals = [
      { cx: 0, cy: 0.5, direction: 1 },
      { cx: 1, cy: 0.5, direction: -1 },
    ];

    function draw() {
      ctx.clearRect(0, 0, width, height);
      time += 0.003;

      // ── ANIMATED GRID ──
      const gridSpacing = 60;
      const cols = Math.ceil(width / gridSpacing) + 1;
      const rows = Math.ceil(height / gridSpacing) + 1;

      // Vertical grid lines with pulse
      for (let c = 0; c < cols; c++) {
        const x = c * gridSpacing;
        const distFromCenter = Math.abs(x - width / 2) / (width / 2);
        const pulse = Math.sin(time * 1.2 + c * 0.3) * 0.5 + 0.5;
        const opacity = (0.03 + pulse * 0.025) * (1 - distFromCenter * 0.5);

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = `rgba(107, 229, 190, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Horizontal grid lines with pulse
      for (let r = 0; r < rows; r++) {
        const y = r * gridSpacing;
        const distFromCenter = Math.abs(y - height / 2) / (height / 2);
        const pulse = Math.sin(time * 1.5 + r * 0.25) * 0.5 + 0.5;
        const opacity = (0.03 + pulse * 0.025) * (1 - distFromCenter * 0.4);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = `rgba(107, 229, 190, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── GRID INTERSECTION DOTS ──
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * gridSpacing;
          const y = r * gridSpacing;
          const dist = Math.hypot(x - width / 2, y - height / 2);
          const maxDist = Math.hypot(width / 2, height / 2);
          const pulse = Math.sin(time * 2 + dist * 0.008) * 0.5 + 0.5;
          const dotOpacity = (0.06 + pulse * 0.08) * (1 - (dist / maxDist) * 0.6);
          const dotSize = 1 + pulse * 1;

          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(107, 229, 190, ${dotOpacity})`;
          ctx.fill();
        }
      }

      // ── SCANNING LINES (sharp horizontal sweeps) ──
      const scanCount = 3;
      for (let s = 0; s < scanCount; s++) {
        const scanY = ((time * 80 + s * (height / scanCount)) % (height + 40)) - 20;
        const scanOpacity = 0.07;
        const grad = ctx.createLinearGradient(0, scanY - 1, 0, scanY + 1);
        grad.addColorStop(0, `rgba(107, 229, 190, 0)`);
        grad.addColorStop(0.5, `rgba(107, 229, 190, ${scanOpacity})`);
        grad.addColorStop(1, `rgba(107, 229, 190, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 15, width, 30);
      }

      // ── DIAGONAL ACCENT LINES ──
      const numDiags = 8;
      for (let d = 0; d < numDiags; d++) {
        const offset = (d / numDiags) * (width + height);
        const animOffset = Math.sin(time + d * 0.7) * 30;
        const opacity = 0.025 + Math.sin(time * 1.8 + d) * 0.015;

        ctx.beginPath();
        ctx.moveTo(offset + animOffset - height, 0);
        ctx.lineTo(offset + animOffset, height);
        ctx.strokeStyle = `rgba(107, 229, 190, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── SPIRALS ──
      for (const spiral of spirals) {
        const cx = spiral.cx * width;
        const cy = spiral.cy * height;

        const numArms = 6;
        for (let arm = 0; arm < numArms; arm++) {
          const armOffset = (arm / numArms) * Math.PI * 2;
          const baseOpacity = 0.12 - arm * 0.012;

          ctx.beginPath();
          const segments = 180;
          for (let j = 0; j <= segments; j++) {
            const t = j / segments;
            const angle = t * Math.PI * 5 + armOffset + time * spiral.direction;
            const maxR = Math.min(width, height) * 0.55;
            const radius = t * maxR * (0.3 + (arm / numArms) * 0.7);

            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;

            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          ctx.strokeStyle = `rgba(107, 229, 190, ${baseOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Concentric ring bands
        const numRings = 4;
        for (let r = 0; r < numRings; r++) {
          const ringT = (r + 1) / (numRings + 1);
          const maxR = Math.min(width, height) * 0.55;
          const ringRadius = ringT * maxR;
          const wobble = Math.sin(time * 2 + r) * 4;

          ctx.beginPath();
          ctx.arc(cx, cy, ringRadius + wobble, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(107, 229, 190, ${0.06 - r * 0.01})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // ── HORIZONTAL FLOWING LINES ──
      const numLines = 10;
      for (let i = 0; i < numLines; i++) {
        const t = (i + 1) / (numLines + 1);
        const baseY = t * height;
        const opacity = 0.04 + Math.sin(t * Math.PI) * 0.03;

        ctx.beginPath();
        const step = 4;
        for (let x = 0; x <= width; x += step) {
          const wave = Math.sin((x / width) * Math.PI * 3 + time * 1.5 + i * 0.8) * 12;
          const y = baseY + wave;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(107, 229, 190, ${opacity})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // ── CORNER BRACKETS ──
      const bracketSize = 60;
      const bracketWeight = 1;
      const bracketOpacity = 0.12 + Math.sin(time * 2) * 0.04;
      ctx.strokeStyle = `rgba(107, 229, 190, ${bracketOpacity})`;
      ctx.lineWidth = bracketWeight;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(20, 20 + bracketSize);
      ctx.lineTo(20, 20);
      ctx.lineTo(20 + bracketSize, 20);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(width - 20 - bracketSize, 20);
      ctx.lineTo(width - 20, 20);
      ctx.lineTo(width - 20, 20 + bracketSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(20, height - 20 - bracketSize);
      ctx.lineTo(20, height - 20);
      ctx.lineTo(20 + bracketSize, height - 20);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - 20 - bracketSize, height - 20);
      ctx.lineTo(width - 20, height - 20);
      ctx.lineTo(width - 20, height - 20 - bracketSize);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}

const scheduleData = [
  {
    day: 'Friday, April 3',
    events: [
      { time: '8:00 PM', title: 'Check-In & Registration', description: 'Arrive, get your badge, and settle in.' },
      { time: '8:30 PM', title: 'Opening Ceremony', description: 'Kickoff, rules, and theme reveal.' },
      { time: '9:00 PM', title: 'Team Formation', description: 'Find teammates and brainstorm ideas.' },
      { time: '9:30 PM', title: 'Start Hacking!', description: 'The clock starts — begin building your project.' },
      { time: '11:00 PM', title: 'Late Night Snacks', description: 'Fuel up with snacks and drinks.' },
    ],
  },
  {
    day: 'Saturday, April 4',
    events: [
      { time: '8:00 AM', title: 'Breakfast', description: 'Start the day with a full breakfast spread.' },
      { time: '9:00 AM', title: 'Workshop: Intro to APIs', description: 'Learn how to integrate APIs into your project.' },
      { time: '10:30 AM', title: 'Workshop: UI/UX Design', description: 'Tips for building a polished frontend.' },
      { time: '12:00 PM', title: 'Lunch', description: 'Take a break and refuel.' },
      { time: '1:00 PM', title: 'Workshop: Cloud Deployment', description: 'Deploy your app to the cloud in minutes.' },
      { time: '2:30 PM', title: 'Mentor Office Hours', description: 'Get 1-on-1 help from industry mentors.' },
      { time: '4:00 PM', title: 'Workshop: AI/ML Crash Course', description: 'Add intelligence to your hack with ML.' },
      { time: '6:00 PM', title: 'Dinner', description: 'Dinner is served — keep those energy levels up.' },
      { time: '7:00 PM', title: 'Lightning Talks', description: 'Quick tech talks from sponsors and mentors.' },
      { time: '10:00 PM', title: 'Late Night Activities', description: 'Games, trivia, and more to keep you going.' },
    ],
  },
  {
    day: 'Sunday, April 5',
    events: [
      { time: '8:00 AM', title: 'Breakfast', description: 'Last day fuel-up.' },
      { time: '9:00 AM', title: 'Final Push', description: 'Polish your project and prepare your demo.' },
      { time: '10:00 AM', title: 'Hacking Ends — Code Freeze', description: 'Submit your project on Devpost.' },
      { time: '10:30 AM', title: 'Judging Begins', description: 'Present your project to the judges.' },
      { time: '12:30 PM', title: 'Lunch', description: 'Eat while judges deliberate.' },
      { time: '1:00 PM', title: 'Closing Ceremony & Awards', description: 'Winners announced, prizes awarded.' },
      { time: '2:00 PM', title: 'Event Ends', description: 'Thanks for hacking with us!' },
    ],
  },
];

export default function Schedule() {
  const [activeDay, setActiveDay] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="schedule" className="relative py-24 overflow-hidden">
      <SpiralLines />
      {/* Content wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
      {/* Section heading */}
      <div className={`text-center mb-16 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-4xl md:text-8xl font-bold text-white tracking-tight">
          Event Schedule
        </h2>
        <p className="mt-4 text-[#6be5be]/60 text-lg max-w-xl mx-auto">
          36 hours of hacking, workshops, and fun.
        </p>
        <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-[#6be5be] to-[#6be5be]/30" />
      </div>

      {/* Day tabs */}
      <div className={`flex justify-center gap-3 mb-12 flex-wrap transition-all duration-700 ease-out delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {scheduleData.map((dayData, index) => (
          <button
            key={dayData.day}
            onClick={() => setActiveDay(index)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide cursor-pointer border transition-all duration-300 ease-in-out ${activeDay === index ? 'bg-[#6be5be]/20 border-[#6be5be]/70 text-[#6be5be] shadow-[0_0_14px_rgba(107,229,190,0.3)]' : 'bg-transparent border-white/15 text-white/50 hover:border-white/30 hover:text-white/70'}`}
          >
            {dayData.day}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className={`absolute left-[22px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6be5be]/40 via-[#6be5be]/20 to-transparent transition-all duration-1000 ease-out delay-300 origin-top ${visible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`} />

        <div className="space-y-8">
          {scheduleData[activeDay].events.map((event, index) => {
            const isLeft = index % 2 === 0;
            const delay = 400 + index * 100;
            return (
              <div
                key={`${activeDay}-${index}`}
                className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} transition-all duration-600 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
              >
                {/* Dot on the timeline */}
                <div className="absolute left-[18px] md:left-1/2 md:-translate-x-1/2 top-1 z-10">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#6be5be] shadow-[0_0_8px_rgba(107,229,190,0.6)]" />
                </div>

                {/* Card */}
                <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-4 md:text-right' : 'md:pl-4 md:text-left'} group`}>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-[#6be5be]/[0.05] hover:border-[#6be5be]/20 hover:shadow-[0_0_20px_rgba(107,229,190,0.08)]">
                    <span className="inline-block px-3 py-1 mb-2 rounded-full text-xs font-semibold tracking-wider bg-[#6be5be]/10 text-[#6be5be] border border-[#6be5be]/20">
                      {event.time}
                    </span>
                    <h3 className="text-white font-bold text-lg leading-snug">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-white/40 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}

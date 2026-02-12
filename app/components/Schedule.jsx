'use client';

import { useState, useEffect, useRef } from 'react';

function SparkleOrbs() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.parentElement.offsetWidth;
    let height = canvas.parentElement.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const orbs = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      baseOpacity: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
      driftX: (Math.random() - 0.5) * 0.3,
      driftY: (Math.random() - 0.5) * 0.2,
    }));

    let animId;
    let time = 0;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      for (const orb of orbs) {
        orb.x += orb.driftX;
        orb.y += orb.driftY;

        if (orb.x < -10) orb.x = width + 10;
        if (orb.x > width + 10) orb.x = -10;
        if (orb.y < -10) orb.y = height + 10;
        if (orb.y > height + 10) orb.y = -10;

        const flicker = Math.sin(time * orb.speed + orb.phase) * 0.5 + 0.5;
        const opacity = orb.baseOpacity * flicker;
        const glowRadius = orb.radius * (2 + flicker * 3);

        // Outer glow
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, glowRadius
        );
        gradient.addColorStop(0, `rgba(107, 229, 190, ${opacity})`);
        gradient.addColorStop(0.4, `rgba(107, 229, 190, ${opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(107, 229, 190, 0)');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(107, 229, 190, ${Math.min(opacity * 1.8, 1)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width;
      canvas.height = height;
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
    <section ref={sectionRef} id="schedule" className="relative py-24 px-6 max-w-6xl mx-auto overflow-hidden">
      <SparkleOrbs />
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
    </section>
  );
}

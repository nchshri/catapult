'use client';

import Image from "next/image"
import Link from "next/link";

const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

const navItems = [
    { label: "HOME", section: "home" },
    { label: "ABOUT", section: "about" },
    { label: "SCHEDULE", section: "schedule" },
    { label: "FAQS", section: "faq" },
    { label: "SPONSORS", section: "sponsors" },
];

export default function NavBar() {
    return (
        <nav className="flex justify-between items-center">
            <div>
                <Image
                    className="ml-2"
                    src="/ta.png"
                    alt="Catapult Logo"
                    width={60}
                    height={60}
                />
            </div>
            <div className="flex items-center gap-4 text-lg text-[#6be5be] mr-7 z-20">
                {navItems.map((item) => (
                    <button
                        key={item.section}
                        onClick={() => scrollToSection(item.section)}
                        className="
                            relative px-5 py-2 rounded-full cursor-pointer
                            border border-[#6be5be]/30
                            bg-[#6be5be]/5
                            transition-all duration-300 ease-in-out
                            hover:bg-[#6be5be]/15
                            hover:border-[#6be5be]/70
                            hover:shadow-[0_0_12px_rgba(107,229,190,0.4),0_0_30px_rgba(107,229,190,0.15)]
                            hover:scale-105
                            active:scale-95
                        "
                    >
                        <span className="relative z-10 tracking-wide text-sm font-medium">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    )
}
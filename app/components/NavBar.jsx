'use client';

import Image from "next/image"
import Link from "next/link";

const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

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
            <div className="flex items-center gap-8 text-lg text-[#6be5be] mr-7 z-20">
                <h2 onClick={() => scrollToSection("home")} className="cursor-pointer">HOME</h2>
                <h2 onClick={() => scrollToSection("about")} className="cursor-pointer">ABOUT</h2>
                <h2 onClick={() => scrollToSection("schedule")} className="cursor-pointer">SCHEDULE</h2>
                <h2 onClick={() => scrollToSection("faq")} className="cursor-pointer">FAQS</h2>
                <h2 onClick={() => scrollToSection("sponsors")} className="cursor-pointer">SPONSORS</h2>
            </div>
        </nav>
    )
}
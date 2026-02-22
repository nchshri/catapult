"use client";
import { useState, useEffect } from "react";
import Spiral from "./Spiral";
import Lottie from "lottie-react";
import catapultAnimation from "../animations/catapult-load.json";
import Image from "next/image";

export default function Landing() {
    const [play, setPlay] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setPlay(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <Spiral />
            <div className="relative flex flex-col items-center -mt-45 z-10 text-center">
                <Image
                                    src="/CATAPULT.svg"
                                    alt="Catapult"
                                    width={800}
                                    height={800}
                                />
            </div>
        </section>
    );
}

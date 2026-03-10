'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import gsap from "gsap";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const pizzaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (!showSplash) {
      const tl = gsap.timeline();

      // Initial states
      gsap.set(pizzaRef.current, { y: 200, opacity: 0, scale: 0.8 });
      gsap.set(titleRef.current, { scale: 0.5, opacity: 0 });
      gsap.set(".ingredient", { opacity: 0, scale: 0, rotation: 180 });

      tl.to(mainContentRef.current, { opacity: 1, duration: 1 })
        .fromTo(mainContentRef.current, { backgroundSize: '110%' }, { backgroundSize: '100%', duration: 2, ease: "power2.out" }, "-=1")
        .to(titleRef.current, { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.7)" }, "-=1.5")
        .to(pizzaRef.current, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power4.out" }, "-=1")
        .to(".ingredient", {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          stagger: 0.2,
          ease: "elastic.out(1, 0.5)"
        }, "-=0.8");

      // Floating animation loop
      gsap.to(".ingredient-1", { y: -20, x: 10, repeat: -1, yoyo: true, duration: 3, ease: "sine.inOut" });
      gsap.to(".ingredient-2", { y: 20, x: -10, repeat: -1, yoyo: true, duration: 4, ease: "sine.inOut" });
      gsap.to(".ingredient-3", { y: -15, x: -15, repeat: -1, yoyo: true, duration: 2.5, ease: "sine.inOut" });
      gsap.to(".ingredient-4", { y: 10, x: 20, repeat: -1, yoyo: true, duration: 3.5, ease: "sine.inOut" });

      // Mouse Parallax Interaction
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5);
        const yPos = (clientY / window.innerHeight - 0.5);

        gsap.to(pizzaRef.current, {
          x: xPos * 30,
          y: yPos * 30,
          rotateY: xPos * 20,
          rotateX: -yPos * 20,
          duration: 1,
          ease: "power2.out"
        });

        gsap.to(titleRef.current, {
          x: xPos * -50,
          y: yPos * -50,
          duration: 1.5,
          ease: "power2.out"
        });

        gsap.to(".ingredient", {
          x: (i) => xPos * (40 + i * 20),
          y: (i) => yPos * (40 + i * 20),
          duration: 1.2,
          ease: "power2.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [showSplash]);

  return (
    <>
      <SplashScreen onComplete={handleSplashComplete} />

      <div
        ref={mainContentRef}
        className={`relative min-h-screen bg-[#050505] overflow-hidden opacity-0 perspective-1000`}
        style={{
          backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%), url("/bg.png")',
          backgroundBlendMode: 'overlay',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
        <Navbar />

        {/* Floating Background Text */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-10 -mt-32 md:-mt-48">
          <h1
            ref={titleRef}
            className="text-[8rem] md:text-[14rem] font-[900] text-white leading-[0.7] tracking-tighter italic text-center uppercase"
            style={{
              fontFamily: '"Arial Black", Gadget, sans-serif',
              WebkitTextStroke: '2px rgba(255,255,255,0.02)',
              filter: 'drop-shadow(0 20px 80px rgba(0,0,0,0.9))',
              letterSpacing: '-0.1em',
              background: 'linear-gradient(to bottom, #ffffff 30%, #a1a1a1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: 0.8
            }}
          >
            PIZZA <br className="md:hidden" /> KUY
          </h1>
        </div>

        {/* Main Pizza */}
        <div
          ref={pizzaRef}
          className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-full max-w-[500px] z-20 cursor-pointer group"
          onMouseEnter={() => {
            gsap.to(".pizza-glow", { opacity: 1, scale: 1.2, duration: 0.5 });
            gsap.to(".fire-effect", { scale: 1.1, opacity: 1, duration: 0.5 });
          }}
          onMouseLeave={() => {
            gsap.to(".pizza-glow", { opacity: 0.6, scale: 1, duration: 0.5 });
            gsap.to(".fire-effect", { scale: 1, opacity: 0.8, duration: 0.5 });
          }}
        >
          <div className="relative w-full aspect-square">
            {/* Fire Effects Left & Right */}
            <div className="fire-effect absolute -left-10 bottom-0 w-40 h-80 bg-gradient-to-t from-orange-600 via-red-600 to-transparent opacity-80 blur-3xl -z-10 animate-pulse transition-all duration-700 rounded-full mix-blend-screen" style={{ transform: 'rotate(-20deg)' }}></div>
            <div className="fire-effect absolute -right-10 bottom-0 w-40 h-80 bg-gradient-to-t from-orange-600 via-red-600 to-transparent opacity-80 blur-3xl -z-10 animate-pulse transition-all duration-700 rounded-full mix-blend-screen" style={{ transform: 'rotate(20deg)' }}></div>

            <Image
              src="/pizza-v2.png"
              alt="Delicious Pizza"
              fill
              className="object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,1)] transition-transform duration-700"
              priority
            />
            {/* Ambient Light/Fire effect */}
            <div className="pizza-glow absolute inset-x-0 bottom-0 h-full w-full bg-gradient-radial from-orange-600/30 to-transparent opacity-60 rounded-full blur-[100px] -z-10 transition-all duration-500"></div>
          </div>
        </div>

        {/* Floating Ingredients */}
        <div ref={ingredientsRef} className="absolute inset-0 pointer-events-none z-30">
          <div className="ingredient ingredient-1 absolute top-[15%] left-[10%] w-32 h-32 blur-[1px]">
            <Image src="/tomato-v2.png" alt="tomato" fill className="object-contain" />
          </div>
          <div className="ingredient ingredient-2 absolute top-[35%] right-[5%] w-28 h-28 blur-[2px]">
            <Image src="/chili-v2.png" alt="chili" fill className="object-contain" />
          </div>
          <div className="ingredient ingredient-3 absolute bottom-[15%] left-[5%] w-24 h-24">
            <Image src="/mint-v2.png" alt="mint" fill className="object-contain" />
          </div>
          <div className="ingredient ingredient-4 absolute top-[20%] right-[15%] w-20 h-20 opacity-40 rotate-45">
            <Image src="/tomato-v2.png" alt="tomato" fill className="object-contain" />
          </div>
        </div>

        {/* UI Elements / Call to Action */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 text-center">
          <button className="px-10 py-4 bg-orange-600 text-white font-black uppercase tracking-[0.2em] rounded-full hover:bg-orange-500 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(234,88,12,0.5)]">
            Explore Menu
          </button>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] mt-6">Developed by RifanFakhri</p>
        </div>
      </div>
    </>
  );
}

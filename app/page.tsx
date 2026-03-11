'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState('dark');
  const mainContentRef = useRef<HTMLDivElement>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const pizzaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    return () => observer.disconnect();
  }, []);

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

        // About Section Parallax
        gsap.to(".about-image-container", {
          x: xPos * 40,
          y: yPos * 40,
          rotateY: xPos * 10,
          duration: 1.2,
          ease: "power2.out"
        });

        gsap.to(".about-text-content", {
          x: xPos * -30,
          y: yPos * -30,
          duration: 1.5,
          ease: "power2.out"
        });

        gsap.to(".about-glow", {
          x: xPos * 100,
          y: yPos * 100,
          duration: 2,
          ease: "power2.out"
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      // --- SECTION TRANSITIONS ---
      // We animate the wrapper for scrolling to avoid conflict with inner element parallax
      gsap.fromTo(heroWrapperRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)"
        },
        {
          scrollTrigger: {
            trigger: "section:first-of-type",
            start: "top top",
            end: "bottom 40%",
            scrub: true,
            invalidateOnRefresh: true,
          },
          y: -100,
          opacity: 0,
          scale: 0.8,
          filter: "blur(20px)",
          ease: "none",
          immediateRender: false
        }
      );

      // Refresh ScrollTrigger after splash is gone and layout is settled
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      // --- ABOUT SECTION ANIMATIONS (Continuous Scrub) ---
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top bottom",
          end: "top 20%",
          scrub: 1.5,
          invalidateOnRefresh: true,
        }
      });

      aboutTl.from(".about-image-container", {
        x: -250,
        opacity: 0,
        scale: 0.8,
        rotate: -5,
        ease: "none"
      })
        .from(".about-floating", {
          opacity: 0,
          scale: 0,
          y: 100,
          stagger: 0.1,
          ease: "none"
        }, "<")
        .from(".about-text-content", {
          x: 150,
          opacity: 0,
          scale: 0.9,
          ease: "none"
        }, "-=0.3")
        .from(".about-glow", {
          opacity: 0,
          scale: 0.4,
          ease: "none"
        }, "<");

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }
  }, [showSplash]);

  return (
    <>
      <SplashScreen onComplete={handleSplashComplete} />

      <div
        ref={mainContentRef}
        className="relative min-h-screen bg-background transition-colors duration-500 overflow-x-hidden opacity-0 perspective-1000"
      >
        {/* Dynamic Global Background Effects */}
        <div
          className="fixed inset-0 transition-opacity duration-700 pointer-events-none"
          style={{ backgroundImage: 'var(--bg-gradient)' }}
        ></div>
        <div className="fixed inset-0 bg-[url('/bg.png')] bg-cover bg-center opacity-10 dark:opacity-40 mix-blend-overlay transition-opacity duration-700 pointer-events-none"></div>

        <Navbar />

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center">
          {/* Scroll Wrapper for Hero Elements */}
          <div ref={heroWrapperRef} className="absolute inset-0 flex flex-col items-center justify-center">

            {/* Floating Background Text Wrapper */}
            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-10 -mt-32 md:-mt-48 transition-all duration-500">
              <h1
                ref={titleRef}
                className="text-[8rem] md:text-[14rem] font-[900] text-foreground leading-[0.7] tracking-tighter italic text-center uppercase transition-colors duration-500 pb-10"
                style={{
                  fontFamily: '"Arial Black", Gadget, sans-serif',
                  textShadow: theme === 'dark'
                    ? '0 20px 50px rgba(255,255,255,0.1), 0 0 100px rgba(255,255,255,0.05)'
                    : '0 20px 50px rgba(0,0,0,0.1)',
                  letterSpacing: '-0.05em',
                }}
              >
                PIZZA <br className="md:hidden" /> KUY
              </h1>
            </div>

            {/* Main Pizza Wrapper */}
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

            {/* Floating Ingredients Wrapper */}
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
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 text-center">
            <button className="px-10 py-4 bg-orange-600 text-white font-black uppercase tracking-[0.2em] rounded-full hover:bg-orange-500 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(234,88,12,0.5)]">
              Explore Menu
            </button>
            <p className="text-black/40 dark:text-white/40 text-[10px] uppercase tracking-[0.4em] mt-6 transition-colors duration-500">Developed by RifanFakhri</p>
          </div>
        </section>

        {/* About Section */}
        <section
          ref={aboutRef}
          className="relative min-h-[90vh] py-32 pr-6 md:pr-12 flex flex-col md:flex-row items-center gap-0 bg-background transition-colors duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/bg.png')] opacity-10 dark:opacity-20 pointer-events-none transition-opacity duration-500"></div>

          <div className="about-glow absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[150px] -z-10 pointer-events-none transition-all duration-500"></div>

          {/* Left: Table Image (frame3.png) */}
          <div className="about-image-container relative w-full md:w-[50%] aspect-video -ml-4 md:-ml-8 group">
            <Image
              src="/frame3.png"
              alt="Our Table"
              fill
              className={`object-contain object-left transition-transform duration-1000 group-hover:scale-[1.03] drop-shadow-[0_0_60px_rgba(234,88,12,0.3)] ${theme === 'dark' ? 'brightness-100' : 'brightness-90'}`}
              priority
            />
            {/* Contextual Ingredients for about section */}
            <div className="absolute top-[10%] right-[10%] w-20 h-20 rotate-45 opacity-40 about-floating [animation:float_4s_ease-in-out_infinite]">
              <Image src="/chili-v2.png" alt="chili" fill className="object-contain" />
            </div>
            <div className="absolute bottom-[10%] left-[20%] w-16 h-16 -rotate-12 opacity-40 about-floating [animation:float_5s_ease-in-out_infinite_1s]">
              <Image src="/mint-v2.png" alt="mint" fill className="object-contain" />
            </div>
          </div>

          {/* Right: Content */}
          <div className="about-text-content w-full md:w-[50%] flex flex-col gap-10 relative z-10 py-10 md:-ml-24 lg:-ml-48">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-orange-500"></div>
                <span className="text-orange-500 font-bold uppercase tracking-[0.4em] text-xs">Our Heritage</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-foreground leading-[0.85] uppercase tracking-tighter transition-colors duration-500">
                Crafted with <br />
                <span
                  className="text-transparent border-t-2 border-orange-500 pt-5 mt-2 block"
                  style={{
                    WebkitTextStroke: theme === 'dark' ? '1.5px white' : '1.5px black',
                    transition: 'all 0.5s ease'
                  }}
                >
                  Mamah Faqih
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              <div className="relative">
                <span className="absolute -left-8 -top-4 text-7xl text-orange-500/20 font-serif leading-none">"</span>
                <p className="text-xl md:text-2xl text-foreground/90 leading-tight font-medium italic transition-colors duration-500">
                  Every slice tells a story of passion, tradition, and the finest ingredients we source.
                </p>
              </div>
              <p className="text-lg text-foreground/40 leading-relaxed max-w-lg border-l border-white/10 pl-6 transition-colors duration-500">
                We bring the authentic taste of tradition to your table. Our commitment to quality ingredients and artisanal techniques ensures every slice of Mamah Faqih pizza is a masterpiece.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-10">
              <button className="px-12 py-6 bg-orange-600 text-white uppercase tracking-widest font-black text-sm rounded-sm hover:bg-orange-700 transition-all duration-700 shadow-2xl hover:-translate-y-1">
                Read Our Story
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/30">
                  <Image src="/mint-v2.png" alt="Chef" width={48} height={48} className="object-cover scale-150 rotate-12" />
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground font-bold leading-none mb-1 transition-colors duration-500">Chef Faqih</span>
                  <span className="text-foreground/40 text-[10px] uppercase tracking-widest transition-colors duration-500">Master Pizzaiolo</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </>
  );
}

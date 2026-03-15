'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
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
  const menuRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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

      const isMobile = window.innerWidth < 768;
      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

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

      if (!isTouchDevice) {
        window.addEventListener("mousemove", handleMouseMove);
      }

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
          filter: isMobile ? "blur(0px)" : "blur(20px)",
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
          start: "top 85%",
          end: "top 25%",
          scrub: 2.5,
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

      // --- MENU SECTION ANIMATIONS ---
      const menuTl = gsap.timeline({
        scrollTrigger: {
          trigger: menuRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 2.5,
        }
      });

      menuTl.from(".menu-title", {
        x: -100,
        opacity: 0,
        duration: 1
      })
        .from(".menu-text", {
          y: 50,
          opacity: 0,
          duration: 1
        }, "-=0.5")
        .from(".menu-card", {
          scale: 0.8,
          opacity: 0,
          stagger: 0.2,
          duration: 1,
          ease: "back.out(1.7)"
        }, "-=0.8")
        .from(".menu-floating", {
          y: 100,
          opacity: 0,
          stagger: 0.2,
          duration: 1
        }, "-=1");

      gsap.to(".menu-floating", {
        y: (i) => (i % 2 === 0 ? -20 : 20),
        x: (i) => (i % 3 === 0 ? 15 : -15),
        repeat: -1,
        yoyo: true,
        duration: 3,
        stagger: 0.5,
        ease: "sine.inOut"
      });

      // --- CONTACT SECTION ANIMATIONS ---
      const contactTl = gsap.timeline({
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 2,
        }
      });

      contactTl.from(".contact-header", {
        y: 100,
        opacity: 0,
        duration: 1
      })
        .from(".contact-form", {
          x: 50,
          opacity: 0,
          duration: 1
        }, "-=0.5")
        .from(".contact-info", {
          x: -50,
          opacity: 0,
          duration: 1
        }, "<")
        .from(".contact-floating", {
          scale: 0,
          opacity: 0,
          stagger: 0.2,
          duration: 1
        }, "-=0.8");

      // --- SECTION EXIT TRANSITIONS ---
      // Transition from About to Menu
      gsap.to(aboutRef.current, {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "bottom 95%",
          end: "bottom 40%",
          scrub: 2,
        },
        opacity: 0.2,
        scale: 0.9,
        y: -50,
        filter: isMobile ? "blur(0px)" : "blur(10px)",
      });

      // Transition from Menu to next (if any)
      gsap.to(menuRef.current, {
        scrollTrigger: {
          trigger: menuRef.current,
          start: "bottom 95%",
          end: "bottom 20%",
          scrub: 2,
        },
        opacity: 0.2,
        scale: 0.9,
        filter: isMobile ? "blur(0px)" : "blur(10px)",
      });

      // Background Parallax
      gsap.to(".parallax-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

      // --- VELOCITY SKEW EFFECT ---
      // This makes elements "lean" as you scroll fast
      if (!isMobile) {
        let proxy = { skew: 0 };
        let skewSetter = gsap.quickSetter(".menu-card", "skewY", "deg");
        let clamp = gsap.utils.clamp(-10, 10);

        ScrollTrigger.create({
          onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -500);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.5,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
              });
            }
          }
        });
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }
  }, [showSplash]);

  return (
    <>
      <SplashScreen onComplete={handleSplashComplete} />
      <ChatWidget />

      <div
        ref={mainContentRef}
        className="relative min-h-screen bg-background transition-colors duration-500 overflow-x-hidden opacity-0 perspective-1000"
      >
        {/* Dynamic Global Background Effects */}
        <div
          className="fixed inset-0 transition-opacity duration-700 pointer-events-none"
          style={{ backgroundImage: 'var(--bg-gradient)' }}
        ></div>
        <div className="parallax-bg fixed inset-0 bg-[url('/bg.png')] bg-[length:120%_120%] bg-center opacity-10 dark:opacity-40 mix-blend-overlay transition-opacity duration-700 pointer-events-none"></div>

        <Navbar />

        {/* Hero Section */}
        <section id="home" className="relative h-screen flex items-center justify-center">
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
              className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-full max-w-[500px] z-20 cursor-pointer group will-change-transform"
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
                <div className="fire-effect hidden md:block absolute -left-10 bottom-0 w-40 h-80 bg-gradient-to-t from-orange-600 via-red-600 to-transparent opacity-80 blur-3xl -z-10 animate-pulse transition-all duration-700 rounded-full mix-blend-screen" style={{ transform: 'rotate(-20deg)' }}></div>
                <div className="fire-effect hidden md:block absolute -right-10 bottom-0 w-40 h-80 bg-gradient-to-t from-orange-600 via-red-600 to-transparent opacity-80 blur-3xl -z-10 animate-pulse transition-all duration-700 rounded-full mix-blend-screen" style={{ transform: 'rotate(20deg)' }}></div>

                <Image
                  src="/pizza-v2.png"
                  alt="Delicious Pizza"
                  fill
                  className="object-contain drop-shadow-xl md:drop-shadow-[0_50px_100px_rgba(0,0,0,1)] transition-transform duration-700"
                  sizes="(max-width: 768px) 80vw, 500px"
                  priority
                />
                {/* Ambient Light/Fire effect */}
                <div className="pizza-glow absolute inset-x-0 bottom-0 h-full w-full bg-gradient-radial from-orange-600/30 to-transparent opacity-60 rounded-full blur-[60px] md:blur-[100px] -z-10 transition-all duration-500"></div>
              </div>
            </div>

            {/* Floating Ingredients Wrapper */}
            <div ref={ingredientsRef} className="absolute inset-0 pointer-events-none z-30">
              <div className="ingredient ingredient-1 absolute top-[15%] left-[10%] w-32 h-32 md:blur-[1px] will-change-transform">
                <Image src="/tomato-v2.png" alt="tomato" fill className="object-contain" sizes="150px" />
              </div>
              <div className="ingredient ingredient-2 absolute top-[35%] right-[5%] w-28 h-28 md:blur-[2px] will-change-transform">
                <Image src="/chili-v2.png" alt="chili" fill className="object-contain" sizes="150px" />
              </div>
              <div className="ingredient ingredient-3 absolute bottom-[15%] left-[5%] w-24 h-24 will-change-transform">
                <Image src="/mint-v2.png" alt="mint" fill className="object-contain" sizes="100px" />
              </div>
              <div className="ingredient ingredient-4 absolute top-[20%] right-[15%] w-20 h-20 opacity-40 rotate-45 will-change-transform">
                <Image src="/tomato-v2.png" alt="tomato" fill className="object-contain" sizes="100px" />
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
          id="about"
          ref={aboutRef}
          className="relative min-h-[90vh] py-32 pr-6 md:pr-12 flex flex-col md:flex-row items-center gap-0 bg-transparent transition-colors duration-500 overflow-hidden"
        >
          {/* Removed local background div to maintain consistency with global background */}

          <div className="about-glow absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[150px] -z-10 pointer-events-none transition-all duration-500"></div>

          {/* Left: Table Image (frame3.png) */}
          <div className="about-image-container relative w-full md:w-[50%] aspect-video -ml-4 md:-ml-8 group will-change-transform">
            <Image
              src="/frame3.png"
              alt="Our Table"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-contain object-left transition-transform duration-1000 group-hover:scale-[1.03] drop-shadow-lg md:drop-shadow-[0_0_60px_rgba(234,88,12,0.3)] ${theme === 'dark' ? 'brightness-100' : 'brightness-90'}`}
              priority
            />
            {/* Contextual Ingredients for about section */}
            <div className="absolute top-[10%] right-[10%] w-20 h-20 rotate-45 opacity-40 about-floating [animation:float_4s_ease-in-out_infinite] will-change-transform">
              <Image src="/chili-v2.png" alt="chili" fill className="object-contain" sizes="100px" />
            </div>
            <div className="absolute bottom-[10%] left-[20%] w-16 h-16 -rotate-12 opacity-40 about-floating [animation:float_5s_ease-in-out_infinite_1s] will-change-transform">
              <Image src="/mint-v2.png" alt="mint" fill className="object-contain" sizes="100px" />
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
                <p className="text-xl md:text-2xl text-foreground/90 dark:text-foreground/90 leading-tight font-medium italic transition-colors duration-500">
                  Every slice tells a story of passion, tradition, and the finest ingredients we source.
                </p>
              </div>
              <p className="text-lg text-foreground/70 dark:text-foreground/40 leading-relaxed max-w-lg border-l border-foreground/20 dark:border-white/10 pl-6 transition-colors duration-500">
                We bring the authentic taste of tradition to your table. Our commitment to quality ingredients and artisanal techniques ensures every slice of Mamah Faqih pizza is a masterpiece.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-10">
              <div className="relative group self-start cursor-pointer">
                {/* Brush stroke background simulation */}
                <div className="absolute inset-0 bg-orange-600 -rotate-2 scale-110 group-hover:rotate-0 transition-transform duration-500"
                  style={{ clipPath: 'polygon(2% 15%, 98% 5%, 100% 50%, 96% 95%, 4% 90%, 0% 45%)' }}></div>
                <button className="relative px-12 py-5 text-white font-black uppercase tracking-[0.2em] text-sm whitespace-nowrap">
                  Read Our Story
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/30">
                  <Image src="/mint-v2.png" alt="Chef" width={48} height={48} className="object-cover scale-150 rotate-12" />
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground font-bold leading-none mb-1 transition-colors duration-500">Chef Faqih</span>
                  <span className="text-foreground/60 dark:text-foreground/40 text-[10px] uppercase tracking-widest transition-colors duration-500">Master Pizzaiolo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section
          id="menu"
          ref={menuRef}
          className="relative min-h-screen py-32 px-6 md:px-24 bg-transparent overflow-hidden transition-colors duration-500"
        >
          {/* Floating Ingredients */}
          <div className="menu-floating absolute top-[15%] left-[10%] w-32 h-32 rotate-[-45deg] opacity-80 pointer-events-none z-10 will-change-transform hidden md:block">
            <Image src="/chili-v2.png" alt="chili" fill className="object-contain" sizes="150px" />
          </div>
          <div className="menu-floating absolute -bottom-10 -left-10 w-64 h-64 rotate-[-15deg] opacity-90 pointer-events-none z-10 will-change-transform hidden md:block">
            <Image src="/tomato-v2.png" alt="tomato" fill className="object-contain" sizes="300px" />
          </div>
          <div className="menu-floating absolute top-10 right-10 w-40 h-40 rotate-[135deg] opacity-80 pointer-events-none z-10 will-change-transform hidden md:block">
            <Image src="/mint-v2.png" alt="mint" fill className="object-contain" sizes="200px" />
          </div>
          <div className="menu-floating absolute bottom-10 right-[5%] w-32 h-32 rotate-[15deg] opacity-80 pointer-events-none z-10 will-change-transform hidden md:block">
            <Image src="/chili-v2.png" alt="chili" fill className="object-contain" sizes="150px" />
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start relative z-20">
            {/* Left Column: Heading & Text */}
            <div className="w-full lg:w-[40%] flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <h2 className="menu-title text-6xl md:text-8xl font-black text-foreground uppercase leading-[0.85] tracking-tighter transition-colors duration-500" style={{ fontFamily: 'var(--font-heading)' }}>
                  ALL MENUS <br />
                  IN OUR <br />
                  RESTAURANT
                </h2>
                <div className="w-24 h-[3px] bg-orange-600"></div>
              </div>

              <div className="menu-text flex flex-col gap-8">
                <p className="text-xl md:text-2xl text-foreground font-medium italic opacity-80 transition-colors duration-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <div className="relative group self-start cursor-pointer">
                  {/* Brush stroke background simulation */}
                  <div className="absolute inset-0 bg-orange-600 -rotate-2 scale-110 group-hover:rotate-0 transition-transform duration-500"
                    style={{ clipPath: 'polygon(2% 15%, 98% 5%, 100% 50%, 96% 95%, 4% 90%, 0% 45%)' }}></div>
                  <button className="relative px-12 py-5 text-white font-black uppercase tracking-[0.2em] text-sm whitespace-nowrap">
                    More Menu
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Grid */}
            <div className="w-full lg:w-[60%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="menu-card relative group will-change-transform">
                  {/* Rough orange offset background */}
                  <div className="absolute inset-0 bg-orange-600 scale-[1.05] translate-x-3 translate-y-3 skew-y-1 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1"
                    style={{ clipPath: 'polygon(0% 5%, 15% 0%, 85% 5%, 100% 0%, 95% 45%, 100% 100%, 85% 95%, 15% 100%, 0% 95%, 5% 45%)' }}>
                  </div>

                  {/* Image with torn edge effect */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 border-none transition-transform duration-500 group-hover:scale-[0.98] will-change-transform"
                    style={{ clipPath: 'polygon(5% 0%, 95% 5%, 100% 15%, 95% 85%, 100% 100%, 15% 95%, 0% 100%, 5% 50%, 0% 0%)' }}>
                    <Image
                      src="/menu1.png"
                      alt={`Special Menu ${i}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          ref={contactRef}
          className="relative min-h-screen py-24 md:py-32 px-6 sm:px-12 md:px-24 bg-transparent overflow-hidden transition-colors duration-500 flex flex-col items-center justify-center"
        >
          {/* Floating Ingredients */}
          <div className="contact-floating absolute top-[20%] right-[15%] w-32 h-32 rotate-12 opacity-40 pointer-events-none z-10 will-change-transform hidden md:block">
            <Image src="/chili-v2.png" alt="chili" fill className="object-contain" sizes="150px" />
          </div>
          <div className="contact-floating absolute bottom-[15%] left-[10%] w-40 h-40 -rotate-12 opacity-40 pointer-events-none z-10 will-change-transform hidden md:block">
            <Image src="/tomato-v2.png" alt="tomato" fill className="object-contain" sizes="200px" />
          </div>

          <div className="max-w-6xl w-full relative z-20">
            <div className="contact-header text-center mb-12 md:mb-20 flex flex-col items-center gap-6">
              <span className="text-orange-500 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">Get In Touch</span>
              <h2 className="text-4xl sm:text-6xl md:text-9xl font-black text-foreground uppercase tracking-tighter leading-[0.9] md:leading-[0.8] mb-4">
                Let's Make <br />
                <span className="text-transparent" style={{ WebkitTextStroke: theme === 'dark' ? '1.5px white' : '1.5px black' }}>Something Delicious</span>
              </h2>
              <div className="w-24 md:w-32 h-[3px] bg-orange-600"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Info Column */}
              <div className="contact-info flex flex-col gap-12">
                <div className="flex flex-col gap-6 md:gap-8">
                  <div className="flex items-start gap-4 md:gap-6 border-l-2 border-orange-500 pl-6 md:pl-8 py-2">
                    <span className="text-orange-500 font-black text-3xl md:text-4xl">01.</span>
                    <div className="flex flex-col">
                      <h4 className="text-foreground font-bold uppercase tracking-widest text-base md:text-lg mb-1 md:mb-2">Location</h4>
                      <p className="text-sm md:text-base text-foreground/70 dark:text-foreground/60 leading-relaxed font-medium">Jl. Pizza Enak No. 123, <br />Jakarta, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 md:gap-6 border-l-2 border-orange-500 pl-6 md:pl-8 py-2">
                    <span className="text-orange-500 font-black text-3xl md:text-4xl">02.</span>
                    <div className="flex flex-col">
                      <h4 className="text-foreground font-bold uppercase tracking-widest text-base md:text-lg mb-1 md:mb-2">Contact</h4>
                      <p className="text-sm md:text-base text-foreground/70 dark:text-foreground/60 leading-relaxed font-medium">+62 123 4567 8900 <br />hello@mamahfaqih.com</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                    <a key={social} href="#" className="text-xs uppercase tracking-[0.2em] font-black text-foreground/50 dark:text-foreground/40 hover:text-orange-500 transition-colors duration-500">
                      {social}
                    </a>
                  ))}
                </div>
              </div>

              {/* Form Column */}
              <div className="contact-form bg-foreground/[0.04] dark:bg-white/[0.02] border border-foreground/10 dark:border-foreground/5 p-6 sm:p-10 md:p-16 rounded-3xl backdrop-blur-3xl relative">
                <form className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-orange-600 dark:text-orange-500/60">Name</label>
                      <input type="text" placeholder="Your Name" className="bg-transparent border-b border-foreground/20 dark:border-foreground/10 py-3 text-lg focus:outline-none focus:border-orange-500 transition-colors duration-500 placeholder:text-foreground/30" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-orange-600 dark:text-orange-500/60">Email</label>
                      <input type="email" placeholder="Your Email" className="bg-transparent border-b border-foreground/20 dark:border-foreground/10 py-3 text-lg focus:outline-none focus:border-orange-500 transition-colors duration-500 placeholder:text-foreground/30" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-orange-600 dark:text-orange-500/60">Message</label>
                    <textarea rows={4} placeholder="How can we help?" className="bg-transparent border-b border-foreground/20 dark:border-foreground/10 py-3 text-lg focus:outline-none focus:border-orange-500 transition-colors duration-500 resize-none placeholder:text-foreground/30"></textarea>
                  </div>
                  <button className="self-start mt-6 px-10 md:px-16 py-4 md:py-6 bg-orange-600 text-white font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-orange-700 transition-all duration-700 shadow-2xl hover:-translate-y-2 rounded-lg">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="relative bg-neutral-900 text-white py-20 px-6 md:px-24 overflow-hidden">
          {/* Background Texture Overlay */}
          <div className="absolute inset-0 bg-[url('/bg.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
              {/* Brand Info */}
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl font-black italic text-white">M</span>
                  </div>
                  <span className="text-2xl font-black tracking-tighter text-orange-500 uppercase">Mamah Faqih</span>
                </div>
                <p className="text-white/60 leading-relaxed font-medium">
                  Crafting artisanal pizzas with love and tradition since 2010. Every slice is a journey to the heart of Italy.
                </p>
                <div className="flex gap-4">
                  {['Instagram', 'Twitter', 'Facebook', 'TikTok'].map((social) => (
                    <div key={social} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all cursor-pointer group">
                      <span className="text-[10px] font-bold group-hover:scale-110 transition-transform">{social[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col gap-8">
                <h4 className="text-lg font-bold uppercase tracking-widest text-orange-500">Navigation</h4>
                <ul className="flex flex-col gap-4 text-white/60 font-medium uppercase tracking-widest text-xs">
                  <li><a href="#home" className="hover:text-orange-500 transition-colors">Home</a></li>
                  <li><a href="#about" className="hover:text-orange-500 transition-colors">About Us</a></li>
                  <li><a href="#menu" className="hover:text-orange-500 transition-colors">Our Menu</a></li>
                  <li><a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Opening Hours */}
              <div className="flex flex-col gap-8">
                <h4 className="text-lg font-bold uppercase tracking-widest text-orange-500">Opening Hours</h4>
                <div className="flex flex-col gap-4 text-white/60 font-medium">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Mon - Thu</span>
                    <span className="text-white">11:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Fri - Sat</span>
                    <span className="text-white">11:00 - 23:30</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Sunday</span>
                    <span className="text-orange-500">Closed</span>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="flex flex-col gap-8">
                <h4 className="text-lg font-bold uppercase tracking-widest text-orange-500">Subscribe</h4>
                <p className="text-white/60 text-sm font-medium">Join our mailing list for exclusive offers.</p>
                <div className="relative group">
                  <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-lg py-4 px-6 focus:outline-none focus:border-orange-600 transition-colors font-medium text-white" />
                  <button className="absolute right-2 top-2 bottom-2 bg-orange-600 px-4 rounded-md text-xs font-black uppercase hover:bg-orange-700 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.4em] font-medium text-white/40">
              <p>© 2026 Mamah Faqih Pizza. All Rights Reserved.</p>
              <div className="flex gap-10">
                <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
              </div>
              <p>Designed by RifanFakhri</p>
            </div>
          </div>

          {/* Huge Background Decorative Text */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-5">
            <span className="text-[20rem] font-black text-white whitespace-nowrap">MAMAH FAQIH</span>
          </div>
        </footer>
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

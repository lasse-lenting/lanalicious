'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function UsageInstructions() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [hasFinishedCards, setHasFinishedCards] = useState(false);
  const [isInSection, setIsInSection] = useState(false);

  const throttleRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const SCROLL_THROTTLE = 800; // ms between steps

  const cards = [
    { number: '01', title: 'was op 30 graden', description: 'Gebruik koud of lauw water (max 30°C) voor de beste resultaten. Heet water kan de wolvezels beschadigen.' },
    { number: '02', title: 'Voeg Lanalicious toe', description: 'Voeg 1-2 doppen Lanalicious toe aan het wasmiddelvakje. De lanoline vult de natuurlijke oliën aan.' },
    { number: '03', title: 'Zacht programma', description: 'Gebruik het wolprogramma of een korte, zachte cyclus. Vermijd centrifugeren op hoge snelheid.' },
    { number: '04', title: 'Niet in de droger', description: 'Laat je wollen kleding aan de lucht drogen. Leg plat neer om de vorm te behouden.' },
  ];

  // ---- Helpers
  const sectionIsCentered = () => {
    const el = sectionRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // Consider "in section" when the sticky content is fully on screen
    return rect.top <= 50 && rect.bottom >= vh - 50;
  };

  const lockPageScroll = () => {
    const prev = document.body.style.overflow;
    if (prev !== 'hidden') {
      document.body.style.overflow = 'hidden';
      (document.body as any).__prevOverflow = prev;
    }
  };

  const unlockPageScroll = () => {
    const prev = (document.body as any).__prevOverflow ?? '';
    document.body.style.overflow = prev;
  };

  const stepCards = (direction: 1 | -1) => {
    const now = Date.now();
    if (now - throttleRef.current < SCROLL_THROTTLE) return;
    throttleRef.current = now;

    setHasFinishedCards(false);

    setCurrentCard(prev => {
      const next = Math.max(0, Math.min(cards.length - 1, prev + direction));
      // If we’re at last card and trying to go further down -> finish & release
      if (direction === 1 && next === cards.length - 1 && prev === cards.length - 1) {
        setHasFinishedCards(true);
        // Give a tiny delay then release page scroll so natural scroll continues
        if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = setTimeout(() => {
          unlockPageScroll();
        }, 120);
      }
      return next;
    });
  };

  // ---- Scroll / view detection
  useEffect(() => {
    const onScroll = () => {
      const inView = sectionIsCentered();
      setIsInSection(inView);

      // If user scrolls back above the section, reset & unlock
      if (sectionRef.current) {
        const top = sectionRef.current.getBoundingClientRect().top;
        if (top > 100) {
          setCurrentCard(0);
          setHasFinishedCards(false);
          unlockPageScroll();
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // ---- Lock/unlock body scrolling while in section & not finished
  useEffect(() => {
    const shouldLock = isInSection && !hasFinishedCards;
    if (shouldLock) lockPageScroll();
    else unlockPageScroll();

    return () => {
      unlockPageScroll();
    };
  }, [isInSection, hasFinishedCards]);

  // ---- Wheel handler (desktop)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!(isInSection && !hasFinishedCards)) return;
      // We trap scroll within the cards
      e.preventDefault();
      e.stopPropagation();

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;

      // If trying to scroll down while finished -> allow page scroll (unlocked by effect)
      if (dir === 1 && hasFinishedCards) return;

      // If at first card and scrolling up, allow page to move out (unlock)
      if (dir === -1 && currentCard === 0) {
        unlockPageScroll();
        return;
      }

      stepCards(dir);
    };

    // Must be non-passive to call preventDefault
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel as any);
  }, [isInSection, hasFinishedCards, currentCard, cards.length]);

  // ---- Touch handlers (mobile)
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (!(isInSection && !hasFinishedCards)) return;
      touchStartYRef.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!(isInSection && !hasFinishedCards)) return;
      if (touchStartYRef.current == null) return;

      const dy = touchStartYRef.current - e.touches[0].clientY; // positive = swipe up (scroll down)
      if (Math.abs(dy) < 10) return;

      e.preventDefault();
      e.stopPropagation();

      const dir: 1 | -1 = dy > 0 ? 1 : -1;

      if (dir === 1 && hasFinishedCards) return;
      if (dir === -1 && currentCard === 0) {
        unlockPageScroll();
        return;
      }
      stepCards(dir);
      touchStartYRef.current = e.touches[0].clientY; // reset for continued move
    };
    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart as any);
      window.removeEventListener('touchmove', onTouchMove as any);
      window.removeEventListener('touchend', onTouchEnd as any);
    };
  }, [isInSection, hasFinishedCards, currentCard]);

  // ---- Keyboard (arrows / PageUp/Down / space)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(isInSection && !hasFinishedCards)) return;

      const keysDown = ['ArrowDown', 'PageDown', ' '];
      const keysUp = ['ArrowUp', 'PageUp'];

      if (keysDown.includes(e.key)) {
        e.preventDefault();
        stepCards(1);
      } else if (keysUp.includes(e.key)) {
        e.preventDefault();
        // At first card + up? let page out
        if (currentCard === 0) {
          unlockPageScroll();
          return;
        }
        stepCards(-1);
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown as any);
  }, [isInSection, hasFinishedCards, currentCard]);

  // Cleanup any pending timers
  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      unlockPageScroll();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="container mx-auto min-h-[400vh] relative overflow-hidden overscroll-contain"
      aria-label="Gebruiksinstructies voor wassen"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-[1350px] mx-auto">
          <div className="
            bg-[#EE7693] 
            rounded-[43px] 
            px-6 md:px-10 lg:px-14 
            pt-6 md:pt-10 lg:pt-14
            h-[80vh] 
            flex flex-col lg:flex-row 
            gap-10
            
          ">
            {/* Left: simpler headline */}
            <div className="lg:w-1/2 flex items-center">
              <div>
                <span className="inline-block rounded-xl bg-white/30 text-white/90 font-hardbop text-[3vw] px-6 py-[-10px] mb-6">
                  tutorial
                </span>
                <h2 className="font-hardbop font-black text-white leading-[0.95] text-4xl md:text-5xl lg:text-8xl max-w-[16ch]">
                  hoe te gebruiken?
                </h2>
                {/* (Optional helper) */}
                {!hasFinishedCards && isInSection && (
                  <p className="text-white/60 text-xs md:text-sm mt-4">
                    Scroll om door de stappen te gaan
                  </p>
                )}
              </div>
            </div>

            {/* Right: large, soft cards */}
            <div className="lg:w-1/2 flex flex-col">
              <div className="flex-1 relative overflow-hidden">
                <motion.div
                  className="space-y-6"
                  animate={{ y: `-${currentCard * 25}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {cards.map((card, i) => (
                    <motion.div
                      key={i}
                      className="bg-white/30 rounded-[36px] px-6 md:px-10 py-6 min-h-[160px] md:min-h-[200px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] flex items-center"
                      animate={{
                        opacity: i === currentCard ? 1 : 0.65,
                        scale: i === currentCard ? 1 : 0.97,
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <div className="flex items-center gap-6 md:gap-10">
                        {/* Number */}
                        <div className="text-white/90 font-hardbop font-black leading-none select-none
                                    text-6xl md:text-7xl lg:text-8xl flex items-center">
                          {card.number}
                        </div>

                        {/* Text (right-aligned, simpler) */}
                        <div className="ml-auto text-right">
                          <h3 className="text-white font-hardbop font-black leading-tight
                                     text-2xl md:text-3xl">
                            {card.title}
                          </h3>
                          {/* If you want *very* minimal, comment this out */}
                          <p className="text-white/85 text-sm md:text-base mt-1 max-w-[30ch] ml-auto">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}

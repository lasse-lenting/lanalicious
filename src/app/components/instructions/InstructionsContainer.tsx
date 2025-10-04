'use client';
import React, { useRef, useEffect, useState } from "react";
import InstructionsCard from "./InstructionsCard";

export default function ScrollSync() {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const childRef = useRef<HTMLDivElement | null>(null);
    const childWrapperRef = useRef<HTMLDivElement | null>(null);
    const [scrollPercentage, setScrollPercentage] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!parentRef.current || !childRef.current || !childWrapperRef.current) return;

            const parent = parentRef.current;
            const child = childRef.current;
            const childWrapper = childWrapperRef.current;

            const parentHeight = parent.offsetHeight;
            const parentRect = parent.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const childHeight = child.offsetHeight;

            // Child is centered, so it sticks when parent.top = 50vh - childHeight/2
            // and unsticks when parent.bottom = 50vh + childHeight/2
            const childTop = (viewportHeight - childHeight) / 2;
            const childBottom = childTop + childHeight;

            let percentage = 0;

            // Parent hasn't reached the sticky position yet
            if (parentRect.top > childTop) {
                percentage = 0;
            }
            // Parent has passed the sticky position
            else if (parentRect.bottom < childBottom) {
                percentage = 1;
            }
            // While sticky
            else {
                const scrollableRange = parentHeight - viewportHeight;
                const scrolledAmount = childTop - parentRect.top;
                percentage = scrolledAmount / scrollableRange;
            }

            setScrollPercentage(percentage);

            childWrapper.scrollTop =
                (childWrapper.scrollHeight - childWrapper.clientHeight) * percentage;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>

            <div
                ref={parentRef}
                className="h-[270vh] w-full"
            >
                <div
                    ref={childRef}
                    className="sticky top-[17.5vh] flex h-[65vh] container mx-auto justify-end rounded-3xl bg-secondary px-24"
                >
                    <div className="grid grid-cols-2 w-full h-full">

                        <div className="w-full py-8 flex flex-col items-start justify-center">
                            <div className="flex items-center justify-center text-6xl bg-white/30 px-4 py-2 rounded-2xl font-hardbop font-bold tracking-[0.03em] text-white">
                                tutorial
                            </div>
                            <h2 className="text-9xl font-hardbop font-bold tracking-[0.015em] text-white">hoe te gebruiken?</h2>
                        </div>

                        <div
                            ref={childWrapperRef}
                            className=" overflow-hidden"
                        >
                            <InstructionsCard title="01" instruction="Vul een teil met lauw water (max 30°C)." />
                            <InstructionsCard title="02" instruction="Voeg wolwasmiddel toe en roer door." />
                            <InstructionsCard title="03" instruction="Week de wol 5-10 minuten zonder te wringen." />
                            <InstructionsCard title="04" instruction="Spoel voorzichtig uit met schoon lauw water." />
                            <InstructionsCard title="05" instruction="Knijp overtollig water uit en droog plat." />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
import Button from "./components/Button";
import ScrollBanner from "./components/ScrollBanner";
import ScrollIndicator from "./components/ScrollIndicator";
import ThreeBottleScene from "./components/ThreeBottleScene";

export default function Home() {
  return (
    <div>
      {/* Container for sections 1 & 2 where bottle should be active */}
      <div className="relative">
        {/* Sticky bottle container - will stick during sections 1 & 2 */}
        <div className="sticky top-0 h-screen z-40 pointer-events-none">
          <ThreeBottleScene />
        </div>

        {/* Content that overlays the bottle */}
        <div className="-mt-[100vh] relative">
          {/* Section 1: Hero */}
          <section className="h-screen relative">
            <div className="sm:p-8 p-4 h-full">
              {/* SVG Clip Path Definition */}
              <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                  <clipPath id="rounded-rect-clip" clipPathUnits="objectBoundingBox">
                    <path d="M 0.1,0 
                     L 0.9,0 
                     Q 1,0 1,0.1 
                     L 1,0.9 
                     Q 1,1 0.9,1 
                     L 0.1,1 
                     Q 0,1 0,0.9 
                     L 0,0.1 
                     Q 0,0 0.1,0 Z" />
                  </clipPath>
                </defs>
              </svg>

              <div className="bg-primary w-full h-full flex flex-col items-center justify-center relative"
                style={{
                  clipPath: 'url(#rounded-rect-clip)',
                }}
              >
                <h1 className="text-[18vw] font-hardbop font-black sm:tracking-[12px] tracking-[6px] text-white">LANAL&nbsp;&nbsp;CIOUS</h1>
                <ScrollIndicator />
              </div>
            </div>
          </section>
          <div className="py-12">
            <ScrollBanner />
          </div>


          {/* Section 2: Text Content with Bottle Final Position */}
          <section className="h-screen relative flex items-center mt-[300px] mx-auto">
            <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div></div>

              {/* Right side - Text content */}
              <div>
                <h2 className="text-8xl lg:text-7xl font-bold font-hardbop text-primary leading-tight">
                  waarom lanoline?
                </h2>

                <p className="text-lg text-gray-600 leading-relaxed mt-6">
                  Lanoline is de natuurlijke beschermlaag van schaapsvacht een wax die wol soepel, waterafstotend en sterk houdt.
                  Gewone wasmiddelen strippen deze natuurlijke oliën weg, waardoor wol droog, ruw en kwetsbaar wordt.
                  Lanalicious vult deze lanoline aan tijdens het wassen,
                  zodat jouw wollen kleding langer mooi blijft.
                  Het resultaat? Zachtere wol, betere vorm, en kleding die jaren meegaat. 
                </p>
                <Button className="mt-6">Learn More</Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
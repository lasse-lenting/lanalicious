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

              <div className="bg-[#116A7B] w-full h-full flex flex-col items-center justify-center relative"
                style={{
                  clipPath: 'url(#rounded-rect-clip)',
                }}
              >
                <h1 className="text-[18vw] font-hardbop font-black sm:tracking-[12px] tracking-[6px] text-white">LANAL&nbsp;&nbsp;CIOUS</h1>
                <ScrollIndicator />
              </div>
            </div>
          </section>
          <div className="py-32">
            <ScrollBanner />
          </div>


          {/* Section 2: Text Content with Bottle Final Position */}
          <section className="h-screen relative flex items-center">
            <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left side - Space for bottle (bottle will be positioned here) */}
              <div className="flex justify-center lg:justify-start">
                <div className="w-72 h-72 bg-white/50 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 font-hardbop text-sm">Bottle positioned here</span>
                </div>
              </div>

              {/* Right side - Text content */}
              <div className="space-y-6">
                <h2 className="text-5xl lg:text-6xl font-hardbop font-black text-gray-800 leading-tight">
                  PREMIUM
                  <span className="block text-[#116A7B]">LANOLIN</span>
                </h2>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover the power of pure lanolin in our premium skincare collection.
                  Natural, effective, and gentle on your skin.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#116A7B] rounded-full"></div>
                    <span className="text-gray-700">100% Natural Lanolin</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#116A7B] rounded-full"></div>
                    <span className="text-gray-700">Deeply Moisturizing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#116A7B] rounded-full"></div>
                    <span className="text-gray-700">Gentle & Effective</span>
                  </div>
                </div>
                <Button>Learn More</Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Section 3: Test Section (bottle should stop here) */}
      <section className="h-screen relative bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white space-y-6">
          <h2 className="text-6xl font-hardbop font-black mb-4">TEST SECTION</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            This is Section 3. The bottle should stay locked in Section 2 position.
          </p>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mt-8">
            <h3 className="text-2xl font-hardbop font-bold mb-3">Bottle Status</h3>
            <p className="text-lg">
              ✅ Bottle should remain visible in final position<br />
              ✅ Bottle stops moving when reaching this section<br />
              ✅ Animation locked after Section 2
            </p>
          </div>
        </div>
      </section>
      {/* section 4 */}
      <section className="h-screen relative bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white space-y-6">
          <h2 className="text-6xl font-hardbop font-black mb-4">TEST SECTION</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            This is Section 3. The bottle should stay locked in Section 2 position.
          </p>
        </div>
      </section>
    </div>
  );
}
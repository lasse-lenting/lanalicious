import ScrollBanner from "./components/ScrollBanner";
import ScrollIndicator from "./components/ScrollIndicator";
export default function Home() {
  return (
    <div className="sm:p-8 p-4 relative">
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
      
      <div className="bg-[#116A7B] w-full h-[95vh] flex flex-col items-center justify-center relative"
      style={{
        clipPath: 'url(#rounded-rect-clip)',
      }}
      >
        <h1 className="text-[18vw] font-hardbop font-black sm:tracking-[12px] tracking-[6px] text-white">LANAL&nbsp;&nbsp;CIOUS</h1>
        <ScrollIndicator />
      </div>

      {/* Pink Scrolling Banner */}
    <div className="w-full h-[1240px]">
      <ScrollBanner />
    </div>
    </div>
  );
}
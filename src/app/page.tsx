import ScrollBanner from "./components/ScrollBanner";
import ScrollIndicator from "./components/ScrollIndicator";

export default function Home() {
  return (
    <div className="sm:p-8 p-4 relative">
      <div className="squircle bg-[#116A7B] w-full h-[95vh] p-8 flex flex-col items-center justify-center relative">
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

import React from 'react';

export default function MacBook({ children }) {
  return (
    <div className="relative w-full max-w-4xl flex flex-col items-center select-none filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)]">
      
      {/* ========================================= */}
      {/* MACBOOK DISPLAY LID (Top Half) */}
      {/* ========================================= */}
      <div className="relative w-full rounded-t-2xl bg-[#26282b] border-[3px] border-[#3a3d42] p-2.5 pb-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
        
        {/* Subtle rubber display gasket */}
        <div className="relative w-full rounded-xl bg-black border border-stone-800 overflow-hidden shadow-2xl">
          
          {/* Top Bezel Notch with Camera */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-3.5 bg-black rounded-b-md z-40 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#151618] border border-stone-800"></span>
            {/* Green webcam indicator */}
            <span className="w-1 h-1 rounded-full bg-emerald-500/80 animate-pulse"></span>
          </div>

          {/* macOS Top Status Bar */}
          <div className="h-6 bg-black/80 backdrop-blur-md border-b border-white/10 px-3 flex items-center justify-between text-[11px] font-sans text-stone-300 z-30 relative">
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold text-xs"></span>
              <span className="font-semibold text-white text-[11px]">FounderOS</span>
              <span className="hidden sm:inline text-stone-400">File</span>
              <span className="hidden sm:inline text-stone-400">Financials</span>
              <span className="hidden sm:inline text-stone-400">Unit-Economics</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono-code text-stone-400">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                WiFi: Queens_Basement_2G
              </span>
              <span>100% ⚡</span>
              <span className="text-white font-medium">1:47 AM</span>
            </div>
          </div>

          {/* SCREEN CONTENT AREA (16:10 Aspect Ratio Feel) */}
          <div className="relative w-full h-[58vh] sm:h-[62vh] bg-[#0c0d0f] overflow-hidden flex flex-col font-sans">
            {children}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MACBOOK HINGE & BOTTOM BASE (Chassis) */}
      {/* ========================================= */}
      <div className="relative w-[102%] -mt-1 h-5 sm:h-6 bg-gradient-to-b from-[#3a3d42] via-[#2a2c30] to-[#1c1d20] rounded-b-xl border-t border-white/20 shadow-2xl flex items-center justify-center">
        {/* Thumb scoop notch for opening lid */}
        <div className="w-20 sm:w-24 h-1.5 bg-[#141517] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>
      </div>
      
      {/* MacBook Table Reflection / Shadow */}
      <div className="w-[96%] h-3 bg-black/60 blur-md -mt-1 rounded-full"></div>
    </div>
  );
}

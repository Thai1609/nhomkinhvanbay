import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  lightText?: boolean;
}

export default function Logo({ className = '', lightText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3.5 group select-none ${className}`}>
      {/* Spectacular Premium Glass & Steel Logo Icon */}
      <div className="relative w-11 h-11 flex-shrink-0 transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
        {/* Glow effect in background */}
        <div className="absolute inset-0 bg-sky-400/20 rounded-2xl blur-md group-hover:bg-sky-400/35 transition-all duration-500" />
        
        <svg
          className="relative w-full h-full drop-shadow-md"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Framed border mimicking modern slimline aluminium profile */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="20"
            fill="url(#premiumGlassBg)"
            stroke="url(#aluFrame)"
            strokeWidth="3.5"
          />
          
          {/* Laminated Glass diagonal sheen reflecting architectural lighting */}
          <path
            d="M84 16L16 84"
            stroke="url(#glassSheen)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.65"
          />

          <path
            d="M86 30L42 74"
            stroke="url(#glassSheen)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* V7 Monogram with glass reflection overlay */}
          <g className="transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            {/* The 'V' Segment */}
            <path
              d="M26 34L45 71H53L35 34H26Z"
              fill="url(#vGradient)"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
            />
            {/* The '7' Segment representing layered structural glass */}
            <path
              d="M45 34H74L55 72H46L62 40H45V34Z"
              fill="url(#sevenGradient)"
              className="drop-shadow-[2px_2px_6px_rgba(0,0,0,0.2)]"
            />
          </g>

          {/* Beautiful Glass Shimmer Star (Sparkle) */}
          <polygon 
            points="74,15 76.5,22.5 84,25 76.5,27.5 74,35 71.5,27.5 64,25 71.5,22.5" 
            fill="#ffffff" 
            className="animate-pulse"
            opacity="0.9"
          />
          <circle cx="74" cy="25" r="2" fill="#ffffff" />

          <defs>
            {/* Soft glazed frosted glass bg with subtle sky tint */}
            <linearGradient id="premiumGlassBg" x1="6" y1="6" x2="94" y2="94" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f0fdf4" /> {/* Very subtle architectural mint/glass green tint */}
              <stop offset="100%" stopColor="#e0f2fe" /> {/* Soft sky blue */}
            </linearGradient>

            {/* Aluminum frame premium finish */}
            <linearGradient id="aluFrame" x1="6" y1="6" x2="94" y2="94" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Diagonal high-fidelity glass highlight */}
            <linearGradient id="glassSheen" x1="16" y1="84" x2="84" y2="16" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Elegant glazed sapphire look for 'V' */}
            <linearGradient id="vGradient" x1="26" y1="34" x2="53" y2="71" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            {/* Laminated structural glass finish for '7' */}
            <linearGradient id="sevenGradient" x1="45" y1="34" x2="74" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Modern, high-end Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-[10px] font-black tracking-[0.3em] text-sky-500 uppercase">
            NHÔM KÍNH
          </span>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
        </div>
        <div className={`text-xl font-black tracking-tight mt-0.5 transition-colors duration-300 ${
          lightText 
            ? 'text-white group-hover:text-sky-300' 
            : 'text-gray-900 group-hover:text-sky-600'
        }`}>
          Văn Bảy<span className="text-sky-500">.</span>
        </div>
      </div>
    </div>
  );
}

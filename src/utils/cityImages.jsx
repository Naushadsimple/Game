import React from 'react';

/**
 * High-quality vector illustrations for all Vyapar cities, railway stations, and utilities.
 * Guarantees proper visuals offline with no external image dependencies.
 */
export function PropertyLandmarkImage({ propertyId, className = 'w-full h-full' }) {
  switch (propertyId) {
    case 'guwahati':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gw-sky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
          </defs>
          <rect width="200" height="120" fill="url(#gw-sky)" />
          {/* Brahmaputra Hills */}
          <path d="M-10 90 Q40 40 100 80 T210 60 L210 120 L-10 120 Z" fill="#15803D" />
          <path d="M50 85 Q110 50 170 85 T220 75 L220 120 L50 120 Z" fill="#166534" opacity="0.8" />
          {/* Kamakhya Temple Silhouette */}
          <path d="M85 85 L100 45 L115 85 Z" fill="#991B1B" />
          <path d="M92 45 L100 35 L108 45 Z" fill="#F59E0B" />
          <circle cx="100" cy="32" r="3" fill="#FDE047" />
          {/* Brahmaputra River Water */}
          <path d="M0 95 C40 85 80 105 130 92 C160 85 185 92 200 90 L200 120 L0 120 Z" fill="#0284C7" />
          {/* Boat */}
          <path d="M35 102 Q48 108 60 102 L56 106 Q48 110 38 106 Z" fill="#78350F" />
          <line x1="48" y1="102" x2="48" y2="92" stroke="#78350F" strokeWidth="1.5" />
          <polygon points="48,93 55,98 48,100" fill="#FEF08A" />
        </svg>
      );

    case 'bhubaneswar':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FEF3C7" />
          {/* Sun disc */}
          <circle cx="100" cy="60" r="42" fill="#F59E0B" opacity="0.3" />
          {/* Konark Wheel Rim */}
          <circle cx="100" cy="60" r="38" fill="none" stroke="#78350F" strokeWidth="5" />
          <circle cx="100" cy="60" r="32" fill="none" stroke="#B45309" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="100" cy="60" r="14" fill="#B45309" stroke="#78350F" strokeWidth="3" />
          <circle cx="100" cy="60" r="5" fill="#FEF3C7" />
          {/* 8 Main Spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="100"
              y1="60"
              x2={100 + 36 * Math.cos((angle * Math.PI) / 180)}
              y2={60 + 36 * Math.sin((angle * Math.PI) / 180)}
              stroke="#78350F"
              strokeWidth="3.5"
            />
          ))}
          {/* Temple shikhara silhouette on left & right */}
          <path d="M10 120 L25 50 L40 120 Z" fill="#92400E" opacity="0.6" />
          <path d="M160 120 L175 50 L190 120 Z" fill="#92400E" opacity="0.6" />
          <rect y="112" width="200" height="8" fill="#78350F" />
        </svg>
      );

    case 'patna':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#E0F2FE" />
          <circle cx="155" cy="35" r="18" fill="#FDE047" opacity="0.8" />
          {/* Golghar Granary */}
          <ellipse cx="100" cy="95" rx="65" ry="50" fill="#D97706" />
          {/* Spiral Stairs highlight */}
          <path d="M38 95 C 45 65, 80 50, 100 50 C 120 50, 155 65, 162 95" fill="none" stroke="#FEF3C7" strokeWidth="3" strokeDasharray="4 2" />
          <ellipse cx="100" cy="50" rx="10" ry="4" fill="#78350F" />
          <rect x="97" y="44" width="6" height="6" fill="#F59E0B" />
          <rect y="100" width="200" height="20" fill="#15803D" />
          {/* Ganga water foreground */}
          <path d="M0 110 Q50 106 100 110 T200 110 L200 120 L0 120 Z" fill="#0284C7" />
        </svg>
      );

    case 'varanasi':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FFEDD5" />
          <circle cx="100" cy="45" r="24" fill="#FB923C" />
          {/* Ghat Temple spires */}
          <polygon points="20,80 32,35 44,80" fill="#C2410C" />
          <polygon points="50,80 65,25 80,80" fill="#9A3412" />
          <polygon points="85,80 98,40 112,80" fill="#EA580C" />
          <polygon points="120,80 135,20 150,80" fill="#9A3412" />
          <polygon points="155,80 170,38 185,80" fill="#C2410C" />
          {/* Stone Ghat Steps */}
          <rect x="0" y="80" width="200" height="6" fill="#78350F" />
          <rect x="0" y="86" width="200" height="6" fill="#92400E" />
          <rect x="0" y="92" width="200" height="6" fill="#A16207" />
          {/* Holy Ganga with floating diyas */}
          <rect x="0" y="98" width="200" height="22" fill="#0369A1" />
          <circle cx="50" cy="108" r="3" fill="#FBBF24" />
          <circle cx="100" cy="112" r="3.5" fill="#F59E0B" />
          <circle cx="150" cy="107" r="3" fill="#FBBF24" />
        </svg>
      );

    case 'lucknow':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#CFFAFE" />
          {/* Rumi Darwaza Grand Arch */}
          <path d="M40 115 L40 60 Q100 15 160 60 L160 115 Z" fill="#0891B2" />
          <path d="M60 115 L60 70 Q100 35 140 70 L140 115 Z" fill="#164E63" />
          {/* Intricate central arch cut */}
          <path d="M75 115 L75 80 Q100 55 125 80 L125 115 Z" fill="#CFFAFE" />
          {/* Minarets on sides */}
          <rect x="32" y="45" width="10" height="70" fill="#0E7490" />
          <circle cx="37" cy="42" r="6" fill="#F59E0B" />
          <rect x="158" y="45" width="10" height="70" fill="#0E7490" />
          <circle cx="163" cy="42" r="6" fill="#F59E0B" />
          {/* Ground */}
          <rect y="112" width="200" height="8" fill="#155E75" />
        </svg>
      );

    case 'bhopal':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FCE7F3" />
          {/* Upper Lake backdrop */}
          <circle cx="160" cy="40" r="22" fill="#F472B6" opacity="0.5" />
          {/* Sanchi Stupa Dome */}
          <ellipse cx="100" cy="85" rx="60" ry="40" fill="#DB2777" />
          {/* Harmika & Chhatra */}
          <rect x="94" y="40" width="12" height="6" fill="#9D174D" />
          <line x1="100" y1="40" x2="100" y2="22" stroke="#9D174D" strokeWidth="2.5" />
          <ellipse cx="100" cy="28" rx="10" ry="2.5" fill="#F43F5E" />
          <ellipse cx="100" cy="24" rx="7" ry="2" fill="#F43F5E" />
          <ellipse cx="100" cy="20" rx="4" ry="1.5" fill="#F43F5E" />
          {/* Lake waters */}
          <path d="M0 88 C50 80 120 95 200 85 L200 120 L0 120 Z" fill="#0284C7" />
          <rect y="114" width="200" height="6" fill="#0369A1" />
        </svg>
      );

    case 'indore':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FDF2F8" />
          {/* Rajwada 7-tier palace */}
          <rect x="55" y="25" width="90" height="90" fill="#BE185D" />
          {/* Tier levels */}
          <rect x="50" y="45" width="100" height="4" fill="#831843" />
          <rect x="45" y="65" width="110" height="4" fill="#831843" />
          <rect x="40" y="85" width="120" height="5" fill="#831843" />
          {/* Grand wooden doorway */}
          <path d="M85 115 L85 90 Q100 80 115 90 L115 115 Z" fill="#FEF08A" />
          {/* Windows jharokhas */}
          {[65, 85, 105, 125].map((x, i) => (
            <React.Fragment key={i}>
              <rect x={x} y="32" width="8" height="9" rx="2" fill="#FBCFE8" />
              <rect x={x} y="52" width="8" height="9" rx="2" fill="#FBCFE8" />
              <rect x={x} y="72" width="8" height="9" rx="2" fill="#FBCFE8" />
            </React.Fragment>
          ))}
          <polygon points="100,10 65,25 135,25" fill="#831843" />
          <rect y="115" width="200" height="5" fill="#500724" />
        </svg>
      );

    case 'nagpur':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FFF7ED" />
          {/* Orange Orchard trees */}
          <circle cx="40" cy="70" r="30" fill="#16A34A" />
          <rect x="36" y="85" width="8" height="30" fill="#78350F" />
          <circle cx="160" cy="70" r="30" fill="#16A34A" />
          <rect x="156" y="85" width="8" height="30" fill="#78350F" />
          {/* Oranges on trees */}
          <circle cx="30" cy="60" r="5" fill="#EA580C" />
          <circle cx="50" cy="65" r="5" fill="#EA580C" />
          <circle cx="40" cy="80" r="5" fill="#EA580C" />
          <circle cx="150" cy="60" r="5" fill="#EA580C" />
          <circle cx="170" cy="65" r="5" fill="#EA580C" />
          {/* Zero Mile Stone Pillar */}
          <polygon points="95,115 98,35 102,35 105,115" fill="#9A3412" />
          <rect x="92" y="30" width="16" height="6" rx="2" fill="#C2410C" />
          <circle cx="100" cy="25" r="5" fill="#F97316" />
          <rect y="112" width="200" height="8" fill="#15803D" />
        </svg>
      );

    case 'jaipur':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FFF1F2" />
          {/* Hawa Mahal Pink Facade */}
          <polygon points="100,15 150,115 50,115" fill="#E11D48" />
          {/* 5 Tiers of Jharokha Windows */}
          {[
            { y: 35, count: 1 },
            { y: 52, count: 3 },
            { y: 70, count: 5 },
            { y: 88, count: 7 },
            { y: 104, count: 9 },
          ].map((tier, idx) => {
            const startX = 100 - ((tier.count - 1) * 12) / 2;
            return Array.from({ length: tier.count }).map((_, wIdx) => (
              <path
                key={`${idx}-${wIdx}`}
                d={`M${startX + wIdx * 12 - 4} ${tier.y + 6} L${startX + wIdx * 12 - 4} ${tier.y} Q${startX + wIdx * 12} ${tier.y - 4} ${startX + wIdx * 12 + 4} ${tier.y} L${startX + wIdx * 12 + 4} ${tier.y + 6} Z`}
                fill="#FFF"
                stroke="#9F1239"
                strokeWidth="1"
              />
            ));
          })}
          <rect y="114" width="200" height="6" fill="#881337" />
        </svg>
      );

    case 'ahmedabad':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FEF3C7" />
          <circle cx="45" cy="35" r="18" fill="#F59E0B" opacity="0.6" />
          {/* Atal Bridge Curved Silhouette */}
          <path d="M10 80 Q100 20 190 80" fill="none" stroke="#D97706" strokeWidth="6" />
          <path d="M10 85 Q100 35 190 85" fill="none" stroke="#B45309" strokeWidth="3" />
          {/* Sabarmati River */}
          <rect y="82" width="200" height="38" fill="#0284C7" />
          {/* Spinning Wheel Charkha on left */}
          <circle cx="45" cy="65" r="14" fill="none" stroke="#78350F" strokeWidth="2.5" />
          <line x1="45" y1="51" x2="45" y2="79" stroke="#78350F" strokeWidth="1.5" />
          <line x1="31" y1="65" x2="59" y2="65" stroke="#78350F" strokeWidth="1.5" />
          <line x1="25" y1="78" x2="70" y2="78" stroke="#78350F" strokeWidth="3" />
        </svg>
      );

    case 'surat':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FFFBEB" />
          {/* Silk roll curves */}
          <path d="M-10 110 C40 40 100 110 210 50 L210 120 L-10 120 Z" fill="#EA580C" opacity="0.4" />
          <path d="M-10 115 C60 60 140 120 210 70 L210 120 L-10 120 Z" fill="#C2410C" opacity="0.6" />
          {/* Grand Diamond Gemstone */}
          <polygon points="100,20 135,45 100,95 65,45" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          <polygon points="100,20 135,45 100,50 65,45" fill="#7DD3FC" />
          <polygon points="100,50 135,45 100,95" fill="#0284C7" />
          <polygon points="100,50 65,45 100,95" fill="#0369A1" />
          {/* Diamond sparkles */}
          <path d="M145 25 L150 20 L155 25 L150 30 Z" fill="#FDE047" />
          <path d="M50 40 L54 35 L58 40 L54 45 Z" fill="#FDE047" />
        </svg>
      );

    case 'chandigarh':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FEE2E2" />
          {/* Shivalik Hills */}
          <polygon points="0,75 50,45 100,75" fill="#9CA3AF" />
          <polygon points="70,75 130,35 190,75" fill="#6B7280" />
          <polygon points="140,75 175,50 210,75" fill="#9CA3AF" />
          {/* Open Hand Monument */}
          <path d="M100 85 L100 55 C90 50 85 40 85 32 C85 24 95 24 97 32 C99 20 108 20 110 32 C112 22 120 22 122 35 C125 45 115 55 105 58 L105 85 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
          {/* Base pedestal */}
          <rect x="90" y="85" width="20" height="25" fill="#B91C1C" />
          <rect y="110" width="200" height="10" fill="#15803D" />
        </svg>
      );

    case 'kochi':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FEF3C7" />
          <circle cx="150" cy="40" r="22" fill="#F97316" />
          {/* Palm tree */}
          <path d="M30 115 Q40 60 25 25" fill="none" stroke="#78350F" strokeWidth="4" />
          <path d="M25 25 Q10 20 0 28" fill="none" stroke="#15803D" strokeWidth="3" />
          <path d="M25 25 Q25 10 35 5" fill="none" stroke="#15803D" strokeWidth="3" />
          <path d="M25 25 Q40 20 50 30" fill="none" stroke="#15803D" strokeWidth="3" />
          {/* Chinese Fishing Net cantilever */}
          <line x1="80" y1="100" x2="160" y2="45" stroke="#78350F" strokeWidth="4" />
          <line x1="160" y1="45" x2="185" y2="85" stroke="#78350F" strokeWidth="2" />
          <line x1="120" y1="72" x2="150" y2="105" stroke="#78350F" strokeWidth="2" />
          {/* Net netting */}
          <polygon points="120,72 160,45 185,85 150,105" fill="#FDE68A" opacity="0.6" stroke="#92400E" strokeWidth="1" strokeDasharray="3 2" />
          {/* Arabian Sea */}
          <rect y="100" width="200" height="20" fill="#0284C7" />
        </svg>
      );

    case 'goa':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#BAE6FD" />
          <circle cx="100" cy="40" r="25" fill="#FDE047" />
          {/* Church facade */}
          <rect x="130" y="55" width="45" height="50" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          <polygon points="152,40 130,55 175,55" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          <line x1="152" y1="32" x2="152" y2="40" stroke="#DC2626" strokeWidth="2" />
          <line x1="148" y1="35" x2="156" y2="35" stroke="#DC2626" strokeWidth="2" />
          {/* Beach sands and waves */}
          <path d="M0 80 Q50 90 100 80 T200 85 L200 120 L0 120 Z" fill="#FBBF24" />
          <path d="M0 95 Q60 100 120 92 T200 95 L200 120 L0 120 Z" fill="#0284C7" />
          {/* Twin palm trees */}
          <path d="M40 100 Q45 50 30 35" fill="none" stroke="#78350F" strokeWidth="3" />
          <path d="M30 35 Q15 30 10 38" fill="none" stroke="#16A34A" strokeWidth="2.5" />
          <path d="M30 35 Q30 20 40 15" fill="none" stroke="#16A34A" strokeWidth="2.5" />
          <path d="M30 35 Q45 32 50 40" fill="none" stroke="#16A34A" strokeWidth="2.5" />
        </svg>
      );

    case 'pune':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FEF9C3" />
          {/* Shaniwar Wada Massive Fort Ramparts */}
          <rect x="30" y="50" width="140" height="65" fill="#713F12" />
          {/* Fortress Crenellations (Merlons) */}
          {[35, 55, 75, 95, 115, 135, 155].map((x, i) => (
            <rect key={i} x={x} y="40" width="12" height="12" fill="#713F12" />
          ))}
          {/* Main Dilli Darwaza Arched Gate */}
          <path d="M80 115 L80 75 Q100 60 120 75 L120 115 Z" fill="#3B1C08" />
          {/* Maratha Saffron Flag */}
          <line x1="45" y1="40" x2="45" y2="15" stroke="#451A03" strokeWidth="2" />
          <polygon points="45,16 65,23 45,30" fill="#EA580C" />
          <rect y="114" width="200" height="6" fill="#14532D" />
        </svg>
      );

    case 'hyderabad':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FEF08A" />
          {/* Charminar Structure */}
          <rect x="60" y="50" width="80" height="65" fill="#CA8A04" />
          {/* Grand Central Arch */}
          <path d="M78 115 L78 72 Q100 55 122 72 L122 115 Z" fill="#854D0E" />
          {/* Four Iconic Minarets */}
          {/* Left outer */}
          <rect x="52" y="20" width="10" height="95" fill="#A16207" />
          <ellipse cx="57" cy="18" rx="7" ry="4" fill="#EAB308" />
          {/* Left inner */}
          <rect x="68" y="28" width="8" height="30" fill="#854D0E" />
          {/* Right inner */}
          <rect x="124" y="28" width="8" height="30" fill="#854D0E" />
          {/* Right outer */}
          <rect x="138" y="20" width="10" height="95" fill="#A16207" />
          <ellipse cx="143" cy="18" rx="7" ry="4" fill="#EAB308" />
          {/* Decorative domes */}
          <circle cx="100" cy="46" r="8" fill="#FACC15" />
          <rect y="115" width="200" height="5" fill="#713F12" />
        </svg>
      );

    case 'bengaluru':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#E0F2FE" />
          {/* Modern Silicon IT Tower on Right */}
          <rect x="145" y="25" width="35" height="90" fill="#0284C7" />
          {[32, 45, 58, 71, 84, 97].map((y, i) => (
            <rect key={i} x="150" y={y} width="25" height="6" fill="#BAE6FD" />
          ))}
          {/* Vidhana Soudha Granite Monument */}
          <rect x="25" y="60" width="105" height="55" fill="#64748B" />
          {/* Columns */}
          {[30, 42, 54, 66, 78, 90, 102, 114].map((x, i) => (
            <line key={i} x1={x} y1="62" x2={x} y2="115" stroke="#E2E8F0" strokeWidth="3" />
          ))}
          {/* Central Dome */}
          <ellipse cx="75" cy="50" rx="22" ry="14" fill="#475569" />
          <polygon points="75,25 65,36 85,36" fill="#F59E0B" />
          <line x1="75" y1="25" x2="75" y2="18" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="75" cy="16" r="3" fill="#F59E0B" />
          <rect y="114" width="200" height="6" fill="#15803D" />
        </svg>
      );

    case 'chennai':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#DCFCE7" />
          {/* Kapaleeshwarar Temple Gopuram */}
          <polygon points="60,115 70,30 110,30 120,115" fill="#15803D" />
          {/* Gopuram tiers */}
          <rect x="68" y="45" width="44" height="6" fill="#166534" />
          <rect x="65" y="62" width="50" height="6" fill="#166534" />
          <rect x="63" y="80" width="54" height="6" fill="#166534" />
          <rect x="60" y="98" width="60" height="6" fill="#166534" />
          {/* Kalasam peaks */}
          <polygon points="90,18 80,30 100,30" fill="#F59E0B" />
          {/* Marina Beach Lighthouse */}
          <polygon points="155,115 158,35 168,35 171,115" fill="#DC2626" />
          <rect x="156" y="55" width="14" height="12" fill="#FFFFFF" />
          <rect x="157" y="85" width="12" height="12" fill="#FFFFFF" />
          <circle cx="163" cy="30" r="6" fill="#FDE047" />
          {/* Marina beach shore */}
          <rect y="112" width="200" height="8" fill="#FBBF24" />
        </svg>
      );

    case 'kolkata':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#D1FAE5" />
          {/* Victoria Memorial White Marble Facade */}
          <rect x="40" y="65" width="120" height="48" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Grand Marble Dome */}
          <ellipse cx="100" cy="52" rx="30" ry="20" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="100" cy="30" r="4" fill="#047857" />
          <line x1="100" y1="30" x2="100" y2="20" stroke="#047857" strokeWidth="2" />
          {/* Angel of Victory */}
          <polygon points="100,18 95,24 105,24" fill="#F59E0B" />
          {/* Corner Domes */}
          <ellipse cx="50" cy="60" rx="10" ry="8" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
          <ellipse cx="150" cy="60" rx="10" ry="8" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
          {/* Colonnade */}
          {[60, 72, 84, 96, 108, 120, 132, 140].map((x, i) => (
            <line key={i} x1={x} y1="72" x2={x} y2="112" stroke="#CBD5E1" strokeWidth="2" />
          ))}
          <rect y="113" width="200" height="7" fill="#065F46" />
        </svg>
      );

    case 'delhi':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FEF3C7" />
          {/* India Gate Sandstone Memorial Arch */}
          <rect x="55" y="40" width="90" height="75" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
          {/* Huge Arch Opening */}
          <path d="M75 115 L75 68 Q100 48 125 68 L125 115 Z" fill="#FEF3C7" stroke="#9A3412" strokeWidth="2" />
          {/* Top Cornice Tiers */}
          <rect x="50" y="32" width="100" height="8" fill="#C2410C" />
          <rect x="65" y="24" width="70" height="8" fill="#9A3412" />
          {/* Amar Jawan Jyoti Flame */}
          <ellipse cx="100" cy="110" rx="6" ry="3" fill="#1E293B" />
          <polygon points="100,98 96,108 104,108" fill="#F59E0B" />
          <circle cx="100" cy="103" r="2.5" fill="#EF4444" />
          <rect y="114" width="200" height="6" fill="#15803D" />
        </svg>
      );

    case 'mumbai-suburbs':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#DBEAFE" />
          {/* Bandra Worli Sea Link Pylon */}
          <polygon points="100,15 94,95 106,95" fill="#1E3A8A" />
          {/* Stay Cables */}
          {[35, 55, 75, 95].map((y, i) => (
            <React.Fragment key={i}>
              <line x1="100" y1="20" x2={30 + i * 16} y2="90" stroke="#60A5FA" strokeWidth="1.5" />
              <line x1="100" y1="20" x2={170 - i * 16} y2="90" stroke="#60A5FA" strokeWidth="1.5" />
            </React.Fragment>
          ))}
          {/* Bridge Deck */}
          <rect x="0" y="88" width="200" height="6" fill="#1D4ED8" />
          {/* Arabian Sea Waters */}
          <rect y="94" width="200" height="26" fill="#1E40AF" />
          {/* Distant Suburban Highrises */}
          <rect x="10" y="55" width="20" height="33" fill="#93C5FD" opacity="0.7" />
          <rect x="170" y="45" width="22" height="43" fill="#93C5FD" opacity="0.7" />
        </svg>
      );

    case 'mumbai-nariman':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#0F172A" />
          <circle cx="40" cy="30" r="14" fill="#F8FAFC" opacity="0.9" />
          {/* Nariman Point Corporate Skyscrapers */}
          <rect x="70" y="25" width="26" height="90" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="100" y="15" width="30" height="100" fill="#0F172A" stroke="#60A5FA" strokeWidth="2" />
          <rect x="135" y="35" width="25" height="80" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="165" y="45" width="22" height="70" fill="#0F172A" stroke="#818CF8" strokeWidth="1" />
          {/* Lit Windows */}
          {[25, 38, 51, 64, 77, 90].map((y, i) => (
            <React.Fragment key={i}>
              <line x1="104" y1={y} x2="126" y2={y} stroke="#FDE047" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="74" y1={y + 12} x2="92" y2={y + 12} stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
            </React.Fragment>
          ))}
          {/* Marine Drive Crescent Arc (Queen's Necklace) */}
          <path d="M-10 115 Q80 85 210 110" fill="none" stroke="#FBBF24" strokeWidth="4" />
          {/* Pearl necklace glow dots */}
          {[10, 30, 50, 75, 105, 135, 165, 195].map((x, i) => (
            <circle key={i} cx={x} cy={105 - (x > 100 ? (x - 100) * 0.1 : (100 - x) * 0.15)} r="3" fill="#FFF" />
          ))}
          <rect y="114" width="200" height="6" fill="#0284C7" />
        </svg>
      );

    // Railways
    case 'rail-howrah':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#E2E8F0" />
          {/* Howrah Cantilever Steel Truss Bridge */}
          <polygon points="15,90 40,25 60,90" fill="none" stroke="#B91C1C" strokeWidth="3.5" />
          <polygon points="185,90 160,25 140,90" fill="none" stroke="#B91C1C" strokeWidth="3.5" />
          <line x1="40" y1="25" x2="160" y2="25" stroke="#B91C1C" strokeWidth="4" />
          {/* Cross bracing */}
          <line x1="40" y1="25" x2="100" y2="90" stroke="#DC2626" strokeWidth="2" />
          <line x1="160" y1="25" x2="100" y2="90" stroke="#DC2626" strokeWidth="2" />
          <line x1="60" y1="90" x2="100" y2="25" stroke="#DC2626" strokeWidth="2" />
          <line x1="140" y1="90" x2="100" y2="25" stroke="#DC2626" strokeWidth="2" />
          {/* Bridge deck */}
          <rect y="88" width="200" height="7" fill="#7F1D1D" />
          {/* Hooghly River */}
          <rect y="95" width="200" height="25" fill="#0284C7" />
        </svg>
      );

    case 'rail-csmt':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#F1F5F9" />
          {/* Victorian Italianate Gothic Central Dome */}
          <rect x="40" y="55" width="120" height="60" fill="#991B1B" />
          <ellipse cx="100" cy="45" rx="32" ry="24" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2" />
          {/* Central Clock Tower */}
          <rect x="92" y="15" width="16" height="30" fill="#7F1D1D" />
          <circle cx="100" cy="25" r="5" fill="#FEF08A" stroke="#000" strokeWidth="1" />
          {/* Gothic Arches */}
          {[50, 72, 116, 138].map((x, i) => (
            <path key={i} d={`M${x} 115 L${x} 80 Q${x + 6} 70 ${x + 12} 80 L${x + 12} 115 Z`} fill="#FEF08A" />
          ))}
          {/* Turrets and Pinnacles */}
          <polygon points="40,55 35,25 45,55" fill="#7F1D1D" />
          <polygon points="160,55 155,25 165,55" fill="#7F1D1D" />
          <rect y="114" width="200" height="6" fill="#334155" />
        </svg>
      );

    case 'rail-delhi':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#E2E8F0" />
          {/* Vande Bharat Express Train */}
          <path d="M20 95 L150 95 Q180 95 190 85 L180 65 Q165 55 130 55 L20 55 Z" fill="#F8FAFC" stroke="#1E3A8A" strokeWidth="2" />
          {/* Blue Aerodynamic Stripe */}
          <path d="M20 72 L140 72 Q165 72 178 78 L183 72 Q165 65 135 65 L20 65 Z" fill="#2563EB" />
          {/* Aerodynamic windshield */}
          <polygon points="145,58 175,66 168,74 140,74" fill="#0F172A" />
          {/* Train passenger windows */}
          {[30, 55, 80, 105].map((x, i) => (
            <rect key={i} x={x} y="60" width="18" height="8" rx="2" fill="#0F172A" />
          ))}
          {/* Railway Tracks & Ballast */}
          <rect y="95" width="200" height="8" fill="#475569" />
          <line x1="0" y1="99" x2="200" y2="99" stroke="#94A3B8" strokeWidth="2" />
          <rect y="103" width="200" height="17" fill="#334155" />
        </svg>
      );

    case 'rail-chennai':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FEE2E2" />
          {/* Red Brick Colonial Central Station */}
          <rect x="30" y="55" width="140" height="60" fill="#DC2626" />
          {/* Iconic Tall Red Clock Tower */}
          <rect x="85" y="15" width="30" height="95" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2" />
          <polygon points="85,15 100,2 115,15" fill="#7F1D1D" />
          <circle cx="100" cy="30" r="7" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <line x1="100" y1="30" x2="100" y2="26" stroke="#000" strokeWidth="1.5" />
          <line x1="100" y1="30" x2="103" y2="30" stroke="#000" strokeWidth="1.5" />
          {/* Arched Station windows */}
          {[40, 60, 125, 145].map((x, i) => (
            <path key={i} d={`M${x} 115 L${x} 80 Q${x + 6} 70 ${x + 12} 80 L${x + 12} 115 Z`} fill="#FEF08A" />
          ))}
          <rect y="114" width="200" height="6" fill="#1E293B" />
        </svg>
      );

    // Utilities
    case 'util-electric':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#FEF3C7" />
          {/* High voltage pylon tower */}
          <line x1="100" y1="20" x2="70" y2="115" stroke="#475569" strokeWidth="3" />
          <line x1="100" y1="20" x2="130" y2="115" stroke="#475569" strokeWidth="3" />
          {/* Cross bars */}
          <line x1="60" y1="45" x2="140" y2="45" stroke="#475569" strokeWidth="3" />
          <line x1="50" y1="65" x2="150" y2="65" stroke="#475569" strokeWidth="3.5" />
          <line x1="75" y1="88" x2="125" y2="88" stroke="#475569" strokeWidth="3" />
          {/* Lightning Spark Bolt */}
          <polygon points="110,15 85,55 105,55 90,95 125,50 102,50" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
          <rect y="112" width="200" height="8" fill="#15803D" />
        </svg>
      );

    case 'util-water':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#E0F2FE" />
          {/* Water Tower Tank */}
          <ellipse cx="100" cy="40" rx="42" ry="22" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <rect x="58" y="40" width="84" height="24" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <ellipse cx="100" cy="64" rx="42" ry="18" fill="#0369A1" />
          {/* Legs */}
          <line x1="70" y1="64" x2="60" y2="115" stroke="#475569" strokeWidth="4" />
          <line x1="100" y1="64" x2="100" y2="115" stroke="#475569" strokeWidth="4" />
          <line x1="130" y1="64" x2="140" y2="115" stroke="#475569" strokeWidth="4" />
          {/* Water Splash Drop */}
          <path d="M100 85 C92 95 92 105 100 105 C108 105 108 95 100 85 Z" fill="#38BDF8" />
          <rect y="114" width="200" height="6" fill="#0284C7" />
        </svg>
      );

    // Special tiles fallback
    case 'start':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#DCFCE7" />
          <polygon points="40,60 140,20 140,45 180,45 180,75 140,75 140,100" fill="#16A34A" />
        </svg>
      );

    case 'jail':
      return (
        <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="120" fill="#1E293B" />
          {[30, 55, 80, 105, 130, 155, 175].map((x, i) => (
            <line key={i} x1={x} y1="0" x2={x} y2="120" stroke="#94A3B8" strokeWidth="4" />
          ))}
          <rect x="75" y="45" width="50" height="40" rx="8" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
          <circle cx="100" cy="62" r="5" fill="#1E293B" />
          <rect x="98" y="62" width="4" height="12" fill="#1E293B" />
        </svg>
      );

    default:
      return (
        <div className={`flex items-center justify-center bg-vyapar-skyblue/40 font-bold text-vyapar-navy ${className}`}>
          Vyapar Property
        </div>
      );
  }
}

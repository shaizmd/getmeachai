import React from 'react'

function Logo() {
  return (
    
    <svg
      width="84"
      height="64"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="GetMeAChai Logo"
    >
      <defs>
        <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="1" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="steamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
        </linearGradient>
        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.2" />
        </filter>
      </defs>
      
      <g transform="scale(0.9) translate(10, -5)">
        <path d="M60 80 L60 140 Q60 150 70 150 L120 150 Q130 150 130 140 L130 80 Z"
          fill="url(#cupGradient)" filter="url(#dropShadow)" />
        <path d="M130 95 Q145 95 145 110 Q145 125 130 125"
          fill="none" stroke="url(#cupGradient)" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="95" cy="85" rx="30" ry="8" fill="#8B4513" opacity="0.8" />
        <g transform="translate(95, 60)">
          <path d="M0,-8 C-6,-12 -12,-8 -12,-2 C-12,4 0,12 0,12 C0,12 12,4 12,-2 C12,-8 6,-12 0,-8 Z"
            fill="url(#heartGradient)" opacity="0.9">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0"
              dur="2s" repeatCount="indefinite" />
          </path>
        </g>
        <g opacity="0.6">
          <path d="M85 70 Q88 65 85 60 Q82 55 85 50" fill="none" stroke="url(#steamGradient)"
            strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M95 70 Q98 65 95 60 Q92 55 95 50" fill="none" stroke="url(#steamGradient)"
            strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite"
              begin="1s" />
          </path>
          <path d="M105 70 Q108 65 105 60 Q102 55 105 50" fill="none" stroke="url(#steamGradient)"
            strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"
              begin="2s" />
          </path>
        </g>
        <circle cx="75" cy="95" r="2" fill="#8B4513" opacity="0.7" />
        <circle cx="115" cy="105" r="1.5" fill="#8B4513" opacity="0.7" />
        <circle cx="85" cy="115" r="1" fill="#8B4513" opacity="0.7" />
        <circle cx="105" cy="90" r="1" fill="#8B4513" opacity="0.7" />
        <g opacity="0.8">
          <circle cx="45" cy="100" r="3" fill="url(#heartGradient)">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="145" cy="120" r="2" fill="url(#heartGradient)">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          <circle cx="50" cy="130" r="2.5" fill="url(#heartGradient)">
            <animate attributeName="r" values="2.5;4.5;2.5" dur="2s" repeatCount="indefinite"
              begin="1s" />
          </circle>
        </g>
        <ellipse cx="95" cy="155" rx="45" ry="8" fill="url(#cupGradient)" opacity="0.6" />
      </g>
    </svg>
  )
}

export default Logo

import { useState, useEffect, useCallback, useRef } from 'react';
import svgPaths from './svgPaths';
import SnakeGame from './SnakeGame';
import './Gameboy.css';

export default function InteractiveGameboy({ className }) {
  const [direction, setDirection] = useState(null);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [pressedDirection, setPressedDirection] = useState(null);
  const [isStartPressed, setIsStartPressed] = useState(false);
  const startGameRef = useRef(null);

  const handleDPadPointerDown = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const deltaX = clickX - centerX;
    const deltaY = clickY - centerY;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    let direction;
    if (absDeltaX > absDeltaY) {
      direction = deltaX > 0 ? 'RIGHT' : 'LEFT';
    } else {
      direction = deltaY > 0 ? 'DOWN' : 'UP';
    }

    setDirection(direction);
    setPressedDirection(direction);
  }, []);

  const handleStartClick = useCallback(() => {
    if (startGameRef.current) {
      startGameRef.current();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      if (keyMap[e.key]) {
        e.preventDefault();
        setPressedKeys(prev => new Set(prev).add(e.key));
        setPressedDirection(keyMap[e.key]);
        setDirection(keyMap[e.key]);
      }
    };

    const handleKeyUp = (e) => {
      const keyMap = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      if (e.key.startsWith('Arrow')) {
        setPressedKeys(prev => {
          const next = new Set(prev);
          next.delete(e.key);
          return next;
        });
        if (keyMap[e.key] === pressedDirection) {
          setPressedDirection(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedDirection]);

  const isPressed = (key) => pressedKeys.has(key);

  const defaultClassName =
    "h-[362px] overflow-clip relative rounded-bl-[8px] rounded-br-[44px] rounded-tl-[8px] rounded-tr-[8px] w-[250px]";

  return (
    <div
      className={className ? `${defaultClassName} ${className}` : defaultClassName}
      data-name="Gameboy"
    >
      <div aria-hidden className="absolute bg-[#c8c5c2] inset-0 pointer-events-none rounded-bl-[8px] rounded-br-[44px] rounded-tl-[8px] rounded-tr-[8px]" />

      <div className="absolute left-[24px] size-[76px] top-[216px]" data-name="D-Pad">
        <div className="absolute inset-[-15.79%_-15.79%_-26.32%_-26.32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 108 108">
            <g filter="url(#filter0_d_1_126)" id="D-Pad">
              <path d={svgPaths.pdb10a00} fill="url(#paint0_linear_1_126)" id="Indent" />
              <defs>
                <clipPath id="upArmClip">
                  <rect x="36" y="12" width="40" height="26" />
                </clipPath>
                <clipPath id="downArmClip">
                  <rect x="36" y="62" width="40" height="26" />
                </clipPath>
                <clipPath id="leftArmClip">
                  <rect x="20" y="36" width="26" height="40" />
                </clipPath>
                <clipPath id="rightArmClip">
                  <rect x="70" y="36" width="26" height="40" />
                </clipPath>
                <linearGradient id="upPressGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                  <stop offset="60%" stopColor="rgba(0,0,0,0.1)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
                <linearGradient id="downPressGradient" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                  <stop offset="60%" stopColor="rgba(0,0,0,0.1)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
                <linearGradient id="leftPressGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                  <stop offset="60%" stopColor="rgba(0,0,0,0.1)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
                <linearGradient id="rightPressGradient" x1="100%" y1="50%" x2="0%" y2="50%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                  <stop offset="60%" stopColor="rgba(0,0,0,0.1)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
              </defs>

              <g filter="url(#filter1_ii_1_126)" id="Cross">
                <path d={svgPaths.pc955480} fill="var(--fill-0, #5D5F60)" />
              </g>

              {pressedDirection === 'UP' && (
                <g clipPath="url(#upArmClip)">
                  <path d={svgPaths.pc955480} fill="url(#upPressGradient)" />
                </g>
              )}
              {pressedDirection === 'DOWN' && (
                <g clipPath="url(#downArmClip)">
                  <path d={svgPaths.pc955480} fill="url(#downPressGradient)" />
                </g>
              )}
              {pressedDirection === 'LEFT' && (
                <g clipPath="url(#leftArmClip)">
                  <path d={svgPaths.pc955480} fill="url(#leftPressGradient)" />
                </g>
              )}
              {pressedDirection === 'RIGHT' && (
                <g clipPath="url(#rightArmClip)">
                  <path d={svgPaths.pc955480} fill="url(#rightPressGradient)" />
                </g>
              )}

              <g
                filter="url(#filter2_i_1_126)"
                id="Icon"
              >
                <path d={svgPaths.p3d76e380} stroke={(isPressed('ArrowLeft') || pressedDirection === 'LEFT') ? '#8a8c8b' : 'var(--stroke-0, #464946)'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>

              <g
                filter="url(#filter3_i_1_126)"
                id="Icon_2"
              >
                <path d={svgPaths.p20d164c0} stroke={(isPressed('ArrowUp') || pressedDirection === 'UP') ? '#8a8c8b' : 'var(--stroke-0, #464946)'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>

              <g
                filter="url(#filter4_i_1_126)"
                id="Icon_3"
              >
                <path d={svgPaths.pe842200} stroke={(isPressed('ArrowRight') || pressedDirection === 'RIGHT') ? '#8a8c8b' : 'var(--stroke-0, #464946)'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>

              <g
                filter="url(#filter5_i_1_126)"
                id="Icon_4"
              >
                <path d={svgPaths.p3732bb08} stroke={(isPressed('ArrowDown') || pressedDirection === 'DOWN') ? '#8a8c8b' : 'var(--stroke-0, #464946)'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </g>

              <g filter="url(#filter6_ii_1_126)" id="Gap">
                <circle cx="58" cy="50" fill="var(--fill-0, #5D5F60)" r="6" />
              </g>
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="108" id="filter0_d_1_126" width="108" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-4" dy="4" />
                <feGaussianBlur stdDeviation="8" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_126" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_126" mode="normal" result="shape" />
              </filter>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="76" id="filter1_ii_1_126" width="76" x="20" y="12">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-2" dy="2" />
                <feGaussianBlur stdDeviation="1" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow_1_126" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2" dy="-2" />
                <feGaussianBlur stdDeviation="1" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="effect1_innerShadow_1_126" mode="normal" result="effect2_innerShadow_1_126" />
              </filter>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13" id="filter2_i_1_126" width="15" x="26.5" y="43.5">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset />
                <feGaussianBlur stdDeviation="0.5" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow_1_126" />
              </filter>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15" id="filter3_i_1_126" width="13" x="51.5" y="18.5">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset />
                <feGaussianBlur stdDeviation="0.5" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow_1_126" />
              </filter>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13" id="filter4_i_1_126" width="15" x="74.5" y="43.5">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset />
                <feGaussianBlur stdDeviation="0.5" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow_1_126" />
              </filter>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15" id="filter5_i_1_126" width="13" x="51.5" y="66.5">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset />
                <feGaussianBlur stdDeviation="0.5" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow_1_126" />
              </filter>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="14" id="filter6_ii_1_126" width="14" x="51" y="43">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1" dy="-1" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow_1_126" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-1" dy="1" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="effect1_innerShadow_1_126" mode="normal" result="effect2_innerShadow_1_126" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_126" x1="96" x2="20" y1="12" y2="88">
                <stop stopColor="#2A2729" />
                <stop offset="1" stopColor="#121112" />
              </linearGradient>
            </defs>
          </svg>

          <div
            className="absolute inset-0 cursor-pointer z-10"
            onPointerDown={handleDPadPointerDown}
            onPointerUp={() => setPressedDirection(null)}
            onPointerLeave={() => setPressedDirection(null)}
          />
        </div>
      </div>

      <div className="absolute content-stretch flex flex-col gap-[2px] items-center right-[76px] top-[236px]" data-name="Button">
        <div className="content-stretch flex items-start p-[2px] relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }} data-name="Button">
          <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(133, 133, 131) 16.087%, rgb(53, 52, 49) 84.152%)" }} data-name="Indent">
            <div className="relative rounded-[999px] shrink-0 size-[22px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 22 22' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.4 -1.5 1.5 1.4 4 19)'><stop stop-color='rgba(106,106,104,1)' offset='0'/><stop stop-color='rgba(81,81,79,1)' offset='0.25'/><stop stop-color='rgba(56,56,55,1)' offset='0.5'/><stop stop-color='rgba(30,30,30,1)' offset='0.75'/><stop stop-color='rgba(18,18,17,1)' offset='0.875'/><stop stop-color='rgba(5,5,5,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Center" />
          </div>
        </div>
        <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col gameboy-pixel-text justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
          <p className="leading-[1.2]">Y</p>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[2px] items-center right-[50px] top-[210px]" data-name="Button">
        <div className="content-stretch flex items-start p-[2px] relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }} data-name="Button">
          <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(133, 133, 131) 16.087%, rgb(53, 52, 49) 84.152%)" }} data-name="Indent">
            <div className="relative rounded-[999px] shrink-0 size-[22px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 22 22' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.4 -1.5 1.5 1.4 4 19)'><stop stop-color='rgba(106,106,104,1)' offset='0'/><stop stop-color='rgba(81,81,79,1)' offset='0.25'/><stop stop-color='rgba(56,56,55,1)' offset='0.5'/><stop stop-color='rgba(30,30,30,1)' offset='0.75'/><stop stop-color='rgba(18,18,17,1)' offset='0.875'/><stop stop-color='rgba(5,5,5,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Center" />
          </div>
        </div>
        <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col gameboy-pixel-text justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
          <p className="leading-[1.2]">X</p>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[2px] items-center right-[24px] top-[236px]" data-name="Button">
        <div className="content-stretch flex items-start p-[2px] relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }} data-name="Button">
          <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(242, 134, 202) 16.087%, rgb(119, 13, 88) 84.152%)" }} data-name="Indent">
            <div className="relative rounded-[999px] shrink-0 size-[22px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 22 22' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.4 -1.5 1.5 1.4 4 19)'><stop stop-color='rgba(242,142,190,1)' offset='0'/><stop stop-color='rgba(223,111,172,1)' offset='0.25'/><stop stop-color='rgba(203,80,155,1)' offset='0.5'/><stop stop-color='rgba(183,49,138,1)' offset='0.75'/><stop stop-color='rgba(164,18,120,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Center" />
          </div>
        </div>
        <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col gameboy-pixel-text justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
          <p className="leading-[1.2]">A</p>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[2px] items-center right-[50px] top-[262px]" data-name="Button">
        <div className="content-stretch flex items-start p-[2px] relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }} data-name="Button">
          <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(242, 134, 202) 16.087%, rgb(119, 13, 88) 84.152%)" }} data-name="Indent">
            <div className="relative rounded-[999px] shrink-0 size-[22px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 22 22' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.4 -1.5 1.5 1.4 4 19)'><stop stop-color='rgba(242,142,190,1)' offset='0'/><stop stop-color='rgba(223,111,172,1)' offset='0.25'/><stop stop-color='rgba(203,80,155,1)' offset='0.5'/><stop stop-color='rgba(183,49,138,1)' offset='0.75'/><stop stop-color='rgba(164,18,120,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Center" />
          </div>
        </div>
        <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col gameboy-pixel-text justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
          <p className="leading-[1.2]">B</p>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[2px] items-center left-1/2 top-[200px]" data-name="Button">
        <div className="content-stretch flex items-center p-[4px] relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(156, 154, 150) 20.818%, rgb(181, 180, 176) 78.599%)" }} data-name="Button">
          <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }} data-name="Button">
            <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(225deg, rgb(133, 133, 131) 16.087%, rgb(53, 52, 49) 84.152%)" }} data-name="Indent">
              <div className="relative rounded-[999px] shrink-0 size-[12px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.76364 -0.81818 0.81818 0.76364 2.1818 10.364)'><stop stop-color='rgba(106,106,104,1)' offset='0'/><stop stop-color='rgba(85,85,84,1)' offset='0.5'/><stop stop-color='rgba(64,64,64,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Center" />
            </div>
          </div>
        </div>
        <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col gameboy-pixel-text justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
          <p className="leading-[1.2]">MENU</p>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute flex items-center justify-center left-[calc(50%-23.37px)] size-[45.255px] top-[300px]">
        <div className="-rotate-45 flex-none">
          <div className="content-stretch flex flex-col gap-[2px] items-center relative" data-name="Button">
            <div className="content-stretch flex items-center p-[4px] relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(209.055deg, rgb(156, 154, 150) 20.818%, rgb(181, 180, 176) 78.599%)" }} data-name="Button">
              <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(203.199deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }} data-name="Button">
                <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(201.038deg, rgb(133, 133, 131) 16.087%, rgb(53, 52, 49) 84.152%)" }} data-name="Indent">
                  <div className="h-[8px] relative rounded-[999px] shrink-0 w-[24px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 24 8' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.5273 -0.54545 1.6364 0.50909 4.3636 6.9091)'><stop stop-color='rgba(106,106,104,1)' offset='0'/><stop stop-color='rgba(85,85,84,1)' offset='0.5'/><stop stop-color='rgba(64,64,64,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Center" />
                </div>
              </div>
            </div>
            <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col gameboy-pixel-text justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
              <p className="leading-[1.2]">Select</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="-translate-x-1/2 absolute flex items-center justify-center left-[calc(50%+24.08px)] size-[45.255px] top-[300px] cursor-pointer"
        onClick={handleStartClick}
        onPointerDown={() => setIsStartPressed(true)}
        onPointerUp={() => setIsStartPressed(false)}
        onPointerLeave={() => setIsStartPressed(false)}
      >
        <div className="-rotate-45 flex-none">
          <div className="content-stretch flex flex-col gap-[2px] items-center relative" data-name="Button">
            <div className="content-stretch flex items-center p-[4px] relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(209.055deg, rgb(156, 154, 150) 20.818%, rgb(181, 180, 176) 78.599%)" }} data-name="Button">
              <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" style={{ backgroundImage: "linear-gradient(203.199deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }} data-name="Button">
                <div
                  className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0 transition-all duration-75"
                  style={{
                    backgroundImage: "linear-gradient(201.038deg, rgb(133, 133, 131) 16.087%, rgb(53, 52, 49) 84.152%)",
                    ...(isStartPressed && {
                      boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.25)',
                      filter: 'brightness(0.85)'
                    })
                  }}
                  data-name="Indent"
                >
                  <div className="h-[8px] relative rounded-[999px] shrink-0 w-[24px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 24 8' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.5273 -0.54545 1.6364 0.50909 4.3636 6.9091)'><stop stop-color='rgba(106,106,104,1)' offset='0'/><stop stop-color='rgba(85,85,84,1)' offset='0.5'/><stop stop-color='rgba(64,64,64,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Center" />
                </div>
              </div>
            </div>
            <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col gameboy-pixel-text justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
              <p className="leading-[1.2]">Start</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-[2px_2px_170px_2px] overflow-clip rounded-[6px] shadow-[0px_1px_1px_0px_rgba(255,255,255,0.5)]" data-name="Screen container">
        <div aria-hidden className="absolute bg-[#080808] inset-0 pointer-events-none rounded-[6px]" />
        <div className="absolute bg-[#1b1b1b] inset-[12px] rounded-[1px]" />
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_2px_2px_0px_rgba(0,0,0,0.5),inset_-2px_2px_2px_0px_rgba(255,255,255,0.25)]" />

        <SnakeGame
          direction={direction}
          onDirectionChange={setDirection}
          onStartGame={(callback) => { startGameRef.current = callback; }}
        />
      </div>

      <div className="absolute bottom-[16.33px] flex items-center justify-center right-[16.2px] size-[46.669px]">
        <div className="flex-none rotate-45">
          <div className="content-stretch flex flex-col gap-[4px] items-start pointer-events-none relative" data-name="Sound grid">
            <div className="h-[3px] relative rounded-[3px] shrink-0 w-[28px]" data-name="Gap">
              <div aria-hidden className="absolute bg-[#868079] inset-0 rounded-[3px]" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
            </div>
            <div className="h-[3px] relative rounded-[3px] shrink-0 w-[28px]" data-name="Gap">
              <div aria-hidden className="absolute bg-[#868079] inset-0 rounded-[3px]" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
            </div>
            <div className="h-[3px] relative rounded-[3px] shrink-0 w-[28px]" data-name="Gap">
              <div aria-hidden className="absolute bg-[#868079] inset-0 rounded-[3px]" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
            </div>
            <div className="h-[3px] relative rounded-[3px] shrink-0 w-[28px]" data-name="Gap">
              <div aria-hidden className="absolute bg-[#868079] inset-0 rounded-[3px]" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
            </div>
            <div className="h-[3px] relative rounded-[3px] shrink-0 w-[28px]" data-name="Gap">
              <div aria-hidden className="absolute bg-[#868079] inset-0 rounded-[3px]" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
            </div>
            <div className="h-[3px] relative rounded-[3px] shrink-0 w-[28px]" data-name="Gap">
              <div aria-hidden className="absolute bg-[#868079] inset-0 rounded-[3px]" />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_-2px_2px_4px_0px_rgba(0,0,0,0.25),inset_0px_-2px_4px_0px_rgba(0,0,0,0.25),inset_2px_0px_4px_0px_rgba(255,255,255,0.5)]" />
    </div>
  );
}

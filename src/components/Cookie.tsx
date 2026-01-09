import { useMemo } from 'react'

interface CookieProps {
  stage: number // 0-5 (0: 새것, 5: 다 먹음)
  onClick: () => void
  isEating: boolean
}

export default function Cookie({ stage, onClick, isEating }: CookieProps) {


  // 베어먹은 비율 (0~1)
  const biteRatio = [0, 0.18, 0.36, 0.54, 0.72, 0.9][Math.min(stage, 5)]

  // 불규칙한 바이트 라인 생성 (찢어진 느낌)
  const { bitePath, jaggedPath } = useMemo(() => {
    // 잘려나간 X 좌표 (오른쪽에서 왼쪽으로 이동)
    const baseX = 200 - biteRatio * 200;

    // 찢어진 라인 포인트 생성
    let path = `M ${baseX} 0`;
    let jag = `M ${baseX} 0`;

    for (let y = 10; y <= 200; y += 10) {
      // 불규칙한 X 오프셋 (-5 ~ +5)
      const xOffset = (Math.random() - 0.5) * 15;
      path += ` L ${baseX + xOffset} ${y}`;
      jag += ` L ${baseX + xOffset} ${y}`;
    }

    // 마스크용 (오른쪽 영역을 덮어야 함)
    // path는 위에서 아래로 내려왔으므로, 오른쪽 아래 -> 오른쪽 위 -> 닫기
    const maskPath = `${path} L 300 200 L 300 -100 L ${baseX} -100 Z`;

    return { bitePath: maskPath, jaggedPath: jag };
  }, [biteRatio]);

  return (
    <div
      className="relative cursor-pointer select-none active:scale-95 transition-transform"
      onClick={onClick}
    >
      {/* 그림자 */}
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-52 h-12 bg-black/15 rounded-[50%] blur-xl" />

      {/* 쿠키 - SVG로 그리기 */}
      <svg
        viewBox="0 0 200 200"
        className={`w-72 h-72 md:w-80 md:h-80 transition-transform duration-100 ${isEating ? 'animate-bite-shake' : 'hover:scale-105'
          }`}
        style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }}
      >
        <defs>
          {/* 코코아 파우더 질감 (더 자연스럽게) */}
          <filter id="cocoaPowder">
            <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="5" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.6" />
            </feComponentTransfer>
            <feComposite operator="in" in2="SourceGraphic" result="noise" />
            <feBlend mode="overlay" in="noise" in2="SourceGraphic" />
          </filter>

          {/* 카다이프 질감 (더 자잘하고 불규칙하게) */}
          <pattern id="kadayifPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M2,5 Q5,2 8,5 M0,2 Q2,8 5,5 M5,8 Q8,2 10,5"
              fill="none" stroke="#DCE775" strokeWidth="1" opacity="0.9" strokeLinecap="round" />
          </pattern>

          {/* 피스타치오 속 (밝고 먹음직스럽게) */}
          <radialGradient id="pistachioFill" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#EEF5C0" />
            <stop offset="60%" stopColor="#CDDC39" />
            <stop offset="100%" stopColor="#827717" />
          </radialGradient>

          {/* 초콜릿 겉면 (입체감 강화) */}
          <radialGradient id="cocoaShell" cx="30%" cy="30%" r="85%">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="40%" stopColor="#5D4037" />
            <stop offset="85%" stopColor="#3E2723" />
            <stop offset="100%" stopColor="#281A15" />
          </radialGradient>

          {/* 바이트 마스크: path의 왼쪽만 보여줌 */}
          <mask id="cookieMask">
            <rect x="-50" y="-50" width="300" height="300" fill="white" />
            {/* 먹은 부위 (오른쪽)를 검은색으로 덮음 */}
            {stage > 0 && (
              <path d={bitePath} fill="black" />
            )}
          </mask>
        </defs>

        {/* 메인 쿠키 그룹 (마스크 적용) - 먹으면 사라지는 부분 */}
        <g mask="url(#cookieMask)">
          {/* 전체 덩어리 */}
          <circle cx="100" cy="100" r="98" fill="url(#cocoaShell)" />
          <circle cx="100" cy="100" r="98" fill="transparent" filter="url(#cocoaPowder)" opacity="0.6" />
          {/* 하이라이트 */}
          <ellipse cx="70" cy="60" rx="30" ry="20" fill="white" opacity="0.1" />
        </g>

        {/* 절단면 (속살) - 마스크 위에 덧그리기 */}
        {stage > 0 && (
          <g filter="url(#cocoaPowder)">
            {/* 절단면 베이스 (Path를 따라 그림) */}
            <path
              d={jaggedPath}
              fill="none"
              stroke="url(#pistachioFill)"
              strokeWidth="20"
              strokeLinecap="round"
              opacity="1"
              transform="translate(-10, 0)" // 약간 왼쪽으로 이동해서 껍질 안쪽처럼 보이게
            />
            {/* 카다이프 질감 덧씌우기 */}
            <path
              d={jaggedPath}
              fill="none"
              stroke="url(#kadayifPattern)"
              strokeWidth="16"
              strokeLinecap="round"
              transform="translate(-10, 0)"
            />
            {/* 절단면 그림자 (안쪽 깊이감) */}
            <path
              d={jaggedPath}
              fill="none"
              stroke="black"
              strokeWidth="24"
              opacity="0.1"
              transform="translate(-8, 0)"
            />
          </g>
        )}
      </svg>

      {/* 먹는 이펙트 */}
      {isEating && (
        <div className="absolute top-1/2 left-1/2 pointer-events-none z-10 w-full h-full">
          <div
            className="absolute top-1/2 left-1/2 text-white text-4xl font-black animate-float-up whitespace-nowrap"
            style={{
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {['아삭!', '쩝', '냠냠', '쫀득!', '바삭!'][Math.floor(Math.random() * 5)]}
          </div>
        </div>
      )}

      {/* 부스러기 */}
      {stage > 0 && (
        <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-40">
          {[...Array(Math.min(stage * 3, 12))].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                left: `${20 + Math.random() * 60}%`,
                width: 4 + Math.random() * 5,
                height: 3 + Math.random() * 4,
                backgroundColor: ['#5D4037', '#4E342E', '#6D4C41'][Math.floor(Math.random() * 3)],
                opacity: 0.8,
                transform: `translateY(${Math.random() * 12}px) rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

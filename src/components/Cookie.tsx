import { useMemo } from 'react'

interface CookieProps {
  stage: number // 0-5 (0: 새것, 5: 다 먹음)
  onClick: () => void
  isEating: boolean
}

export default function Cookie({ stage, onClick, isEating }: CookieProps) {
  // 베어먹은 비율 (0 = 안먹음, 1 = 다먹음) - 천천히 증가
  const biteRatio = [0, 0.12, 0.26, 0.42, 0.6, 0.82][Math.min(stage, 5)]

  // 카다이프 면발 텍스처
  const noodles = useMemo(() => {
    const lines = []
    for (let i = 0; i < 500; i++) {
      lines.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        len: 4 + Math.random() * 12,
        angle: (Math.random() - 0.5) * 1.5,
        thickness: 0.8 + Math.random() * 1.5,
        brightness: Math.random(),
      })
    }
    return lines
  }, [])

  // 피스타치오 조각들
  const pistachios = useMemo(() => {
    const pieces = []
    for (let i = 0; i < 25; i++) {
      pieces.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        width: 3 + Math.random() * 5,
        height: 2 + Math.random() * 3,
        rotation: Math.random() * 360,
        color: ['#7CB342', '#8BC34A', '#9CCC65', '#689F38'][Math.floor(Math.random() * 4)],
      })
    }
    return pieces
  }, [])

  // 비스듬한 컷 라인 계산 (왼쪽에서 오른쪽으로 먹힘)
  // 위에서 봤을 때 비스듬하게 보이도록 - 단면 폭은 고정, 위치만 이동
  const cutX = biteRatio * 95 // 먹힌 위치 (0 ~ 95)
  const crossSectionWidth = 8 // 단면 보이는 폭 (고정)

  return (
    <div
      className="relative cursor-pointer select-none active:scale-95 transition-transform"
      onClick={onClick}
    >
      {/* 그림자 */}
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-48 h-10 bg-black/20 rounded-[50%] blur-lg" />

      {/* 쿠키 SVG */}
      <svg
        viewBox="0 0 100 100"
        className={`w-72 h-72 md:w-80 md:h-80 transition-transform duration-100 ${
          isEating ? 'animate-bite-shake' : 'hover:scale-105'
        }`}
        style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}
      >
        <defs>
          {/* 초콜릿 껍질 그라데이션 */}
          <radialGradient id="shellGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#7D5A4F" />
            <stop offset="50%" stopColor="#5D4037" />
            <stop offset="100%" stopColor="#3E2723" />
          </radialGradient>

          {/* 남은 쿠키 클립 (단면 오른쪽) */}
          <clipPath id="cookieClip">
            <rect x={cutX + crossSectionWidth} y="0" width={100 - cutX - crossSectionWidth} height="100" />
          </clipPath>

          {/* 단면 영역 (비스듬하게 보이는 내부) */}
          <clipPath id="crossSectionClip">
            <rect x={cutX} y="0" width={crossSectionWidth} height="100" />
          </clipPath>

          {/* 원형 마스크 */}
          <mask id="circleMask">
            <circle cx="50" cy="50" r="48" fill="white" />
          </mask>
        </defs>

        {/* 메인 그룹 - 원형 마스크 적용 */}
        <g mask="url(#circleMask)">
          {/* 전체 쿠키를 cookieClip으로 자름 (내부 + 껍질 같이 먹힘) */}
          <g clipPath={stage > 0 ? "url(#cookieClip)" : undefined}>
            {/* 1. 내부 (베이지 베이스 + 면발 + 피스타치오) */}
            <circle cx="50" cy="50" r="48" fill="#C4A574" />

            {/* 카다이프 면발 */}
            {noodles.map((n, i) => {
              let color
              if (n.brightness > 0.75) color = '#D9C4A0'
              else if (n.brightness > 0.5) color = '#C9B48A'
              else if (n.brightness > 0.25) color = '#B8A070'
              else color = '#A08050'

              return (
                <line
                  key={`noodle-${i}`}
                  x1={n.x}
                  y1={n.y}
                  x2={n.x + n.len * Math.cos(n.angle)}
                  y2={n.y + n.len * Math.sin(n.angle)}
                  stroke={color}
                  strokeWidth={n.thickness}
                  strokeLinecap="round"
                />
              )
            })}

            {/* 피스타치오 */}
            {pistachios.map((p, i) => (
              <ellipse
                key={`pistachio-${i}`}
                cx={p.x}
                cy={p.y}
                rx={p.width / 2}
                ry={p.height / 2}
                fill={p.color}
                transform={`rotate(${p.rotation} ${p.x} ${p.y})`}
              />
            ))}

            {/* 2. 초콜릿 껍질 (위에 덮음) */}
            <circle cx="50" cy="50" r="48" fill="url(#shellGradient)" />

            {/* 하이라이트 */}
            <ellipse cx="35" cy="30" rx="15" ry="10" fill="white" opacity="0.1" />

            {/* 하단 그림자 */}
            <ellipse cx="50" cy="75" rx="20" ry="8" fill="black" opacity="0.15" />
          </g>

          {/* 3. 단면 (위에서 봤을 때 비스듬하게 보이는 내부) */}
          {stage > 0 && (
            <g clipPath="url(#crossSectionClip)">
              {/* 내부 베이스 */}
              <rect x="0" y="0" width="100" height="100" fill="#C4A574" />

              {/* 카다이프 면발 */}
              {noodles.slice(0, 150).map((n, i) => {
                let color
                if (n.brightness > 0.75) color = '#D9C4A0'
                else if (n.brightness > 0.5) color = '#C9B48A'
                else if (n.brightness > 0.25) color = '#B8A070'
                else color = '#A08050'

                return (
                  <line
                    key={`cross-noodle-${i}`}
                    x1={n.x}
                    y1={n.y}
                    x2={n.x + n.len * 0.5 * Math.cos(n.angle)}
                    y2={n.y + n.len * 0.5 * Math.sin(n.angle)}
                    stroke={color}
                    strokeWidth={n.thickness * 0.8}
                    strokeLinecap="round"
                  />
                )
              })}

              {/* 피스타치오 */}
              {pistachios.map((p, i) => (
                <ellipse
                  key={`cross-pistachio-${i}`}
                  cx={p.x}
                  cy={p.y}
                  rx={p.width / 2}
                  ry={p.height / 2}
                  fill={p.color}
                  transform={`rotate(${p.rotation} ${p.x} ${p.y})`}
                />
              ))}

              {/* 오른쪽 경계 (초콜릿 껍질 두께) */}
              <line
                x1={cutX + crossSectionWidth}
                y1="0"
                x2={cutX + crossSectionWidth}
                y2="100"
                stroke="#3E2723"
                strokeWidth="3"
              />
            </g>
          )}
        </g>
      </svg>

      {/* 먹는 이펙트 */}
      {isEating && (
        <div className="absolute top-1/2 left-1/2 pointer-events-none z-10">
          <div
            className="text-white text-3xl font-black animate-float-up whitespace-nowrap"
            style={{
              textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {['아삭!', '쩝', '냠냠', '쫀득!', '바삭!'][Math.floor(Math.random() * 5)]}
          </div>
        </div>
      )}

      {/* 부스러기 */}
      {stage > 0 && (
        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-32">
          {[...Array(Math.min(stage * 2, 8))].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                left: `${25 + Math.random() * 50}%`,
                width: 3 + Math.random() * 4,
                height: 2 + Math.random() * 3,
                backgroundColor: ['#5D4037', '#4E342E', '#6D4C41'][Math.floor(Math.random() * 3)],
                opacity: 0.7,
                transform: `translateY(${Math.random() * 8}px) rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'

interface Crumb {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  tx: number
  rEnd: number
}

interface CrumbsProps {
  biteCount: number
}

export default function Crumbs({ biteCount }: CrumbsProps) {
  const [crumbs, setCrumbs] = useState<Crumb[]>([])

  useEffect(() => {
    if (biteCount > 0) {
      // 새로운 부스러기 추가 - 쿠키 중앙 근처에서 생성
      const newCrumbs: Crumb[] = Array.from({ length: 3 + Math.floor(Math.random() * 4) }, (_, i) => ({
        id: Date.now() + i,
        x: 40 + Math.random() * 20, // 40-60% (중앙 부근)
        y: 40 + Math.random() * 20, // 40-60%
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
        tx: (Math.random() - 0.5) * 150, // -75px ~ +75px (좌우로 튀기)
        rEnd: Math.random() * 720 - 360, // 회전
      }))

      setCrumbs(prev => [...prev, ...newCrumbs].slice(-30)) // 최대 30개 유지
    }
  }, [biteCount])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {crumbs.map(crumb => (
        <div
          key={crumb.id}
          className="absolute bg-amber-700 rounded-sm animate-fall"
          style={{
            left: `${crumb.x}%`,
            top: `${crumb.y}%`,
            width: crumb.size,
            height: crumb.size * 0.7,
            opacity: 0.8,
            '--r-start': `${crumb.rotation}deg`,
            '--tx': `${crumb.tx}px`,
            '--r-end': `${crumb.rEnd}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

import { useCallback, useRef } from 'react'

// 씹는 소리 효과 (Web Audio API로 생성)
export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const playBiteSound = useCallback(() => {
    // AudioContext 초기화 (사용자 인터랙션 후에만 가능)
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current

    // iOS Safari에서 AudioContext resume 필요
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    const now = ctx.currentTime

    // 랜덤하게 다른 씹는 소리 생성
    const soundType = Math.floor(Math.random() * 3)

    // 노이즈 생성 (바삭한 소리)
    const bufferSize = ctx.sampleRate * 0.1 // 0.1초
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      // 노이즈 + 감쇠
      const envelope = 1 - i / bufferSize
      data[i] = (Math.random() * 2 - 1) * envelope * 0.3
    }

    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = buffer

    // 필터로 음색 조절
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 800 + soundType * 400 // 800-1600Hz
    filter.Q.value = 1

    // 게인 (볼륨)
    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.5, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

    // 연결
    noiseSource.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    noiseSource.start(now)
    noiseSource.stop(now + 0.1)

    // 쫀득한 저음 추가
    const oscillator = ctx.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(150 + soundType * 30, now)
    oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.15)

    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.2, now)
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    oscillator.connect(oscGain)
    oscGain.connect(ctx.destination)

    oscillator.start(now)
    oscillator.stop(now + 0.15)
  }, [])

  const playCompleteSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // 완료 사운드 (상승 멜로디)
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq

      gain.gain.setValueAtTime(0, now + i * 0.1)
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.1 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + i * 0.1)
      osc.stop(now + i * 0.1 + 0.3)
    })
  }, [])

  return { playBiteSound, playCompleteSound }
}

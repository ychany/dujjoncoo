import { useCallback, useRef, useState } from 'react'
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-bridge'

// 광고 그룹 ID (환경변수에서 로드)
const AD_GROUP_ID = import.meta.env.VITE_AD_GROUP_ID || ''

// 광고 지원 여부 체크
const isAdSupported = () => {
  try {
    return loadFullScreenAd?.isSupported?.() ?? false
  } catch {
    return false
  }
}

export function useAd() {
  const [isAdLoaded, setIsAdLoaded] = useState(false)
  const [isShowingAd, setIsShowingAd] = useState(false)
  const adLoadedRef = useRef(false)
  const adSupported = isAdSupported()

  // 광고 미리 로드
  const loadAd = useCallback(() => {
    try {
      if (!loadFullScreenAd?.isSupported?.()) {
        console.log('Ad not supported in this environment')
        return
      }

      if (adLoadedRef.current) return // 이미 로드됨

      loadFullScreenAd({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (event) => {
          if (event.type === 'loaded') {
            console.log('Ad loaded successfully')
            adLoadedRef.current = true
            setIsAdLoaded(true)
          }
        },
        onError: (err) => {
          console.error('Ad load error:', err)
          adLoadedRef.current = false
          setIsAdLoaded(false)
        },
      })
    } catch (err) {
      console.log('Ad load failed:', err)
    }
  }, [])

  // 광고 보여주기
  const showAd = useCallback((onComplete?: () => void) => {
    try {
      if (!showFullScreenAd?.isSupported?.()) {
        console.log('Ad not supported, skipping')
        onComplete?.()
        return
      }

      if (!adLoadedRef.current) {
        console.log('Ad not loaded yet, skipping')
        onComplete?.()
        return
      }

      setIsShowingAd(true)

      showFullScreenAd({
        options: { adGroupId: AD_GROUP_ID },
        onEvent: (event) => {
          console.log('Ad event:', event.type)
          if (event.type === 'dismissed' || event.type === 'failedToShow') {
            setIsShowingAd(false)
            adLoadedRef.current = false
            setIsAdLoaded(false)
            onComplete?.()
            // 다음 광고를 위해 다시 로드
            loadAd()
          }
        },
        onError: (err) => {
          console.error('Ad show error:', err)
          setIsShowingAd(false)
          adLoadedRef.current = false
          setIsAdLoaded(false)
          onComplete?.()
        },
      })
    } catch (err) {
      console.log('Ad show failed:', err)
      onComplete?.()
    }
  }, [loadAd])

  return { loadAd, showAd, isAdLoaded, isShowingAd, isAdSupported: adSupported }
}

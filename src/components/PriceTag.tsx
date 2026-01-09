interface PriceTagProps {
  saved: number // 절약한 금액
}

export default function PriceTag({ saved }: PriceTagProps) {
  const COOKIE_PRICE = 6000

  return (
    <div className="text-center">
      <div className="text-amber-800 font-bold text-lg">
        두바이 쫀득 쿠키
      </div>
      <div className="text-amber-600 text-2xl font-black">
        ₩{COOKIE_PRICE.toLocaleString()}
      </div>
      <div className="text-amber-500 text-sm mt-1">
        (오늘도 못 삼)
      </div>
      {saved > 0 && (
        <div className="mt-2 text-green-600 font-semibold animate-pulse">
          💰 {saved.toLocaleString()}원 절약 중!
        </div>
      )}
    </div>
  )
}

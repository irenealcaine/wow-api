import { useEffect, useState } from 'react'

const DURATION = 800

const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3)

function useCountUp(target) {
  const numericTarget = Number(target) || 0
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / DURATION, 1)
      setValue(Math.round(easeOutCubic(progress) * numericTarget))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [numericTarget])

  return value
}

export default useCountUp

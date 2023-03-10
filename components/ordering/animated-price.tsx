import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'
export function AnimatedPrice(props: { price: number | string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, Number(props.price))

    return controls.stop
  }, [props.price])

  return (
    <div className="flex items-center gap-2">
      <motion.div>{rounded}</motion.div>
      <div> $</div>
    </div>
  )
}

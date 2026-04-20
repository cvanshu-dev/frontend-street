"use client"

import { useEffect, useState, useCallback } from "react"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import { motion, AnimatePresence } from "framer-motion"

const slides = [
  {
    image: "/car10.png",
    title: "Street Essentials",
    subtitle: "Minimal everyday streetwear designed for comfort and style.",
    buttonText: "Shop T-Shirts",
    link: "/collections/tshirts",
  },
  {
    image: "/car8.png",
    title: "Performance Fit",
    subtitle: "Premium compression wear built for training and movement.",
    buttonText: "Shop Compression",
    link: "/collections/compression",
  },
  {
    image: "/car7.png",
    title: "New Season Drop",
    subtitle: "Fresh arrivals made for modern street fashion.",
    buttonText: "Explore Collection",
    link: "/collections/new",
  },
]

const Hero = () => {
  const [index, setIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="relative h-[92vh] w-full overflow-hidden bg-neutral-950">
      {/* Background Layer with Parallax Scale */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`bg-${index}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(80,120,255,0.22),transparent_45%)] z-10" />
          <img
            src={slides[index].image}
            alt={slides[index].title}
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="relative z-20 flex h-full items-center px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl pt-10 md:pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              <motion.div transition={{ duration: 0.5 }}>
                <Heading className="uppercase tracking-[0.12em] text-white leading-tight">
                  <span className="block text-5xl md:text-7xl font-semibold mb-2">Built</span>
                  <span className="block text-4xl md:text-6xl font-light text-white/60 mb-3">For the</span>
                  <span className="block text-5xl md:text-7xl font-semibold bg-gradient-to-r from-white via-cyan-100 to-blue-300 text-transparent bg-clip-text">
                    Uniformless.
                  </span>
                </Heading>
                <div className="mt-6 flex gap-3">
                  <div className="h-[2px] w-16 bg-gradient-to-r from-cyan-400 to-cyan-400/40" />
                  <div className="h-[2px] w-8 bg-gradient-to-r from-cyan-300 to-transparent" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="primary"
                  size="large"
                  className="mt-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 rounded-full px-10 h-12 text-[11px] uppercase tracking-[0.35em] font-semibold border border-cyan-400/50 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                  onClick={() => (window.location.href = slides[index].link)}
                >
                  Shop Collection
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Premium Pagination Indicators */}
      <div className="absolute right-6 md:right-16 bottom-24 flex flex-col gap-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="group relative h-12 w-1 flex items-center justify-center"
            >
              <div 
                className={clx(
                  "h-full w-[2px] transition-all duration-500",
                index === i ? "bg-white" : "bg-white/20 group-hover:bg-white/40"
                )} 
              />
              {index === i && (
                <motion.div 
                  layoutId="active-indicator"
                className="absolute left-[-4px] w-3 h-3 bg-white rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeftMini, ChevronRightMini } from "@medusajs/icons"

const instagramVideos = [
  {
    id: 1,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "Urban Vibes",
    likes: "24.5K",
  },
  {
    id: 2,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "Street Collection",
    likes: "18.3K",
  },
  {
    id: 3,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "New Drop",
    likes: "31.2K",
  },
  {
    id: 4,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "Limited Edition",
    likes: "12.8K",
  },
  {
    id: 5,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "Exclusive",
    likes: "27.6K",
  },
  {
    id: 6,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "Featured",
    likes: "19.4K",
  },
]

export default function InstagramSlider() {
  const [current, setCurrent] = useState(0)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({})

  // Determine visible cards based on screen size
  const itemsPerRow = isMobile ? 2 : 4

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - itemsPerRow + instagramVideos.length) % instagramVideos.length)
  }, [itemsPerRow])

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + itemsPerRow) % instagramVideos.length)
  }, [itemsPerRow])

  const handleMouseEnter = (id: number) => {
    setPlayingId(id)
    if (videoRefs.current[id]) {
      videoRefs.current[id].play().catch(() => {})
    }
  }

  const handleMouseLeave = (id: number) => {
    setPlayingId(null)
    if (videoRefs.current[id]) {
      videoRefs.current[id].pause()
      videoRefs.current[id].currentTime = 0
    }
  }

  const visibleVideos = []
  for (let i = 0; i < itemsPerRow; i++) {
    visibleVideos.push(instagramVideos[(current + i) % instagramVideos.length])
  }

  // Middle video is at index 1 for 4 items, or index 0 for 2 items
  const middleVideoId = visibleVideos[0]?.id || null

  useEffect(() => {
    if (middleVideoId && videoRefs.current[middleVideoId]) {
      const timer = setTimeout(() => {
        videoRefs.current[middleVideoId]?.play().catch(() => {})
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [middleVideoId])

  return (
    <section className="py-16 md:py-24 bg-black overflow-hidden">
      <div className="content-container">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs tracking-[0.35em] uppercase text-cyan-400">
              @StreetCode
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white mt-2 md:mt-3 tracking-tight">
              Instagram Feed
            </h2>
          </div>

          {/* Navigation Controls - Hidden on Mobile, Visible on Tablet+ */}
          <div className="hidden md:flex gap-3 flex-shrink-0">
            <button
              onClick={handlePrev}
              className="p-2 md:p-3 rounded-full border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeftMini className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 md:p-3 rounded-full border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRightMini className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Video Slider Grid - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {visibleVideos.map((video, idx) => {
              const isFirstCard = idx === 0
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`relative overflow-hidden group cursor-pointer rounded-lg md:rounded-xl transition-all duration-300 ${
                    isFirstCard
                      ? "ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20"
                      : "hover:shadow-lg shadow-black/40"
                  }`}
                  onMouseEnter={() => handleMouseEnter(video.id)}
                  onMouseLeave={() => handleMouseLeave(video.id)}
                  style={{ aspectRatio: "1" }}
                >
                  {/* Base Thumbnail */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Video Player */}
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[video.id] = el
                    }}
                    autoPlay={isFirstCard}
                    muted
                    loop
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      isFirstCard ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
                    }`}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>

                  {/* Overlay Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${
                      isFirstCard ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
                    }`}
                  />

                  {/* Instagram-Style Info Bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-3 md:p-4 transform transition-all duration-300 ${
                      isFirstCard
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
                    }`}
                  >
                    <p className="text-white text-xs md:text-sm font-semibold uppercase tracking-[0.15em] line-clamp-1 mb-2">
                      {video.title}
                    </p>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span className="font-medium">{video.likes}</span>
                    </div>
                  </div>

                  {/* Play Icon - Only on Hover for Non-First Cards */}
                  {!isFirstCard && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-cyan-400/25 backdrop-blur-sm border border-cyan-400/60 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6 text-cyan-300 fill-cyan-300 ml-0.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Mobile Navigation - Visible Only on Mobile */}
        <div className="flex md:hidden justify-center gap-3 mt-6">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
            aria-label="Previous"
          >
            <ChevronLeftMini className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
            aria-label="Next"
          >
            <ChevronRightMini className="w-4 h-4" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-1.5 md:gap-2 mt-8 md:mt-12 flex-wrap">
          {instagramVideos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-6 md:w-8 h-2 bg-cyan-400"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

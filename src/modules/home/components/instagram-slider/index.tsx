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
  },
  {
    id: 2,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "Street Collection",
  },
  {
    id: 3,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "New Drop",
  },
  {
    id: 4,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "Limited Edition",
  },
  {
    id: 5,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "Exclusive",
  },
  {
    id: 6,
    videoUrl: "/vid1.mp4",
    thumbnailUrl: "/thumb.png",
    title: "Featured",
  },
]

export default function InstagramSlider() {
  const [current, setCurrent] = useState(0)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({})

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + instagramVideos.length) % instagramVideos.length)
  }, [])

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % instagramVideos.length)
  }, [])

  const handleMouseEnter = (id: number) => {
    setPlayingId(id)
    if (videoRefs.current[id]) {
      videoRefs.current[id].play().catch(() => {
        // Video playback might be blocked, fallback to thumbnail
      })
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
  for (let i = 0; i < 4; i++) {
    visibleVideos.push(instagramVideos[(current + i) % instagramVideos.length])
  }

  // Middle video is at index 1 (second position in 4-column grid)
  const middleVideoId = visibleVideos[1]?.id || null

  // Auto-play middle video on mount and when slides change
  useEffect(() => {
    if (middleVideoId && videoRefs.current[middleVideoId]) {
      const timer = setTimeout(() => {
        videoRefs.current[middleVideoId]?.play().catch(() => {
          // Video playback might be blocked
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [middleVideoId])

  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="content-container">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="text-xs tracking-[0.35em] uppercase text-cyan-400">
              @StreetCode
            </span>
            <h2 className="text-5xl md:text-6xl font-semibold text-white mt-3 tracking-tight">
              Instagram Feed
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeftMini />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRightMini />
            </button>
          </div>
        </div>

        {/* Video Slider Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {visibleVideos.map((video, idx) => {
              const isMiddleVideo = idx === 1
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`relative aspect-square rounded-xl overflow-hidden group cursor-pointer ${
                    isMiddleVideo ? "ring-2 ring-cyan-400" : ""
                  }`}
                  onMouseEnter={() => handleMouseEnter(video.id)}
                  onMouseLeave={() => handleMouseLeave(video.id)}
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
                    autoPlay={isMiddleVideo}
                    muted
                    loop
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      isMiddleVideo ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>

                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                      isMiddleVideo ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  {/* Title */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 ${
                      isMiddleVideo ? "translate-y-0" : "translate-y-4 group-hover:translate-y-0"
                    }`}
                  >
                    <p className="text-white text-sm font-semibold uppercase tracking-[0.2em]">
                      {video.title}
                    </p>
                  </div>

                  {/* Play Icon */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      isMiddleVideo ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-cyan-400/20 backdrop-blur-sm border border-cyan-400/50 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-cyan-400 fill-cyan-400"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Border */}
                  <div
                    className={`absolute inset-0 rounded-xl transition-colors duration-300 pointer-events-none ${
                      isMiddleVideo ? "border-2 border-cyan-400" : "border border-cyan-400/0 group-hover:border-cyan-400/50"
                    }`}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {instagramVideos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-8 bg-cyan-400"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

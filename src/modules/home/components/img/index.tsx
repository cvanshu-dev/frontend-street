"use client"

import React, { useState, useEffect } from "react"

const collections = [
  {
    id: 1,
    name: "Topwear",
    image: "/car11.png",
  },
  {
    id: 2,
    name: "Bottomwear",
    image: "/car12.png",
  },
]

export default function CategorySplitSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % collections.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const collection = collections[current]

  return (
    <section className="w-full h-screen p-6">
      <div className="relative w-full h-full overflow-hidden group rounded-xl">
        <img
          src={collection.image}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-16 text-white">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-wide">
            {collection.name}
          </h2>

          <div className="flex items-center gap-8">
            <button className="px-8 py-3 border border-cyan-400 text-sm uppercase tracking-wider hover:bg-cyan-400 hover:text-black transition duration-300">
              Shop
            </button>

            <div className="flex gap-2">
              {collections.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 transition-all duration-300 ${
                    idx === current ? "w-8 bg-white" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


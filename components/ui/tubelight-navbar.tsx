"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 pointer-events-none",
        "z-40",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 border border-gray-600 backdrop-blur-lg py-1.5 px-2 rounded-full shadow-lg pointer-events-auto mb-6 sm:mb-0 sm:mt-6">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300",
                "text-gray-300 hover:text-white",
                isActive && "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <div
                  className={cn(
                    "absolute inset-0 w-full bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-full -z-10",
                    "transition-all duration-300 ease-spring",
                    "before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:w-8 before:h-1",
                    "before:bg-gradient-to-r before:from-yellow-400 before:to-yellow-600 before:rounded-t-full",
                    "after:absolute after:-top-4 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-6",
                    "after:bg-yellow-500/20 after:rounded-full after:blur-md",
                  )}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-yellow-500/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-yellow-500/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-yellow-500/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </div>
              )}
              {pathname === item.url && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-600 to-gray-800 animate-fadeIn" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
} 
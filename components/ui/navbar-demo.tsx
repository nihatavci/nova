"use client"

import { Home, BarChart, Info, Mail } from 'lucide-react'
import { NavBar } from "./tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Dashboard', url: '/dashboard', icon: BarChart },
    { name: 'About', url: '/about', icon: Info },
    { name: 'Contact', url: '/contact', icon: Mail }
  ]

  return <NavBar items={navItems} className="z-50" />
} 
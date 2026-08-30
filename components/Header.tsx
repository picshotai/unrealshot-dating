"use client"

import Link from "next/link"
import { Link as PublicLink } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolioLogo } from "@/components/icons/FolioLogo"
import { LocaleSwitcher, type LocaleSwitcherProps } from "@/components/LocaleSwitcher"
import { useLocale, useTranslations } from "next-intl"
import { isPublishedBlogLocale } from "@/i18n/config"

interface NavbarProps {
  children: React.ReactNode
  className?: string
}

interface NavBodyProps {
  children: React.ReactNode
  className?: string
}

interface NavItemsProps {
  items: {
    name: string
    link: string
  }[]
  className?: string
  onItemClick?: () => void
}

interface MobileNavProps {
  children: React.ReactNode
  className?: string
}

interface MobileNavHeaderProps {
  children: React.ReactNode
  className?: string
}

interface MobileNavMenuProps {
  children: React.ReactNode
  className?: string
  isOpen: boolean
  onClose: () => void
}

export const Navbar = ({ children, className }: NavbarProps) => {
  return <motion.header className={cn("fixed inset-x-0 top-0 z-60 w-full pt-3 sm:pt-4 px-3 sm:px-4", className)}>{children}</motion.header>
}

export const NavBody = ({ children, className }: NavBodyProps) => {
  return (
    <motion.div
      className={cn(
        "relative z-[60] mx-auto max-w-5xl xl:max-w-6xl w-full flex flex-row items-center justify-between rounded-2xl bg-white/95 border border-gray-200/80 px-4 py-2.5 hidden backdrop-blur-xl shadow-xs lg:flex",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export default Header
export { Header }

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <motion.nav
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "flex flex-row items-center justify-center gap-1 text-sm font-semibold text-gray-700 transition duration-200 whitespace-nowrap",
        className,
      )}
    >
      {items.map((item, idx) => (
        <PublicLink
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-3.5 py-1.5 font-semibold transition-colors cursor-pointer text-gray-700 hover:text-gray-950"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div layoutId="hovered" className="absolute inset-0 h-full w-full rounded-lg bg-gray-100/90" />
          )}
          <span className="relative z-20">{item.name}</span>
        </PublicLink>
      ))}
    </motion.nav>
  )
}

export const MobileNav = ({ children, className }: MobileNavProps) => {
  return (
    <motion.div
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-1.5rem)] flex-col items-center justify-between bg-white/95 border border-gray-200/80 rounded-2xl backdrop-blur-xl py-2.5 px-4 shadow-xs lg:hidden",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => {
  return <div className={cn("flex w-full flex-row items-center justify-between", className)}>{children}</div>
}

export const MobileNavMenu = ({ children, className, isOpen, onClose }: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "absolute inset-x-0 top-[60px] z-50 flex w-full text-black font-semibold flex-col justify-start gap-2 rounded-2xl bg-white/98 border border-gray-200/80 px-4 py-5 shadow-xl backdrop-blur-xl",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle navigation menu"
      className="p-1.5 rounded-lg border border-gray-200 bg-gray-50/80 hover:bg-gray-100 transition-colors text-gray-800 cursor-pointer"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  )
}

export interface HeaderProps {
  localeSwitcher?: LocaleSwitcherProps
}

function Header({ localeSwitcher }: HeaderProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("Common")
  const locale = useLocale()

  const navItems = [
    { name: t("navigation.howItWorks"), link: "/#how-it-works" },
    { name: t("navigation.pricing"), link: "/pricing" },
    ...(isPublishedBlogLocale(locale) ? [{ name: t("navigation.blog"), link: "/blog" }] : []),
  ]

  return (
    <Navbar>
      <NavBody>
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <PublicLink href="/" className="flex items-center gap-2 cursor-pointer">
            <FolioLogo className="w-28 h-7 sm:w-32 sm:h-8" />
          </PublicLink>
        </div>

        {/* Streamlined Navigation Items */}
        <NavItems items={navItems} className="mx-2" />

        {/* CTA & Language Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <LocaleSwitcher {...localeSwitcher} />
          <Link href="/dashboard" className="shrink-0">
            <Button
              className="text-xs sm:text-sm font-semibold h-10 px-4 py-2 group relative bg-[#ff6f00] hover:bg-[#e66400] text-white rounded-xl overflow-hidden cursor-pointer flex items-center gap-2 shadow-xs transition-all whitespace-nowrap"
            >
              <span>{t("navigation.startDatingShoot")}</span>
              <div className="bg-white/20 rounded-md p-1 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5">
                <img
                  src="/arrow.svg"
                  alt=""
                  className="w-3 h-3 invert brightness-0"
                />
              </div>
            </Button>
          </Link>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <div className="flex items-center shrink-0">
            <PublicLink href="/" className="flex items-center gap-2">
              <FolioLogo className="w-24 h-7" />
            </PublicLink>
          </div>
          <div className="flex items-center gap-2">
            <LocaleSwitcher {...localeSwitcher} />
            <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex flex-col items-center w-full gap-1">
            {navItems.map((item, idx) => (
              <PublicLink
                key={idx}
                href={item.link}
                className="w-full px-3 py-2.5 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-center font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </PublicLink>
            ))}
            <div className="flex flex-col gap-2 mt-3 w-full items-center">
              <Link href="/dashboard" className="w-full">
                <Button
                  className="w-full text-sm font-semibold py-5 bg-[#ff6f00] hover:bg-[#e66400] text-white rounded-xl overflow-hidden cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>{t("navigation.startDatingShoot")}</span>
                  <div className="bg-white/20 rounded-md p-1 flex items-center justify-center">
                    <img
                      src="/arrow.svg"
                      alt=""
                      className="w-3.5 h-3.5 invert brightness-0"
                    />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}

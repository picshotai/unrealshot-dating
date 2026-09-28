"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link as PublicLink, usePathname } from "@/i18n/navigation"
import { isPublishedBlogLocale } from "@/i18n/config"
import { LocaleSwitcher, type LocaleSwitcherProps } from "@/components/LocaleSwitcher"
import { cn } from "@/lib/utils"

/*
 * One dark capsule on every public page.
 *   rest      sized to its content plus a little room, wordmark visible
 *   scrolled  tucks in to fit its content (wordmark folds away) and lifts off the page
 *   mobile    the same capsule grows into the menu sheet
 */

const EASE = [0.16, 1, 0.3, 1] as const
const SCROLL_THRESHOLD = 24
const MARK = 36 // logo mark, px
const BREATHING_ROOM = 40 // px between the links and the actions when compact
const REST_ROOM = 72 // extra px the resting capsule gets on top of its content

type NavItem = { name: string; href: string; englishOnly?: boolean }

function NavLink({ item, className, children, ...props }: {
  item: NavItem
  className?: string
  children: ReactNode
  onClick?: () => void
  onMouseEnter?: () => void
  "aria-current"?: "page"
}) {
  return item.englishOnly
    ? <Link href={item.href} className={className} {...props}>{children}</Link>
    : <PublicLink href={item.href} className={className} {...props}>{children}</PublicLink>
}

export interface HeaderProps {
  localeSwitcher?: LocaleSwitcherProps
}

function Header({ localeSwitcher }: HeaderProps = {}) {
  const t = useTranslations("Common")
  const locale = useLocale()
  const pathname = usePathname()
  const menuId = useId()

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [widths, setWidths] = useState<{ compact: number; rest: number } | null>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLSpanElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const items: NavItem[] = [
    { name: t("navigation.examples"), href: "/dating-photos/examples" },
    { name: t("navigation.howItWorks"), href: "/how-it-works" },
    { name: t("navigation.pricing"), href: "/pricing" },
    ...(isPublishedBlogLocale(locale) ? [{ name: t("navigation.blog"), href: "/blog", englishOnly: true }] : []),
  ]
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  // Rest vs scrolled
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Both desktop widths come from the content itself, so the capsule fits every locale and never runs long
  useEffect(() => {
    const measure = () => {
      const links = linksRef.current
      const actions = actionsRef.current
      if (!links || !actions || !links.offsetWidth) return
      const compact = Math.ceil(8 + MARK + 16 + links.offsetWidth + BREATHING_ROOM + actions.offsetWidth + 8 + 2)
      setWidths({ compact, rest: compact + (wordmarkRef.current?.scrollWidth ?? 0) + REST_ROOM })
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (linksRef.current) observer.observe(linksRef.current)
    if (actionsRef.current) observer.observe(actionsRef.current)
    return () => observer.disconnect()
  }, [])

  // Mobile sheet: Escape closes, and it closes if the window grows to desktop.
  // No scroll lock: hiding the page scrollbar shifts the layout, and the scrim already blocks the page.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    const desktop = window.matchMedia("(min-width: 1024px)")
    const onDesktop = () => desktop.matches && setOpen(false)
    window.addEventListener("keydown", onKey)
    desktop.addEventListener("change", onDesktop)
    return () => {
      window.removeEventListener("keydown", onKey)
      desktop.removeEventListener("change", onDesktop)
    }
  }, [open])

  const compact = scrolled && !open
  const close = () => setOpen(false)

  return (
    <MotionConfig reducedMotion="user">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-60 px-3 pt-3 sm:px-4 sm:pt-4">
        <AnimatePresence>
          {open && (
            <motion.div
              key="scrim"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
              className="pointer-events-auto fixed inset-0 bg-black/50 backdrop-blur-[2px] lg:hidden"
            />
          )}
        </AnimatePresence>

        <nav
          aria-label="Main"
          style={{ "--nav-compact": widths ? `${widths.compact}px` : "50rem", "--nav-rest": widths ? `${widths.rest}px` : "58rem" } as CSSProperties}
          className={cn(
            "pointer-events-auto relative mx-auto w-full max-w-[72rem] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0f0f0f]/[0.97] text-white backdrop-blur-xl backdrop-saturate-150",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[max-width,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            scrolled && "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_14px_36px_-14px_rgba(0,0,0,0.6)]",
            compact ? "lg:max-w-(--nav-compact)" : "lg:max-w-(--nav-rest)",
          )}
        >
          <div className="flex h-14 items-center justify-between gap-3 px-2">
            <div className="flex min-w-0 items-center">
              <PublicLink href="/" onClick={close} aria-label="Unrealshot" className="flex shrink-0 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6f00]">
                <Image src="/site-logo.png" alt="" width={MARK} height={MARK} priority className="size-9 shrink-0 rounded-full ring-1 ring-white/10" />
                {/* The wordmark folds away when the capsule tucks in */}
                <span
                  className={cn(
                    "grid grid-cols-[1fr] transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none max-[359px]:hidden",
                    compact && "lg:grid-cols-[0fr] lg:opacity-0",
                  )}
                >
                  <span ref={wordmarkRef} className="overflow-hidden whitespace-nowrap pl-2.5 pr-1 font-mono text-lg font-bold tracking-tight text-white">Unrealshot</span>
                </span>
              </PublicLink>

              <div ref={linksRef} onMouseLeave={() => setHovered(null)} className="ml-4 hidden shrink-0 items-center lg:flex">
                {items.map((item, i) => {
                  const active = isActive(item.href)
                  return (
                    <NavLink
                      key={item.href}
                      item={item}
                      onMouseEnter={() => setHovered(i)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6f00]",
                        active ? "text-white" : "text-white/65 hover:text-white",
                      )}
                    >
                      {hovered === i && (
                        <motion.span layoutId="nav-hover" transition={{ duration: 0.3, ease: EASE }} className="absolute inset-0 rounded-full bg-white/[0.08]" />
                      )}
                      <span className="relative">{item.name}</span>
                      {active && <span aria-hidden="true" className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#ff6f00]" />}
                    </NavLink>
                  )
                })}
              </div>
            </div>

            {/* Desktop actions */}
            <div ref={actionsRef} className="hidden shrink-0 items-center gap-1 lg:flex">
              <LocaleSwitcher {...localeSwitcher} />
              <Link
                href="/login"
                className="group inline-flex h-10 items-center gap-3 rounded-full bg-[#ff6f00] pl-4 pr-1 text-sm font-semibold text-white transition-colors hover:bg-[#f26800] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6f00]"
              >
                <span className="whitespace-nowrap">{t("navigation.startDatingShoot")}</span>
                <span className="grid size-8 place-items-center rounded-full bg-white text-[#101010]">
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </div>

            {/* Mobile actions: the CTA stays one tap away, the menu sits beside it */}
            <div className="flex shrink-0 items-center gap-1 lg:hidden">
              <Link
                href="/login"
                aria-label={t("navigation.startDatingShoot")}
                className={cn(
                  "grid size-10 place-items-center rounded-full bg-[#ff6f00] text-white transition-[opacity,transform] duration-300",
                  open && "pointer-events-none scale-90 opacity-0",
                )}
                tabIndex={open ? -1 : undefined}
              >
                <ArrowRight className="size-[18px]" aria-hidden="true" />
              </Link>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={t(open ? "navigation.closeMenu" : "navigation.openMenu")}
                className="grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6f00]"
              >
                <span aria-hidden="true" className="relative block h-4 w-4">
                  <span
                    className="absolute inset-x-0 top-1/2 -mt-px h-[1.5px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: open ? "rotate(45deg)" : "translateY(-3.5px)" }}
                  />
                  <span
                    className="absolute inset-x-0 top-1/2 -mt-px h-[1.5px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: open ? "rotate(-45deg)" : "translateY(3.5px)" }}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Mobile sheet: the capsule itself grows downward */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={menuId}
                key="sheet"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="lg:hidden"
              >
                <div className="px-2 pb-2">
                  <ul className="border-t border-white/[0.08] pt-2">
                    {items.map((item, i) => {
                      const active = isActive(item.href)
                      return (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: EASE, delay: 0.04 * i + 0.05 }}
                        >
                          <NavLink
                            item={item}
                            onClick={close}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex items-center justify-between rounded-2xl px-3 py-3 font-[family-name:var(--font-inter-tight)] text-xl font-semibold tracking-[-0.02em] transition-colors hover:bg-white/[0.06]",
                              active ? "text-white" : "text-white/85",
                            )}
                          >
                            {item.name}
                            {active && <span aria-hidden="true" className="size-1.5 rounded-full bg-[#ff6f00]" />}
                          </NavLink>
                        </motion.li>
                      )
                    })}
                  </ul>

                  <div className="mt-2 flex items-center gap-2 border-t border-white/[0.08] pt-3">
                    <LocaleSwitcher {...localeSwitcher} />
                    <Link
                      href="/login"
                      onClick={close}
                      className="flex h-12 min-w-0 flex-1 items-center justify-between gap-3 rounded-full bg-[#ff6f00] pl-5 pr-1.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#f26800]"
                    >
                      <span className="truncate">{t("navigation.startDatingShoot")}</span>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[#101010]">
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </MotionConfig>
  )
}

export default Header
export { Header }

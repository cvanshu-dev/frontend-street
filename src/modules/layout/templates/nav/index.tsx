import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-14 md:h-16 mx-auto bg-black border-b border-b-cyan-400/40">
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-40 blur-sm" />
        <div className="absolute inset-0 shadow-[inset_0_-1px_16px_rgba(34,211,238,0.1), 0_8px_32px_rgba(34,211,238,0.12)]" />
        <nav className="content-container flex items-center justify-between w-full h-full px-4 md:px-8 relative z-20 gap-2">
          {/* Left - MENU */}
          <div className="flex-1 basis-0 h-full flex items-center min-w-0">
            <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
          </div>

          {/* Center - STREET CODE */}
          <div className="flex items-center h-full flex-shrink-0">
            <LocalizedClientLink
              href="/"
              className="uppercase tracking-[0.4em] md:tracking-[0.8em] text-white text-sm md:text-xl font-light hover:text-cyan-400 transition-colors whitespace-nowrap"
              data-testid="nav-store-link"
            >
              Street Code
            </LocalizedClientLink>
          </div>

          {/* Right - ACCOUNT & CART */}
          <div className="flex items-center gap-x-3 md:gap-x-8 h-full flex-1 basis-0 justify-end min-w-0">
            <LocalizedClientLink
              className="uppercase tracking-[0.2em] md:tracking-[0.3em] text-white text-xs md:text-sm font-light hover:text-cyan-400 transition-colors hidden sm:inline whitespace-nowrap"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="uppercase tracking-[0.2em] md:tracking-[0.3em] text-white text-xs md:text-sm font-light hover:text-cyan-400 transition-colors flex gap-1 md:gap-2 whitespace-nowrap"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}

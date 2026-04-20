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
    <div className="sticky top-0 inset-x-0 z-50 group premium-nav-wrapper">
      <header 
        className="relative duration-300 premium-nav-header"
        style={{
          height: "80px",
          background: `linear-gradient(
            180deg,
            rgba(20, 20, 20, 0.68) 0%,
            rgba(10, 10, 10, 0.72) 100%
          )`,
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <nav 
          className="px-8 flex items-center justify-between w-full h-full premium-nav"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(80px, 1fr) auto minmax(80px, 1fr)",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {/* Left Menu - Fixed Width Container */}
          <div className="flex items-center h-full justify-start premium-nav-left">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          {/* Center Logo - Absolute Center */}
          <div className="flex items-center h-full justify-center premium-nav-center">
            <LocalizedClientLink
              href="/"
              className="premium-nav-logo"
              data-testid="nav-store-link"
              style={{
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#F5F5F5",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                textDecoration: "none",
                position: "relative",
                whiteSpace: "nowrap",
              }}
            >
              STREET CODE
            </LocalizedClientLink>
          </div>

          {/* Right Actions - Account & Cart */}
          <div className="flex items-center gap-x-8 h-full flex-1 justify-end premium-nav-right">
            <div className="hidden small:flex items-center gap-x-8 h-full">
              <LocalizedClientLink
                className="premium-nav-link"
                href="/account"
                data-testid="nav-account-link"
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#E3E3E3",
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                  position: "relative",
                }}
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="premium-nav-link premium-nav-cart"
                  href="/cart"
                  data-testid="nav-cart-link"
                  style={{
                    fontSize: "11px",
                    fontWeight: "500",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#E3E3E3",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  Cart <span style={{ fontSize: "10px", opacity: 0.7 }}>(0)</span>
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

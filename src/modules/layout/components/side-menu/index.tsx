"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  "T shirts": "/collections/tshirt",
  Account: "/account",
  Cart: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="uppercase tracking-[0.3em] text-white text-sm font-light hover:text-cyan-400 transition-colors"
                >
                  Menu
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-x-4"
                enterTo="opacity-100 translate-x-0 backdrop-blur-xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0 backdrop-blur-xl"
                leaveTo="opacity-0 translate-x-4"
              >
                <PopoverPanel 
                  className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-[51] inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-xl premium-side-menu-panel"
                  style={{
                    background: `linear-gradient(
                      180deg,
                      rgba(20, 20, 20, 0.68) 0%,
                      rgba(10, 10, 10, 0.72) 100%
                    )`,
                    borderRadius: "3px",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full justify-between p-6 border border-gray-900"
                    style={{
                      background: "transparent",
                      borderColor: "rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <style jsx>{`
                      .premium-side-menu-panel {
                        box-shadow: 
                          inset 1px 0 0 rgba(255, 255, 255, 0.08),
                          0 8px 32px rgba(0, 0, 0, 0.4);
                      }
                    `}</style>
                    <div className="flex justify-end" id="xmark">
                      <button 
                        data-testid="close-menu-button" 
                        onClick={close}
                        style={{
                          color: "#E3E3E3",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#E3E3E3")}
                      >
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col gap-6 items-start justify-start">
                      {Object.entries(SideMenuItems).map(([name, href]) => {
                        return (
                          <li key={name}>
                            <LocalizedClientLink
                              href={href}
                              className="premium-menu-link"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                              style={{
                                fontSize: "24px",
                                fontWeight: "600",
                                letterSpacing: "-0.02em",
                                color: "#E3E3E3",
                                transition: "all 0.3s ease",
                                textDecoration: "none",
                                display: "inline-block",
                                position: "relative",
                              }}
                            >
                              {name}
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between items-center"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                          style={{ color: "#E3E3E3" }}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                            style={{ color: "#E3E3E3" }}
                          />
                        </div>
                      )}
                      <div
                        className="flex justify-between items-center"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                        style={{ color: "#E3E3E3" }}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                          style={{ color: "#E3E3E3" }}
                        />
                      </div>
                      <Text 
                        className="flex justify-between txt-compact-small"
                        style={{ 
                          color: "#808080",
                          fontSize: "10px",
                          letterSpacing: "0.05em"
                        }}
                      >
                        © {new Date().getFullYear()} Street Code. All rights
                        reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu

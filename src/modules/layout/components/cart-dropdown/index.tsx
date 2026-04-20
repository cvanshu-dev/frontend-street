"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full premium-cart-button">
          <LocalizedClientLink
            className="premium-nav-link premium-nav-cart text-[11px] font-medium tracking-[0.25em] uppercase text-white/95 hover:text-white transition flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            href="/cart"
            data-testid="nav-cart-link"
          >
            Cart{" "}
            <span
              className="text-[10px] text-white/80"
            >
              ({totalItems})
            </span>
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+10px)] right-0 w-[440px] text-white/90 premium-cart-dropdown overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-[#0b0b0c]/95 via-[#0d0d10]/95 to-[#09090a]/95 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
            data-testid="nav-cart-dropdown"
          >
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/8">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.3em] text-white/90">Shopping Bag</span>
                <span className="text-[12px] text-white/70">Curated essentials</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/80">{totalItems} Items</span>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-5 py-4 grid grid-cols-1 gap-y-6 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[110px_1fr] gap-x-4 pb-6 border-b border-white/8 last:border-b-0 last:pb-0"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-24"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[190px]">
                                <h3 className="text-[14px] font-medium text-white/90 overflow-hidden text-ellipsis">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                  className="text-[11px] text-white/70"
                                >
                                  Qty: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-end">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white hover:text-white/80 transition"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div
                  className="px-5 py-4 flex flex-col gap-y-4 text-small-regular border-t border-white/8 text-white/90"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white/90">
                      Subtotal{" "}
                      <span className="font-normal text-white/70">(excl. taxes)</span>
                    </span>
                    <span
                      className="text-large-semi"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                      style={{ color: "#ffffff", fontWeight: "600" }}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      className="w-full premium-cart-cta"
                      size="large"
                      data-testid="go-to-cart-button"
                      style={{
                        background: "#f3f1ea",
                        color: "#0b0b0c",
                        border: "1px solid #f3f1ea",
                        fontWeight: "600",
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      View Cart
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div
                  className="flex py-16 flex-col gap-y-4 items-center justify-center text-white/90"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-white/8 border border-white/15 text-[10px] font-semibold text-white/80"
                  >
                    0
                  </div>
                  <span className="text-[14px] text-white/90">Your bag is empty.</span>
                  <div>
                    <LocalizedClientLink href="/store">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button
                          onClick={close}
                          style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            color: "#ffffff",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                            fontWeight: "600",
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Explore
                        </Button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown

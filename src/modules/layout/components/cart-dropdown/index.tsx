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
            Cart{" "}
            <span
              style={{
                fontSize: "10px",
                opacity: 0.7,
                marginLeft: "0.25rem",
              }}
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
            className="hidden small:block absolute top-[calc(100%+8px)] right-0 w-[420px] text-ui-fg-base premium-cart-dropdown"
            data-testid="nav-cart-dropdown"
            style={{
              background: `linear-gradient(
                180deg,
                rgba(25, 25, 25, 0.70) 0%,
                rgba(15, 15, 15, 0.75) 100%
              )`,
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "3px",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: `
                inset 0 1px 0 rgba(255, 255, 255, 0.08),
                0 8px 32px rgba(0, 0, 0, 0.4)
              `,
            }}
          >
            <div className="p-4 flex items-center justify-center border-b" style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}>
              <h3 style={{ 
                fontSize: "12px", 
                fontWeight: "600", 
                letterSpacing: "0.1em", 
                textTransform: "uppercase", 
                color: "#F5F5F5" 
              }}>Shopping Bag</h3>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
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
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 style={{ fontSize: "14px", fontWeight: "500", color: "#E3E3E3", overflow: "hidden", textOverflow: "ellipsis" }}>
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
                                  style={{ fontSize: "11px", color: "#D0D0D0" }}
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
                            className="mt-1 remove-btn"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div
                  className="p-4 flex flex-col gap-y-4 text-small-regular border-t"
                  style={{ borderColor: "rgba(255, 255, 255, 0.06)", color: "#E3E3E3" }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ fontWeight: "600", color: "#E8E8E8" }}>
                      Subtotal{" "}
                      <span style={{ fontWeight: "400", color: "#D0D0D0" }}>(excl. taxes)</span>
                    </span>
                    <span
                      className="text-large-semi"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                      style={{ color: "#F5F5F5", fontWeight: "600" }}
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
                        background: "#f5f5f5",
                        color: "#0a0a0a",
                        border: "1px solid #f5f5f5",
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
                  className="flex py-16 flex-col gap-y-4 items-center justify-center"
                  style={{ color: "#E8E8E8" }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "#E8E8E8"
                    }}
                  >
                    0
                  </div>
                  <span style={{ fontSize: "14px", color: "#E8E8E8" }}>Your bag is empty.</span>
                  <div>
                    <LocalizedClientLink href="/store">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button
                          onClick={close}
                          style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            color: "#E8E8E8",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
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

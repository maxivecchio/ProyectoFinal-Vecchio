import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { CiCircleCheck } from "react-icons/ci";
import { FaRegCircleXmark } from "react-icons/fa6";
import { Input } from "@nextui-org/react";
import { useCart } from "../context/CartContext";

import {formatNumberToUSStyle} from '../utils/utils'

const Cart = () => {
  const { cart, setCart, removeFromCart, updateQuantity } = useCart();

  const calculateSubTotal = () => {
    if (cart) {
      let total = 0;
      cart.items.forEach((product) => {
        let productTotal = product.quantity * product.product.price;
        total += productTotal;
      });
      return total;
    }
  };

  const handleIncrease = (product) => {
    updateQuantity(product.product.slug, product.quantity + 1);
  };

  const handleDecrease = (product) => {
    if (product.quantity > 1) {
      updateQuantity(product.product.slug, product.quantity - 1);
    }
  };

  console.log(cart.items[0]?.product);
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto pt-24 max-w-2xl px-4 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <Link to="/">Back to Homepage</Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Shopping Cart
        </h1>
        {cart && cart.itemsTotal > 0 ? (
          <>
            <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                <h2 id="cart-heading" className="sr-only">
                  Items in your shopping cart
                </h2>
                <ul
                  role="list"
                  className="divide-y divide-foreground/20 border-b border-foreground/20"
                >
                  {cart.items.map((product, productIdx) => (
                    <li key={productIdx} className={`flex py-6 sm:py-10`}>
                      <div className="flex-shrink-0">
                        <img
                          src={product.product.img}
                          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex flex-col justify-between">
                              <h3 className="text-sm">
                                {product.product.name}
                              </h3>
                            </div>
                              <p className="mt-1 text-sm font-medium text-foreground/90">
                              Price per unit: $
                              {formatNumberToUSStyle(product.product.price)}
                            </p>
                            <div className="cart-item">
                              <div>{product.product.name}</div>
                              <div className="quantity-controls flex items-center space-x-1 ">
                                <button
                                  type="button"
                                  onClick={() => handleDecrease(product)}
                                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold py-1 px-2 rounded"
                                >
                                  -
                                </button>
                                <span className="bg-gray-200 py-1 px-3 rounded text-gray-800 font-semibold">
                                  {product.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleIncrease(product)}
                                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold py-1 px-2 rounded"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              color="danger"
                              className="mt-2 p-0"
                              onClick={() => {
                                removeFromCart(product.product.slug);
                              }}
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <label
                              htmlFor={`quantity-${productIdx}`}
                              className="sr-only"
                            >
                              Quantity, {product.product.name}
                            </label>
                          </div>
                        </div>
                        <p className="mt-4 flex space-x-2 text-sm text-foreground/70">
                          {product.product.stock > 0 ? (
                            <CiCircleCheck
                              className="h-5 w-5 flex-shrink-0 text-green-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <FaRegCircleXmark
                              className="h-5 w-5 flex-shrink-0 text-red-300"
                              aria-hidden="true"
                            />
                          )}
                          <span>
                            {product.product.stock > 0
                              ? "In stock"
                              : `Out Of Stock`}
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
              <div className="lg:col-span-5 flex flex-col lg:gap-y-8">
                <section
                  aria-labelledby="summary-heading"
                  className="mt-16 w-full rounded-lg bg-gray-50 dark:bg-background border-1 px-4 py-6 sm:p-6 lg:mt-0 lg:p-8"
                >
                  <h2
                    id="summary-heading"
                    className="text-lg font-medium text-foreground/90"
                  >
                    Order summary
                  </h2>

                  <dl className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-foreground/70">Subtotal</dt>
                      <dd className="text-sm font-medium text-foreground/90">
                        ${formatNumberToUSStyle(calculateSubTotal())}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-foreground/20 pt-4">
                      <dt className="text-base font-medium text-foreground/80">
                        Order total
                      </dt>
                      <dd className="text-base font-medium text-foreground/80">
                        ${formatNumberToUSStyle(calculateSubTotal())}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <Link to={"/checkout"}>
                      <button
                        type="button"
                        className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-background shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        Checkout
                      </button>
                    </Link>
                  </div>
                </section>
              </div>
            </form>
          </>
        ) : (
          <div className="mt-4">
            <h2 className="mb-2 text-lg">
              You don't have any products in your cart.
            </h2>
            <Link to="/">
              <Button>Explore Shop</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

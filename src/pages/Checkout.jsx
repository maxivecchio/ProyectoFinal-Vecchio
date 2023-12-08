import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiCircleCheck } from "react-icons/ci";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import {
  Tabs,
  Tab,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Checkbox,
} from "@nextui-org/react";
import { formatNumberToUSStyle } from "../utils/utils";
import {
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
  TbCircleNumber4,
} from "react-icons/tb";
import { FaCheckCircle } from "react-icons/fa";
import { MdArrowRightAlt } from "react-icons/md";

import { Link, useNavigate } from "react-router-dom";

import { firestoreDatabase } from "../../firebase/config";
import { collection, addDoc, updateDoc } from "firebase/firestore";

const Checkout = () => {
  const { cart, setCart } = useCart();
  const [selected, setSelected] = useState();
  const [currentTab, setCurrentTab] = useState("shipping-address");
  const [shippingCompleted, setShippingCompleted] = useState(false);
  const [billingCompleted, setBillingCompleted] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();
  const [sameShippingBilling, setSameShippingBilling] = useState(true);

  const [formData, setFormData] = useState({
    email: cart?.email || null,
    shippingAddress: {
      first_name: null,
      last_name: null,
      address_1: null,
      address_2: null,
      city: null,
      province: null,
      country_code: "ar",
      postal_code: null,
      phone: null,
    },
    billingAddress: {
      first_name: null,
      last_name: null,
      address_1: null,
      address_2: null,
      city: null,
      province: null,
      country_code: "ar",
      postal_code: null,
      phone: null,
    },
    payment: {
      name_on_card: null,
      card_number: null,
      exp_month: null,
      exp_year: null,
      cvc: null,
      last4digits: null,
    },
  });

  const handleChange = (section, e) => {
    if (e.target.name === "email") {
      setFormData({ ...formData, email: e.target.value });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const last4digits = formData.payment.card_number
      ? formData.payment.card_number.slice(-4)
      : null;

    const updatedPayment = {
      ...formData.payment,
      last4digits: last4digits,
    };
    if (sameShippingBilling) {
      setCart((prevCart) => ({
        ...prevCart,
        email: formData.email,
        orderDetails: {
          ...prevCart.orderDetails,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.shippingAddress,
          payment: updatedPayment,
        },
      }));
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        email: formData.email,
        orderDetails: {
          ...prevCart.orderDetails,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddress,
          payment: updatedPayment,
        },
      }));
    }

    console.log("cart", cart);
  };

  console.log("cart", cart);
  const inputVariant = "bordered";

  const formShippingFields = [
    {
      name: "email",
      label: "Email",
      colSpan: "col-span-4",
      isRequired: true,
      type: "email",
    },
    {
      name: "first_name",
      label: "First Name",
      colSpan: "col-span-2",
      isRequired: true,
    },
    {
      name: "last_name",
      label: "Last Name",
      colSpan: "col-span-2",
      isRequired: true,
    },
    {
      name: "address_1",
      label: "Address",
      colSpan: "col-span-2",
      isRequired: true,
    },
    { name: "address_2", label: "Address 2", colSpan: "col-span-2" },
    { name: "company", label: "Company", colSpan: "col-span-2" },
    { name: "city", label: "City", colSpan: "col-span-2", isRequired: true },
    {
      name: "province",
      label: "State / Province",
      colSpan: "col-span-2 md:col-span-2",
      isRequired: true,
    },
    {
      name: "country_code",
      label: "Country",
      colSpan: "col-span-2 md:col-span-2",
      select: true,
      isRequired: true,
      disallowEmptySelection: true,
    },
    {
      name: "postal_code",
      label: "Zipcode",
      colSpan: "col-span-2",
      isRequired: true,
    },
    {
      name: "phone",
      label: "Phone",
      colSpan: "col-span-2",
      isRequired: true,
    },
  ];

  const formPaymentFields = [
    {
      name: "card-number",
      label: "Card Number",
      colSpan: "col-span-3",
      isRequired: true,
      type: "number",
      minLength: 16,
      maxLength: 16,
    },
    {
      name: "exp_month",
      label: "EXP Month",
      colSpan: "col-span-1",
      isRequired: true,
      type: "number",
      minLength: 2,
      maxLength: 2,
    },
    {
      name: "exp_year",
      label: "EXP Year",
      colSpan: "col-span-1",
      isRequired: true,
      type: "number",
      minLength: 2,
      maxLength: 2,
    },
    {
      name: "cvc",
      label: "CVC",
      colSpan: "col-span-1",
      isRequired: true,
      type: "number",
      minLength: 3,
      maxLength: 4,
    },
    {
      name: "name_on_card",
      label: "Name On Card",
      colSpan: "col-span-3",
      isRequired: true,
    },
  ];

  const createOrderOnFirestore = async (cart) => {
    if (cart.email != null) {
      try {
        const { payment, ...cartWithoutPayment } = cart;

        const response = await addDoc(collection(firestoreDatabase, "orders"), {
          ...cartWithoutPayment,
          createdAt: new Date(),
        });

        console.log("Order created with ID:", response.id);
        localStorage.setItem("lastOrderId", response.id);
        navigate("/success");

        setCart({
          items: [],
          total: 0,
          itemsTotal: 0,
          email: null,
          orderDetails: {
            shippingAddress: {
              first_name: null,
              last_name: null,
              address_1: null,
              address_2: null,
              city: null,
              province: null,
              country_code: "ar",
              postal_code: null,
              phone: null,
            },
            billingAddress: {
              first_name: null,
              last_name: null,
              address_1: null,
              address_2: null,
              city: null,
              province: null,
              country_code: null,
              postal_code: null,
              phone: null,
            },
            payment: {
              name_on_card: null,
              card_number: null,
              exp_month: null,
              exp_year: null,
              cvc: null,
              last4digits: null,
            },
          },
        });
        return response.id;
      } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
      }
    }
  };

  const areAddressesEqual = () => {
    const { shippingAddress, billingAddress } = cart?.orderDetails || {};
    for (const key in shippingAddress) {
      if (shippingAddress[key] !== billingAddress[key]) {
        setSameShippingBilling(false);
        console.log(false);
        return;
      }
    }
    setSameShippingBilling(true);
    console.log(sameShippingBilling);
  };

  useEffect(() => {
    if (!shippingCompleted) {
      setSelected("shipping-address");
      setCurrentTab("shipping-address");
    } else if (!billingCompleted) {
      setCurrentTab("billing-address");
      setSelected("billing-address");
    } else {
      setCurrentTab("card-payment");
      setSelected("card-payment");
    }
  }, [shippingCompleted, billingCompleted, paymentCompleted]);

  useEffect(() => {
    if (cart) {
      setFormData({
        email: cart?.email || null,
        shippingAddress: {
          first_name: cart?.orderDetails?.shippingAddress?.first_name || null,
          last_name: cart?.orderDetails?.shippingAddress?.last_name || null,
          address_1: cart?.orderDetails?.shippingAddress?.address_1 || null,
          address_2: cart?.orderDetails?.shippingAddress?.address_2 || null,
          city: cart?.orderDetails?.shippingAddress?.city || null,
          province: cart?.orderDetails?.shippingAddress?.province || null,
          country_code: "ar",
          postal_code: cart?.orderDetails?.shippingAddress?.postal_code || null,
          phone: cart?.orderDetails?.shippingAddress?.phone || null,
        },
        billingAddress: {
          first_name: cart?.orderDetails?.billingAddress?.first_name || null,
          last_name: cart?.orderDetails?.billingAddress?.last_name || null,
          address_1: cart?.orderDetails?.billingAddress?.address_1 || null,
          address_2: cart?.orderDetails?.billingAddress?.address_2 || null,
          city: cart?.orderDetails?.billingAddress?.city || null,
          province: cart?.orderDetails?.billingAddress?.province || null,
          country_code: "ar",
          postal_code: cart?.orderDetails?.billingAddress?.postal_code || null,
          phone: cart?.orderDetails?.billingAddress?.phone || null,
        },
        payment: {
          name_on_card: null,
          card_number: null,
          exp_month: null,
          exp_year: null,
          cvc: null,
          last4digits: null,
        },
      });
    }
    areAddressesEqual();
  }, [cart, cart.orderDetails]);

  useEffect(() => {
    const isEmailComplete = cart.email != null;

    const isShippingAddressComplete = formShippingFields.every((field) => {
      if (field.name === "email") {
        return true;
      }
      if (!field.isRequired) {
        return true;
      } else {
        return cart.orderDetails.shippingAddress[field.name] != null;
      }
    });

    const isBillingAddressComplete = formShippingFields.every((field) => {
      if (field.name === "email") {
        return true;
      }
      if (!field.isRequired) {
        return true;
      } else {
        return cart.orderDetails.billingAddress[field.name] != null;
      }
    });

    const isPaymentComplete = formPaymentFields.every((field) => {
      if (!field.isRequired) {
        return true;
      } else {
        return cart.orderDetails.payment[field.name] != null;
      }
    });

    setShippingCompleted(isEmailComplete && isShippingAddressComplete);
    setBillingCompleted(isBillingAddressComplete);
    setPaymentCompleted(isPaymentComplete);

    if (shippingCompleted && billingCompleted && paymentCompleted) {
      createOrderOnFirestore(cart);
    }
  }, [cart, formShippingFields]);

  console.log(selected);

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto pt-24 max-w-2xl px-4 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <Link to="/">Back to Cart</Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Checkout
        </h1>
        {cart && cart.itemsTotal > 0 ? (
          <>
            <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
              <section aria-labelledby="cart-heading" className="lg:col-span-7">
                <h2 id="cart-heading" className="sr-only">
                  Items in your shopping cart
                </h2>
                <div className="flex flex-col w-full">
                  <Card>
                    <CardBody className="">
                      <Tabs
                        fullWidth
                        size="md"
                        aria-label="Tabs form"
                        selectedKey={currentTab}
                        onSelectionChange={(key) => setCurrentTab(key)}
                        disabledKeys={[
                          !shippingCompleted && "billing-address",
                          !billingCompleted && "card-payment",
                        ]}
                        radius="xs"
                      >
                        <Tab
                          key="shipping-address"
                          radius="sm"
                          title={
                            <div className="flex items-center space-x-2">
                              {shippingCompleted ? (
                                <FaCheckCircle
                                  className="text-xl text-green-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <TbCircleNumber1 className="text-xl opacity-70" />
                              )}
                              <span>Shipping Address</span>
                            </div>
                          }
                        >
                          <form
                            onSubmit={handleSubmit}
                            className="grid max-w-5xl mx-auto gap-2 grid-cols-4 pt-4"
                          >
                            {formShippingFields.map((field) =>
                              !field.select ? (
                                <Input
                                  key={field.name}
                                  isRequired={field.isRequired}
                                  label={field.label}
                                  name={field.name}
                                  className={field.colSpan}
                                  variant={inputVariant}
                                  radius="sm"
                                  type={field.type || "text"}
                                  defaultValue={
                                    field.name === "email"
                                      ? cart.email || ""
                                      : cart.orderDetails.shippingAddress[
                                          field.name
                                        ] || ""
                                  }
                                  onChange={(e) =>
                                    handleChange("shippingAddress", e)
                                  }
                                />
                              ) : (
                                <Select
                                  key={field.name}
                                  label={field.label}
                                  defaultSelectedKeys={["ar"]}
                                  className={field.colSpan}
                                  variant={inputVariant}
                                  isRequired={field.isRequired}
                                  radius="sm"
                                  onChange={(e) =>
                                    handleChange("shippingAddress", e)
                                  }
                                  disallowEmptySelection={
                                    field.disallowEmptySelection
                                  }
                                >
                                  <SelectItem key="ar" value="ar">
                                    Argentina
                                  </SelectItem>
                                </Select>
                              )
                            )}
                            <div className="mt-2">
                              <Button type="submit" color="primary">
                                Continue to <MdArrowRightAlt /> Billing Address
                              </Button>
                            </div>
                          </form>
                        </Tab>
                        <Tab
                          key="billing-address"
                          radius="sm"
                          title={
                            <div className="flex items-center space-x-2">
                              {billingCompleted ? (
                                <FaCheckCircle
                                  className="text-xl text-green-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <TbCircleNumber2 className="text-xl opacity-70" />
                              )}
                              <span>Biling Address</span>
                            </div>
                          }
                        >
                          <Checkbox
                            className="mt-2"
                            isSelected={sameShippingBilling}
                            onClick={() => {
                              sameShippingBilling
                                ? setSameShippingBilling(false)
                                : setSameShippingBilling(true);
                            }}
                          >
                            Same as Shipping Address
                          </Checkbox>
                          <form
                            onSubmit={handleSubmit}
                            className="grid max-w-5xl mx-auto gap-2 grid-cols-4 pt-4"
                          >
                            {!sameShippingBilling &&
                              formShippingFields.map((field) =>
                                !field.select ? (
                                  field.name !== "email" && (
                                    <Input
                                      key={field.name}
                                      isRequired={field.isRequired}
                                      label={field.label}
                                      name={field.name}
                                      className={field.colSpan}
                                      variant={inputVariant}
                                      radius="sm"
                                      type={field.type || "text"}
                                      defaultValue={
                                        cart.orderDetails.billingAddress[
                                          field.name
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleChange("billingAddress", e)
                                      }
                                    />
                                  )
                                ) : (
                                  <Select
                                    key={field.name}
                                    label={field.label}
                                    defaultSelectedKeys={["ar"]}
                                    className={field.colSpan}
                                    variant={inputVariant}
                                    isRequired={field.isRequired}
                                    radius="sm"
                                    onChange={(e) =>
                                      handleChange("billingAddress", e)
                                    }
                                    disallowEmptySelection={
                                      field.disallowEmptySelection
                                    }
                                  >
                                    <SelectItem key="ar" value="ar">
                                      Argentina
                                    </SelectItem>
                                  </Select>
                                )
                              )}

                            <div className="mt-2">
                              <Button type="submit" color="primary">
                                Continue to <MdArrowRightAlt /> Card Payment
                              </Button>
                            </div>
                          </form>
                        </Tab>
                        <Tab
                          key="card-payment"
                          radius="sm"
                          title={
                            <div className="flex items-center space-x-2">
                              {paymentCompleted ? (
                                <FaCheckCircle
                                  className="text-xl text-green-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <TbCircleNumber3 className="text-xl opacity-70" />
                              )}
                              <span>Card Payment</span>
                            </div>
                          }
                        >
                          <form
                            className="grid max-w-5xl mx-auto gap-2 grid-cols-3 pt-4"
                            onSubmit={handleSubmit}
                          >
                            {formPaymentFields.map((field) => (
                              <Input
                                key={field.name}
                                isRequired={field.isRequired}
                                label={field.label}
                                name={field.name}
                                className={field.colSpan}
                                variant={inputVariant}
                                minLength={field.minLength}
                                maxLength={field.maxLength}
                                radius="sm"
                                type={field.type || "text"}
                                defaultValue={
                                  cart.orderDetails.billingAddress[
                                    field.name
                                  ] || ""
                                }
                                onChange={(e) => handleChange("payment", e)}
                              />
                            ))}
                            <div className="mt-6 w-full col-span-3">
                              <button
                                type="submit"
                                className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-background shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-50"
                              >
                                Pay
                              </button>
                            </div>
                          </form>
                        </Tab>
                      </Tabs>
                    </CardBody>
                  </Card>
                </div>
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

                  <ul role="list" className="divide-y divide-foreground/20">
                    {cart.items.map((product, productIdx) => (
                      <li key={productIdx} className={`flex py-2`}>
                        <div className="flex-shrink-0">
                          <img
                            src={`${product.product.img}`}
                            alt={`${product.product.name} image`}
                            className="h-12 aspect-square rounded-md object-cover object-center sm:h-12"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col justify-center sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex flex-col justify-between">
                                <h3 className="text-sm">
                                  x{product.quantity} {product.product.name}
                                </h3>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-right font-medium text-foreground/90">
                              ${product.quantity * product.product.price}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-foreground/70">Subtotal</dt>
                      <dd className="text-sm font-medium text-foreground/90">
                        ${formatNumberToUSStyle(cart.total)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-foreground/20 pt-4">
                      <dt className="flex items-center text-sm text-foreground/60">
                        <span>Shipping estimate</span>
                      </dt>
                      <dd className="text-sm font-medium text-foreground/90">
                        Free
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-foreground/20 pt-4">
                      <dt className="text-base font-medium text-foreground/80">
                        Order total
                      </dt>
                      <dd className="text-base font-medium text-foreground/80">
                        ${formatNumberToUSStyle(cart.total)}
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
            </div>
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

export default Checkout;

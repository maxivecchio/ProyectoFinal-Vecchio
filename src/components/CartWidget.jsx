import { IoCartOutline } from "react-icons/io5";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";

import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

const CartWidget = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">
          <IoCartOutline className="text-2xl" />
          {cart.itemsTotal}
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="bordered" aria-label="Dropdown menu">
        {cart.items.length !== 0 ? (
          <DropdownSection title="Cart Items">
            {cart.items.map((product, index) => (
              <DropdownItem
                textValue={product.product.name}
                key={index}
                description={"Click to view details"}
                onClick={() => {
                  navigate(`/product/${product.product.slug}`);
                }}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-x-2">
                    <img src={product.product.img} className="w-8" alt="" /> x
                    {product.quantity} {product.product.name}
                  </div>
                  <div>{"Price per Unit: $" + product.product.price}</div>
                </div>
              </DropdownItem>
            ))}
            <DropdownItem
              textValue={"View Cart Details"}
              className="bg-black text-white mt-2"
            >
              <Link to={"/cart"}>
                <div className="flex flex-col">View Cart Details</div>
              </Link>
            </DropdownItem>
          </DropdownSection>
        ) : (
          <DropdownSection title="No Items in Cart"></DropdownSection>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CartWidget;

import { IoCartOutline } from "react-icons/io5";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";

const CartWidget = () => {
  const products = [
   
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">
          <IoCartOutline className="text-2xl" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="light" aria-label="Dropdown menu with description">
        {products.length !== 0 ? (
          <DropdownSection title="Cart Items">
            {products.map((product) => (
              <DropdownItem
                key={product.name}
                description={"Price per Unit: $" + product.price}
              >
                {product.name}
              </DropdownItem>
            ))}
          </DropdownSection>
        ) : (
          <DropdownSection title="No Items in Cart"></DropdownSection>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CartWidget;

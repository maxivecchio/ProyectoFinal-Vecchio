import Logo from "./Logo";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

import { MdOutlineAccountCircle } from "react-icons/md";

import CartWidget from "./CartWidget";

const NavigationBar = () => {
  return (
    <Navbar shouldHideOnScroll maxWidth="xl">
      <NavbarBrand>
        <Logo width={100} />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <p className="font-semibold">HOME</p>
        </NavbarItem>
        <NavbarItem>
          <p>NEW IN</p>
        </NavbarItem>
        <NavbarItem>
          <p>SHOP</p>
        </NavbarItem>
        <NavbarItem>
          <p>STORES</p>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <MdOutlineAccountCircle className="text-2xl" />
        </NavbarItem>
        <NavbarItem>
          <CartWidget />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavigationBar;

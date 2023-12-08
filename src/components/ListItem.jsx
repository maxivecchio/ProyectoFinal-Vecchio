import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";
import { useCart } from "../context/CartContext";
import {formatNumberToUSStyle} from '../utils/utils'

const ListItem = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <>
      {/* <Link
        className="max-w-sm mx-auto animate__animated animate__fadeIn"
        to={`/product/${product.slug}`}
      >
        <img className="w-full" src={product.img} alt="" />
        <div className="flex justify-between">
          <span>{product.name}</span>
          <span>{product.price}</span>
        </div>
      </Link> */}
      <Link
        className="max-w-sm mx-auto animate__animated animate__fadeIn"
        to={`/product/${product.slug}`}
      >
        <Card isFooterBlurred className="max-w-sm pt-0">
          <CardHeader className="absolute z-10 top-1 flex-col items-start bg-black/60 backdrop-blur -mt-[4px]">
            <h4 className="text-white font-medium text-2xl">{product.name}</h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card example background"
            className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
            src={product.img}
          />
          <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
            <div>
              <p className="text-black text-xl">${formatNumberToUSStyle(product.price)}</p>
            </div>
            <Button
              className="text-tiny bg-black/80 text-white"
              radius="full"
              size="sm"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product, 1);
              }}
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </>
  );
};

export default ListItem;

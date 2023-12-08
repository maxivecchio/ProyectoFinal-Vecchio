import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { Button, Progress } from "@nextui-org/react";
import Error404 from "../pages/Error404";
import { formatNumberToUSStyle } from "../utils/utils";
import { useCart } from "../context/CartContext";
import { CiCircleCheck } from "react-icons/ci";
import { FaRegCircleXmark } from "react-icons/fa6";

const ItemView = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const { getProductBySlug } = useProducts();
  const { addToCart } = useCart();

  useEffect(() => {
    getProductBySlug(slug).then((product) => {
      setProduct(product);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <Progress
        size="sm"
        isIndeterminate
        aria-label="Loading..."
        className="w-full"
      />
    );
  }

  if (!product) {
    return <Error404 />;
  }
  return (
    <div className="animate__animated animate__fadeIn">
      <div>
        <img src={product.imagenURL} alt={product.nombre} />
      </div>
      <div className="flex justify-center mx-auto">
        <div>
          <img src={product.img} alt="" />
        </div>
        <div className="mt-16 p-4">
          <Link to={"/"}>{`< Volver a la Home`}</Link>
          <h2 className="text-2xl mt-4">{product.name}</h2>
          <p className="text-xl">
            <span className="text-gray-500">$</span>
            {formatNumberToUSStyle(product.price)}
          </p>
          <p className="mt-4 flex space-x-2 text-sm text-foreground/70">
            {product.stock > 0 ? (
              product.stock <= 5 ? (
                <>
                  <CiCircleCheck
                    className="h-5 w-5 flex-shrink-0 text-yellow-500"
                    aria-hidden="true"
                  />
                  <span className="text-yellow-500">
                    Only {product.stock} left in stock
                  </span>
                </>
              ) : (
                <>
                  <CiCircleCheck
                    className="h-5 w-5 flex-shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  <span>In stock</span>
                </>
              )
            ) : (
              <>
                <FaRegCircleXmark
                  className="h-5 w-5 flex-shrink-0 text-red-300"
                  aria-hidden="true"
                />
                <span>Out Of Stock</span>
              </>
            )}
          </p>

          <Button
            onClick={() => {
              addToCart(product, 1);
            }}
            disabled={product.stock === 0}
            className={`mt-4 bg-gray-600 py-1 px-3 rounded-md text-white ${
              product.stock === 0 && "cursor-not-allowed opacity-50"
            }`}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemView;

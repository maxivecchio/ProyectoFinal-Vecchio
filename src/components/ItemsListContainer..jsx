import ListItem from "./ListItem";
import { useProducts } from "../context/ProductContext";
import { Progress } from "@nextui-org/react";

const ListItemContainer = () => {
  const { products, productsLoading } = useProducts();
  return (
    <>
      {productsLoading ? (
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="w-full"
        />
      ) : (
        <div className="grid gap-x-4 gap-y-12 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-12 px-4">
          {products.map((product, index) => (
            <ListItem key={index} product={product} />
          ))}
        </div>
      )}
    </>
  );
};

export default ListItemContainer;

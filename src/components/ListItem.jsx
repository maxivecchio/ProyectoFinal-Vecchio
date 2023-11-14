import { Link } from "react-router-dom";

const ListItem = ({ producto }) => {
  return (
    <Link to={`/producto/${producto.slug}`}>
      <div className="text-left max-w-sm">
        <img className="w-full" src={producto.img} alt="" />
        <div className="flex justify-between">
          <span>{producto.name}</span>
          <span>{producto.price}</span>
        </div>
      </div>
    </Link>
  );
};

export default ListItem;

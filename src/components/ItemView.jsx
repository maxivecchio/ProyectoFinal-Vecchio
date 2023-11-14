import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ItemView = ({ productos }) => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true)
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    setProducto(productos.find((p) => p.slug === slug));
    setLoading(false)
  }, [productos, slug]);


  if (loading) {
    return <div>Cargando</div>;
  }

  if (!producto) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div>
      <div>
        <img src={producto.imagenURL} alt={producto.nombre} />
      </div>

      <div className="flex justify-center mx-auto">
        <div>
          <img src={producto.img} alt="" />
        </div>
        <div className="mt-16 p-4">
            <Link to={'/'}>{`< Volver a la Home`}</Link>
          <h2 className="text-2xl mt-4">{producto.name}</h2>
          <p className="text-xl"><span className="text-gray-500">$</span>{producto.price}</p>
          <button className="mt-4 bg-gray-600 py-1 px-3 rounded-md text-white">Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
};

export default ItemView;

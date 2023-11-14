import ListItem from "./ListItem";

const ListItemContainer = ({ productos }) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {productos.map((producto, index) => (
        <ListItem key={index} producto={producto} />
      ))}
    </div>
  );
};

export default ListItemContainer;

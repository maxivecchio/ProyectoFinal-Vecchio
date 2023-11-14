import { useEffect, useState } from "react";
import ListItemContainer from "../components/ItemsListContainer.";


const Home = ({productos}) => {
  return (
    <div className="p-4">
      <ListItemContainer productos={productos} />
    </div>
  );
};

export default Home;

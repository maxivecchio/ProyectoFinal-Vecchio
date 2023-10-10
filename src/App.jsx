import NavigationBar from "./components/Navbar";
import ItemsListContainer from "./components/ItemsListContainer";

const App = () => {
  return (
    <>
      <NavigationBar />
      <main className="pt-8 text-center">
        <ItemsListContainer text={"Maximiliano Vecchio"}/>
      </main>
    </>
  );
};

export default App;

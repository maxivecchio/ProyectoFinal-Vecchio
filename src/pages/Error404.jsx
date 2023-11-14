import { Link } from "react-router-dom";
const ErrorPage = () => {
  return (
    <div className="max-w-sm mx-auto mt-16">
      <h2 className="text-2xl text-center">Página no encontrada</h2>
      <h2 className="text-xl text-center">Error 404</h2>
      <div className="flex justify-center">
        <Link to="/">
          <button className="mt-4 bg-gray-600 mx-auto py-1 px-3 rounded-md text-white">
            Volver a la Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;

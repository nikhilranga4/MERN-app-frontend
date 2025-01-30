import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 bg-white bg-opacity-80 rounded-xl shadow-xl max-w-lg">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-6">
          Welcome to MERN App!
        </h1>
        <p className="text-xl text-gray-700 mb-6">
         This is a simple MERN app that allows users to create, read, update and delete the Data.
        </p>
        <div className="flex justify-center gap-6">
          <Link to="/login">
            <button className="px-3 py-1.5 bg-black text-white font-semibold rounded-full hover:bg-blue-600 transition duration-300 transform hover:scale-105">
              Log In
            </button>
          </Link>
          <Link to="/register">
            <button className="px-3 py-1.5 bg-black text-white font-semibold rounded-full hover:bg-green-600 transition duration-300 transform hover:scale-105">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;

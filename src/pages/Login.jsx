import {
  useState,
  useContext
} from "react";

import API from "../api/axios";

import {
  AuthContext
} from "../context/AuthContext";

import {
  useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

const Login = () => {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] =
    useState(false);

  const { setUser } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    // VALIDATION
    if (!form.email || !form.password) {

      return toast.error(
        "All fields are required"
      );
    }

    try {

      setLoading(true);

      const res =
        await API.post(
          "/auth/login",
          form
        );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setUser(res.data.user);

      toast.success(
        "Login Successful"
      );
if(res.data.user.role === "admin")
{
  navigate("/admin")
}else{
      navigate("/");
}

    } catch (err) {

      toast.error(
        err.response?.data?.message
        || "Login Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded w-80"
      >

        <h1 className="text-2xl font-bold mb-4 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded outline-none focus:ring-2 focus:ring-black"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded outline-none focus:ring-2 focus:ring-black"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        <button
          disabled={loading}
          className="bg-black text-white w-full p-2 rounded hover:bg-gray-800 transition"
        >

          {loading
            ? "Loading..."
            : "Login"}

        </button>

      </form>

    </div>
  );
};

export default Login;
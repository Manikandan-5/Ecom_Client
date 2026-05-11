import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      toast.success("Registered Successfully");

      navigate("/login");

    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded w-80"
      >
        <h1 className="text-2xl font-bold mb-4">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
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
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        <button className="bg-black text-white w-full p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
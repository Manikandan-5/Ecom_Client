import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import api from "../../api/axios";

const UserManagement = () => {
    const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // FETCH USERS
 const fetchUsers = async () => {
  try {
    setLoading(true);

    const { data } = await api.get("/users");

    setUsers(data || []);

  } catch (error) {
    console.log(error);

  } finally {
    setLoading(false);
  }
};

  // FILTER USERS
  const filteredUsers = users.filter(
    (user) =>
      user.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="h-12 w-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
  return (
    <>
      {/* SEARCH BAR */}
      <div className="relative w-full max-w-md mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Email
              </th>

              <th className="px-6 py-4 text-left">
                Role
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {user.name || "No Name"}
                </td>

                <td className="px-6 py-4">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  {user.role || "user"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserManagement;
const UserRow = ({ user, onDelete, onRole }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-4">
        {user.name}
      </td>

      <td className="px-6 py-4">
        {user.email}
      </td>

      <td className="px-6 py-4">
        {user.role}
      </td>

    </tr>
  );
};

export default UserRow;
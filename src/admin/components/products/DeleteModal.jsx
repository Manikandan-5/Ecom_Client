const DeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Confirm Delete
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this product?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
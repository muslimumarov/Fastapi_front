import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingData, setEditingData] = useState(null);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Ma'lumotlarni olishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formik = useFormik({
    initialValues: {
      amount: editingData?.amount || "",
      category: editingData?.category || "",
      description: editingData?.description || "",
      date: editingData?.date || "",
      is_income: editingData?.is_income || false,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      amount: Yup.number()
        .typeError("Raqam kiriting")
        .required("Amount majburiy"),
      category: Yup.string().required("Kategoriya majburiy"),
      description: Yup.string(),
      date: Yup.date().required("Sana majburiy"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingData) {
          await axios.put(`http://localhost:8000/transactions/${editingData.id}`, values);
        } else {
          await axios.post("http://localhost:8000/transactions", values);
        }
        fetchTransactions();
        resetForm();
        setEditingData(null);
      } catch (error) {
        console.error("Saqlashda xatolik:", error.response?.data || error.message);
      }
    },
  });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Delete xato:", error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingData(transaction);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">💸 Finance App</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          {...formik.getFieldProps("amount")}
          className="border p-2 w-full"
        />
        {formik.touched.amount && formik.errors.amount && (
          <div className="text-red-500 text-sm">{formik.errors.amount}</div>
        )}

        <input
          type="text"
          name="category"
          placeholder="Category"
          {...formik.getFieldProps("category")}
          className="border p-2 w-full"
        />
        {formik.touched.category && formik.errors.category && (
          <div className="text-red-500 text-sm">{formik.errors.category}</div>
        )}

        <textarea
          name="description"
          placeholder="Description"
          {...formik.getFieldProps("description")}
          className="border p-2 w-full"
        />

        <input
          type="date"
          name="date"
          {...formik.getFieldProps("date")}
          className="border p-2 w-full"
        />
        {formik.touched.date && formik.errors.date && (
          <div className="text-red-500 text-sm">{formik.errors.date}</div>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_income"
            checked={formik.values.is_income}
            onChange={formik.handleChange}
          />
          Income
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {editingData ? "Update" : "Submit"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-10 mb-4">📋 Transactions</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Income</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="border px-4 py-2">{t.amount}</td>
              <td className="border px-4 py-2">{t.category}</td>
              <td className="border px-4 py-2">{t.description}</td>
              <td className="border px-4 py-2">{t.is_income ? "Yes" : "No"}</td>
              <td className="border px-4 py-2">
                {new Date(t.date).toLocaleDateString("uz-UZ")}
              </td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="text-blue-500 underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-500 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

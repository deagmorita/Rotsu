import React, { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("category");
  const { logout } = useAuth();
  const [data, setData] = useState({
    category: [],
    menu: [],
    payment: [],
    reviews: [],
    riwayat: [],
    users: [],
  });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = useState({
    column: null,
    direction: "desc",
  });

  useEffect(() => {
    fetchData(activeTab);

    setSortConfig({
      column: null,
      direction: "desc",
    });
  }, [activeTab]);

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  const fetchData = async (table) => {
    console.log("Fetching:", table);
    let query = supabase.from(table).select("*");

    if (table === "users") {
      query = supabase
        .from("users")
        .select("id, email, name, created_at, role:role_id (role_name)")
        .order("created_at", { ascending: false });
    } else if (table === "reviews") {
      query = supabase
        .from("reviews")
        .select("*")
        .order("id", { ascending: false });
    } else if (table === "riwayat") {
      query = supabase
        .from("riwayat")
        .select("*")
        .order("waktu_pemesanan", { ascending: false });
    } else {
      query = supabase.from(table).select("*").order("id", { ascending: true });
    }

    const { data: result, error } = await query;

    if (error) {
      console.error("Fetch error:", table, error);
      setData((prev) => ({ ...prev, [table]: [] }));
    } else {
      setData((prev) => ({ ...prev, [table]: result }));
    }
  };

  const handleDelete = async (table, id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    else fetchData(table);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const table = editing.table;
    const newData = editing.data;
    let error;

    if (editing.isNew) {
      ({ error } = await supabase.from(table).insert([newData]));
    } else {
      ({ error } = await supabase
        .from(table)
        .update(newData)
        .eq("id", newData.id));
    }

    if (error) {
      console.error("Save error:", error);
      alert("Error saving data: " + error.message);
    } else {
      fetchData(table);
      setEditing(null);
    }
    setLoading(false);
  };

  const sortData = (table, column) => {
    let direction = "asc";

    if (sortConfig.column === column && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ column, direction });

    const sorted = [...data[table]].sort((a, b) => {
      if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
      if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setData((prev) => ({ ...prev, [table]: sorted }));
  };

  const handleAdd = (table) => {
    setEditing({ table, isNew: true, data: {} });
  };

  const handleEdit = (table, item) => {
    setEditing({ table, isNew: false, data: item });
  };

  const renderTable = (table) => {
    const columns = {
      category: ["id", "category_name"],
      menu: [
        "id",
        "menu_name",
        "price",
        "rating",
        "description",
        "image",
        "category_id",
      ],
      payment: ["id", "payment_method"],
      reviews: ["id", "user_name", "created_at", "rating", "comment"],
      riwayat: [
        "id",
        "user_id",
        "menu_id",
        "waktu_pemesanan",
        "status",
        "qty",
        "payment_id",
        "information",
        "address",
      ],
      users: ["id", "email", "name", "created_at", "role"],
    };

    const updateUserRole = async (userId, newRoleId) => {
      if (!confirm("Yakin ingin mengganti role user ini?")) return;

      const { error } = await supabase
        .from("users")
        .update({ role_id: newRoleId })
        .eq("id", userId);

      if (error) {
        alert("Gagal update role: " + error.message);
      } else {
        fetchData("users");
        alert("Role berhasil diperbarui!");
      }
    };

    return (
      <div className="p-6 bg-blue-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 capitalize">
            {table} Management
          </h2>
          <button
            onClick={() => handleAdd(table)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex items-center"
          >
            <span className="mr-2 text-lg">+</span> Add New
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                {columns[table].map((col) => (
                  <th
                    key={col}
                    onClick={() => sortData(table, col)}
                    className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-600/50 transition"
                  >
                    {col.replace("_", " ")}
                    {sortConfig.column === col && (
                      <span className="ml-2">
                        {sortConfig.direction === "asc" ? "⬆️" : "⬇️"}
                      </span>
                    )}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data[table].map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 transition duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {columns[table].map((col) => (
                    <td
                      key={col}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {col === "role" ? (
                        <select
                          value={item.role?.role_name || ""}
                          onChange={(e) => {
                            const selected = e.target.value;
                            const roleId = selected === "ADMIN" ? 2 : 1;
                            updateUserRole(item.id, roleId);
                          }}
                          className="border rounded px-2 py-1"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="CUSTOMER">CUSTOMER</option>
                        </select>
                      ) : (
                        item[col]
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(table, item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-200"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(table, item.id)}
                      className="text-red-600 hover:text-red-900 transition duration-200"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (!editing) return null;
    const fields = {
      category: ["category_name"],
      menu: [
        "menu_name",
        "price",
        "rating",
        "description",
        "image",
        "category_id",
      ],
      payment: ["payment_method"],
      reviews: ["user_name", "rating", "comment"],
      riwayat: [
        "user_id",
        "menu_id",
        "status",
        "qty",
        "payment_id",
        "information",
        "address",
      ],
      users: ["email", "name"],
    };

    const currentFields = fields[editing.table];
    const isMultiColumn = currentFields.length > 4;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-11/12 max-w-4xl transform scale-100 transition-transform duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            {editing.isNew ? "Add" : "Edit"} {editing.table}
          </h2>
          <form
            onSubmit={handleSave}
            className={`space-y-4 ${
              isMultiColumn ? "grid grid-cols-2 gap-4" : ""
            }`}
          >
            {currentFields.map((field) => (
              <div key={field} className={isMultiColumn ? "" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace("_", " ")}
                </label>
                {field === "description" ||
                field === "comment" ||
                field === "address" ? (
                  <textarea
                    value={editing.data[field] || ""}
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        data: { ...prev.data, [field]: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    rows="3"
                    required
                  />
                ) : field === "waktu_pemesanan" ? (
                  <input
                    type="datetime-local"
                    value={editing.data[field] || ""}
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        data: { ...prev.data, [field]: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                ) : field === "image" ? (
                  <input
                    type="url"
                    value={editing.data[field] || ""}
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        data: { ...prev.data, [field]: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Image URL"
                  />
                ) : (
                  <input
                    type={
                      field.includes("price") ||
                      field.includes("rating") ||
                      field.includes("qty")
                        ? "number"
                        : "text"
                    }
                    value={editing.data[field] || ""}
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        data: { ...prev.data, [field]: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                )}
              </div>
            ))}
            <div
              className={`flex justify-end mt-6 space-x-4 ${
                isMultiColumn ? "col-span-2" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 shadow-lg disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getIcon = (table) => {
    const icons = {
      category: "📂",
      menu: "🍽️",
      payment: "💳",
      reviews: "⭐",
      riwayat: "📜",
      users: "👥",
    };
    return icons[table] || "📂";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-gray-800 text-white p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Admin Panel
          </h1>
          <ul className="space-y-2">
            {Object.keys(data).map((table) => (
              <li
                key={table}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-300 hover:bg-gray-700 hover:shadow-md ${
                  activeTab === table ? "bg-blue-600 shadow-lg" : ""
                }`}
                onClick={() => setActiveTab(table)}
              >
                <span className="mr-3 text-lg">{getIcon(table)}</span>
                <span className="capitalize font-medium">{table}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="p-3 rounded-lg bg-gray-700 font-bold cursor-pointer transition duration-300 hover:bg-blue-800 hover:shadow-md"
        >
          Logout
        </button>
      </div>

      <div className="w-3/4 overflow-y-auto">
        {renderTable(activeTab)}
        {renderForm()}
      </div>
    </div>
  );
};

export default AdminPage;
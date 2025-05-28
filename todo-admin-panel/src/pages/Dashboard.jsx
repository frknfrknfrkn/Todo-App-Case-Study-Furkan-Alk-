import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ title: "", description: "", status: "", priority: "", category_id: "" });
  const [newCategory, setNewCategory] = useState({ name: "", color: "#4B5563" });
  const [editCategory, setEditCategory] = useState(null);

  const [adminInfo, setAdminInfo] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [meta, setMeta] = useState({ total_pages: 1, total: 0 });

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, [filters, page]);

  const fetchAdminInfo = async () => {
    try {
      const res = await axios.get("/admin/info");
      setAdminInfo(res.data);
    } catch (err) {
      console.error("Admin bilgisi alınamadı", err);
    }
  };

const fetchTodos = async () => {
  try {
    const params = { ...filters, page, limit };
    const res = await axios.get("/todos", { params });

    if (res.data?.data) {
      setTodos(res.data.data);
      setMeta({ total_pages: res.data.total_pages, total: res.data.total });
    } else {
      setTodos([]);
      setMeta({ total_pages: 1, total: 0 });
    }
  } catch (err) {
    console.error("Todo verisi alınamadı", err);
  }
};


  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Kategori verisi alınamadı", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Sayfa sıfırlansın
  };

  const handleTodoDelete = async (id) => {
    if (!window.confirm("Bu todo'yu silmek istiyor musun?")) return;
    try {
      await axios.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Todo silme hatası:", err);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    try {
      await axios.post("/categories", newCategory);
      setNewCategory({ name: "", color: "#4B5563" });
      fetchCategories();
    } catch (err) {
      alert("Kategori eklenemedi.");
      console.error(err.response?.data || err.message);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm("Bu kategoriyi silmek istiyor musun?")) return;
    try {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Kategori silme hatası:", err);
    }
  };

  const handleCategoryUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/categories/${editCategory.id}`, {
        name: editCategory.name,
        color: editCategory.color,
      });
      setEditCategory(null);
      fetchCategories();
    } catch (err) {
      console.error("Kategori güncellenemedi:", err);
      alert("Kategori güncellenemedi.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Todo Listesi</h1>
          {adminInfo ? (
            <div className="text-sm text-gray-600 mt-1">
              Giriş yapan admin: <strong>{adminInfo.email}</strong> | IP: <strong>{adminInfo.ip_address || 'Tanımsız'}</strong>
            </div>
          ) : (
            <div>Yükleniyor...</div>
          )}
        </div>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Çıkış
        </button>
      </div>

      {/* Yeni Todo */}
      <div className="mb-4">
        <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Yeni Todo Ekle
        </Link>
      </div>

      {/* Kategori Ekle */}
      <form onSubmit={handleCategorySubmit} className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          placeholder="Kategori adı"
          className="border px-3 py-2 rounded w-full sm:w-64"
          required
        />
        <input
          type="color"
          value={newCategory.color}
          onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
          className="w-10 h-10 p-0 border rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Ekle
        </button>
      </form>

      {/* Mevcut Kategoriler */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3 text-lg">Mevcut Kategoriler</h2>
        <div className="overflow-x-auto scroll-x-container">
          <div className="flex gap-3 pb-2">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white border rounded-xl p-3 shadow-sm flex flex-col justify-between items-center text-sm min-w-[160px] max-w-[180px] h-[130px]">
                {editCategory?.id === cat.id ? (
                  <form onSubmit={handleCategoryUpdate} className="flex flex-col gap-2 w-full">
                    <input
                      type="text"
                      value={editCategory.name}
                      onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                      className="border px-2 py-1 rounded text-sm"
                      placeholder="Kategori adı"
                    />
                    <input
                      type="color"
                      value={editCategory.color}
                      onChange={(e) => setEditCategory({ ...editCategory, color: e.target.value })}
                      className="w-full h-8 rounded"
                    />
                    <div className="flex gap-2 justify-end mt-1">
                      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Kaydet</button>
                      <button type="button" onClick={() => setEditCategory(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-xs">İptal</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <span className="inline-block px-2 py-1 rounded text-white text-xs text-center w-full truncate" style={{ backgroundColor: cat.color || "#4B5563" }}>
                      {cat.name}
                    </span>
                    <div className="flex gap-3 justify-center mt-3">
                      <button onClick={() => setEditCategory(cat)} className="text-yellow-600 text-xs hover:underline">Düzenle</button>
                      <button onClick={() => handleCategoryDelete(cat.id)} className="text-red-600 text-xs hover:underline">Sil</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtreleme */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <input type="text" name="title" value={filters.title} onChange={handleFilterChange} placeholder="Başlığa göre ara" className="border px-3 py-2 rounded" />
        <input type="text" name="description" value={filters.description} onChange={handleFilterChange} placeholder="Açıklamaya göre ara" className="border px-3 py-2 rounded" />
        <select name="status" value={filters.status} onChange={handleFilterChange} className="border px-3 py-2 rounded">
          <option value="">Tüm Durumlar</option>
          <option value="pending">Bekliyor</option>
          <option value="in_progress">Devam Ediyor</option>
          <option value="completed">Tamamlandı</option>
          <option value="cancelled">İptal</option>
        </select>
        <select name="priority" value={filters.priority} onChange={handleFilterChange} className="border px-3 py-2 rounded">
          <option value="">Tüm Öncelikler</option>
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>
        <select name="category_id" value={filters.category_id} onChange={handleFilterChange} className="border px-3 py-2 rounded">
          <option value="">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Todo Tablosu */}
      <div className="grid gap-4 sm:table w-full mt-4">
        <div className="hidden sm:table-header-group bg-gray-100 text-sm">
          <div className="table-row">
            <div className="table-cell p-2 text-left font-semibold">Başlık</div>
            <div className="table-cell p-2 text-left font-semibold">Açıklama</div>
            <div className="table-cell p-2 text-left font-semibold">Durum</div>
            <div className="table-cell p-2 text-left font-semibold">Kategoriler</div>
            <div className="table-cell p-2 text-left font-semibold">Öncelik</div>
            <div className="table-cell p-2 text-left font-semibold">Aksiyonlar</div>
          </div>
        </div>

        {Array.isArray(todos) && todos.map((todo) => (
          <div key={todo.id} className="bg-white border rounded-xl shadow-sm p-4 sm:table-row sm:p-0 sm:border-0 sm:shadow-none text-sm">
            <div className="sm:table-cell sm:p-2">{todo.title}</div>
            <div className="sm:table-cell sm:p-2 text-gray-600">{todo.description || <em>—</em>}</div>
            <div className="sm:table-cell sm:p-2 capitalize">{todo.status}</div>
            <div className="sm:table-cell sm:p-2">
              <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                {todo.categories?.map((cat) => (
                  <span key={cat.id} className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: cat.color || "#4B5563" }}>
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="sm:table-cell sm:p-2 capitalize">
              {todo.priority === "low" && "Düşük"}
              {todo.priority === "medium" && "Orta"}
              {todo.priority === "high" && "Yüksek"}
            </div>
            <div className="sm:table-cell sm:p-2">
              <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                <Link to={`/edit/${todo.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs">Düzenle</Link>
                <button onClick={() => handleTodoDelete(todo.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs">Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* sayfalama */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Önceki
        </button>
        <span>
          Sayfa <strong>{page}</strong> / {meta.total_pages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= meta.total_pages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
}

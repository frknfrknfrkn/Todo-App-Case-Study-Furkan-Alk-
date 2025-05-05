import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [categoryIds, setCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchTodo();
    fetchCategories();
  }, []);

  const fetchTodo = async () => {
    try {
      const res = await axios.get(`/todos/${id}`);
      const todo = res.data;

      setTitle(todo.title || "");
      setDescription(todo.description || "");
      setStatus(todo.status || "pending");
      setPriority(todo.priority || "medium");
      setCategoryIds(
        Array.isArray(todo.categories)
          ? todo.categories.map((cat) => cat.id)
          : []
      );
    } catch (err) {
      console.error("Todo verisi alınamadı", err.response?.data || err.message);
      alert("Todo verisi alınamadı");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Kategori verisi alınamadı", err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/todos/${id}`, {
        title,
        description,
        status,
        priority,
        category_ids: categoryIds,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Güncelleme başarısız", err.response?.data || err.message);
      alert("Güncelleme başarısız");
    }
  };

  const handleCategoryChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions).map((opt) =>
      parseInt(opt.value)
    );
    setCategoryIds(selectedIds);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
  onClick={() => navigate(-1)}
  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-base mb-6"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  Geri Dön
</button>
      <h1 className="text-2xl font-bold mb-4">Todo Düzenle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Başlık"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Açıklama"
          className="w-full border px-3 py-2 rounded"
        ></textarea>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="pending">Bekliyor</option>
          <option value="in_progress">Devam Ediyor</option>
          <option value="completed">Tamamlandı</option>
          <option value="cancelled">İptal</option>
        </select>

        {/* öncelik secim */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="low">Düşük Öncelik</option>
          <option value="medium">Orta Öncelik</option>
          <option value="high">Yüksek Öncelik</option>
        </select>

        <select
          multiple
          value={categoryIds.map(String)}
          onChange={handleCategoryChange}
          className="w-full border px-3 py-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
}
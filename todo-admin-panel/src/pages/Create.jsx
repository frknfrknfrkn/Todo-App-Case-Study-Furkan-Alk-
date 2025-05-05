import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [categoryIds, setCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      await axios.post("/todos", {
        title,
        description,
        status,
        priority,
        category_ids: categoryIds,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Todo eklenemedi:", err.response?.data || err.message);
      alert("Todo eklenemedi");
    }
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => parseInt(opt.value));
    setCategoryIds(selected);
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

      <h1 className="text-2xl font-bold mb-4">Yeni Todo Oluştur</h1>
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

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="low">Düşük Öncelik</option>
          <option value="medium">Orta Öncelik</option>
          <option value="high">Yüksek Öncelik</option>
        </select>

        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Kategoriler
  </label>
  <select
    multiple
    value={categoryIds.map(String)}
    onChange={handleCategoryChange}
    className="w-full h-40 border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
  >
    {categories.length > 0 ? (
      categories.map((cat) => (
        <option key={cat.id} value={cat.id} className="py-1">
          {cat.name}
        </option>
      ))
    ) : (
      <option disabled>Kategori bulunamadı</option>
    )}
  </select>
  <p className="text-xs text-gray-500 mt-1">
    Birden fazla kategori seçmek için Ctrl (Windows) veya ⌘ (Mac) tuşuna basılı tutun.
  </p>
</div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
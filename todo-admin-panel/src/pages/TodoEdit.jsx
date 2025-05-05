import { useForm } from "react-hook-form";
import { useEffect } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";

export default function EditTodo() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, loading: catLoading } = useCategories();

  useEffect(() => {
    axios.get(`/todos/${id}`).then(res => {
      const todo = res.data;
      setValue("title", todo.title);
      setValue("description", todo.description);
      setValue("status", todo.status);
      setValue("priority", todo.priority);
      setValue("due_date", todo.due_date?.slice(0, 16));
      setValue("category_ids", todo.categories?.map(cat => cat.id) || []);
    });
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      data.category_ids = data.category_ids?.map(id => parseInt(id));
      await axios.put(`/todos/${id}`, data);
      navigate("/dashboard");
    } catch (err) {
      alert("Güncelleme başarısız.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Todo Düzenle</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block text-sm">Başlık</label>
          <input
            {...register("title", { required: "Zorunlu alan" })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm">Açıklama</label>
          <textarea {...register("description")} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Durum</label>
          <select {...register("status")} className="w-full px-3 py-2 border rounded">
            <option value="pending">Bekliyor</option>
            <option value="in_progress">Devam ediyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal edildi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Öncelik</label>
          <select {...register("priority")} className="w-full px-3 py-2 border rounded">
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Bitiş Tarihi</label>
          <input type="datetime-local" {...register("due_date")} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Kategoriler</label>
          <select
            {...register("category_ids")}
            multiple
            className="w-full px-3 py-2 border rounded h-32"
          >
            {!catLoading && categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

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
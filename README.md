Todo yönetim paneli

admin panel ile todo yönetim sistemi. React + TailwindCSS frontend ile hazırlanmış olup, Pure PHP + MySQL API ile verileri işler.

------------------------------------------------------------------------------

Özellikler

- JWT, ip, rate-limit ile korunan api ve admin login sistemi
- Todo ekleme, güncelleme, silme
- Kategori yönetimi (renkli etiketler), ekleme, güncelleme, silme
- Gelişmiş Filtreleme: Başlık, Açıklama, Durum, Öncelik, Kategori
- Dinamik tablo görünümü
- Admin IP bilgisi gösterimi
- Mobil uyumlu, modern UI (TailwindCSS)

------------------------------------------------------------------------------

Teknolojiler

- Frontend: Vite, React.js, React Router, Axios, TailwindCSS
- Backend: Pure PHP (REST API), PDO
- Güvenlik: JWT Authentication, Middleware kontrolü, hcaptcha
- Veritabanı: todos, categories, todo_category, admins

------------------------------------------------------------------------------

**Giriş Bilgileri:**
username & email: admin
şifre: 123456


Api dokumantasyonu

postman ile testler

POST /api/login
Content-Type: application/json

body raw'dan gönderilen> 
{
  "email": "admin",
  "password": "123456"
}
sonuç>
{
  "token": "JWT_TOKEN_STRING"
}

admin  bilgi>
GET /api/admin/info

todo listeleme (Filtreli)>
GET /api/todos?title=test&description=örnek&status=pending&category_id=2

Todo Ekle>
POST /api/todos

Todo Güncelle>
PUT /api/todos/{id}

todo sil >
DELETE /api/todos/{id}

todo durum güncelle>
PATCH /api/todos/{id}/status

kategori listele>
GET /api/categories

kategori ekle>
POST /api/categories

kategori güncelle>
PUT /api/categories/{id}

kategori sil>
DELETE /api/categories/{id}

------------------------------------------------------------------------------

Kurulum

MySQL'de veritabanı oluştur
config/config.php içindeki bağlantı bilgilerini düzenle
Klasördeki todouygulamasıdb.sql'i veritabanı içine aktar.

backend>
cd (backend dosyası)
composer install  # eğer composer varsa

Frontend>
cd todo-admin-panel
npm install
npm run dev



**Note**: 
preflight için
// domain cors ayarı "http://localhost:5173" içindir.
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");


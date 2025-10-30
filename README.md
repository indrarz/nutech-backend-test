# Transaction System API
## Tech Stack
- **Express.js** (Framework)
- **MongoDB** (Database)
- **Vercel** (Deployment)

## Cara Menjalankan
### 1. Clone Repo
```
git clone https://github.com/indrarz/nutech-backend-test.git
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Rename file .env.example menjadi .env
### 4. Jalankan Server
```
npm run start
```
Server akan berjalan di `http://localhost:4000` atau sesuai konfigurasi `PORT` di file `.env`.

## Desain Database
MongoDB bersifat **NoSQL** yang artinya tidak menggunakan struktur tabel dan _DDL (Data Definition Language)_ seperti di database relasional.
Sebagai gantinya, digunakan schema model melalui **Mongoose** untuk mendefinisikan bentuk, tipe data, dan validasi dari setiap field.
### 1. `users`
| Field | Type | Description |
|--------|--------|-------------|
| `_id` | ObjectId | Primary key |
| `email` | String | Email (unik) |
| `first_name` | String | Nama depan |
| `last_name` | String | Nama belakang |
| `profile_image` | Buffer | Foto profil |
| `password` | String | Password |
| `createdAt` | Date | Tanggal dibuat |
| `updatedAt` | Date | Tanggal diperbarui |
### 2. `banners`
| Field | Type | Description |
|--------|--------|-------------|
| `_id` | ObjectId | Primary key |
| `banner_name` | String | Nama banner (unik) |
| `banner_image` | Buffer | Gambar banner |
| `description` | String | Deskripsi banner |
| `status` | Boolean | Aktif/Tidak Aktif |
| `createdAt` | Date | Tanggal dibuat |
| `updatedAt` | Date | Tanggal diperbarui |
### 3. `services`
| Field | Type | Description |
|--------|--------|-------------|
| `_id` | ObjectId | Primary key |
| `service_code` | String | Kode layanan (unik) |
| `service_name` | String | Nama layanan |
| `service_icon` | Buffer | Icon layanan |
| `service_tariff` | Number | Harga/biaya layanan |
| `createdAt` | Date | Tanggal dibuat |
| `updatedAt` | Date | Tanggal diperbarui |
### 4. `transactions`
| Field | Type | Description |
|--------|--------|-------------|
| `_id` | ObjectId | Primary key |
| `user` | ObjectId | _Reference_ ke `users._id` |
| `invoice_number` | String | Nomor invoice (unik) |
| `transaction_type` | String | Jenis transaksi (`TOPUP` / `PAYMENT`) |
| `description` | String | Deskripsi transaksi |
| `total_amount` | Number | Nominal transaksi |
| `createdAt` | Date | Tanggal dibuat |
| `updatedAt` | Date | Tanggal diperbarui |

Namun, jika sistem ingin dipindahkan ke **SQL Database** seperti MySQL atau PostgreSQL, bentuk DDL-nya akan seperti berikut:
```
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  profile_image LONGBLOB,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  banner_name VARCHAR(100) UNIQUE NOT NULL,
  banner_image LONGBLOB,
  description TEXT,
  status BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_code VARCHAR(50) UNIQUE NOT NULL,
  service_name VARCHAR(100) NOT NULL,
  service_icon LONGBLOB,
  service_tariff DECIMAL(12,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  transaction_type ENUM('TOPUP','PAYMENT') NOT NULL,
  description VARCHAR(255),
  total_amount DECIMAL(12,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

```
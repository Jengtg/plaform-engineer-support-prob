# Soal Tes Praktik — Platform Engineer Support (Entry Test)

Cara Menjalankan Aplikasi:
Prasyarat:

-Docker Desktop / Docker Engine dan Docker Compose.

-Python 3.9+ beserta library docker (untuk soal no 3).

---

## Soal 1 — Dashboard Status Container (Foundation)

**Skenario:**
Di server target sudah berjalan 4-6 container (campuran nama service, sebagian sengaja diberi label seperti `com.project.env=staging` atau `com.project.env=production`).

**Tugas:**
Modifikasi halaman frontend sederhana yang:

1. Mengambil data container dari Docker API (`GET /containers/json`)
2. Menampilkan: nama container, image + tag, status (running/exited/restarting), dan environment (dari label)
3. Mengelompokkan tampilan per environment
4. (Bonus) Perbaiki UI dengan look and feel yang nyaman untuk digunakan

---

## Soal 2 — Investigasi Container Bermasalah (Troubleshooting)

**Skenario:**
Salah satu container di environment sudah di-setup agar restart loop / exit dengan kode error tertentu

Pada soal kedua, disebut bahwa ada container yang error dengan restart loop, jadi saya mencari container yang statusnya restarting di docker. setelah ketemu untuk container yang bermasalah yaitu "pe-support-test-reporting-service-1", saya mengecek log dari container tersebut untuk mencari tahu masalahnya. Pada log tertulis bahwa letak masalah terjadi karena "REPORTING_DB_URL is not set" saya berasumsi bahwa berarti belum ada variabel ini pada container tersebut. setelah itu, saya memodifikasi file docker-compose.yml dan memasukkan variabel "REPORTING_DB_URL" dan mengisinya dengan data dummy yang ditemukan di file env. Setelah itu saya merun perintah docker compose down dan docker compose up lagi untuk men refresh container-container tersebut.
---

## Soal 3 — Cek Kesesuaian Versi Deployment (Tie-in ke Traceability Tool)

Pada soal no 3 kita diberikan json dengan service dan juga version/tag nya.
Disini saya mencari image yang sesuai dengan json yang diberikan. Setelah ketemu, saya menghubungkan script dengan sistem docker local dan mengambil id dari containernya. Lalu saya mengambil hasil output dari kode yang saya tulis, memparsenya dan membandingkannya dengan data yang berada di json, dengan menggunakan if-else. lalu setelah selesai, ternyata saya bertemu error dimana ketika saya merun docker compose down dan saya docker compose up lagi, data container yang sudah diambil berubah dan docker id yang saya hardcode jadi tidak bekerja. disitu saya mengganti kode pengambilan containernya agar menjadi lebih dinamis.


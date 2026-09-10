# Soal Tes Praktik — Platform Engineer Support (Entry Test)

**Cara Menjalankan Aplikasi:**
Prasyarat:

-Docker Desktop / Docker Engine dan Docker Compose.

-Python 3.9+ beserta library docker (untuk soal no 3).

**Langkah Terminal:**
1. Buka terminal pada direktori proyek ini. 
2. Jalankan perintah berikut untuk membangun ulang image dan menjalankan semua container di latar belakang:
   docker compose up -d --build
3. Jalankan juga perintah ini untuk menjalankan script python:
    python3 check.py

---

## Soal 1 — Dashboard Status Container (Foundation)

**Skenario:**
Di server target sudah berjalan 4-6 container (campuran nama service, sebagian sengaja diberi label seperti `com.project.env=staging` atau `com.project.env=production`).

Pada soal pertama, saya mengganti frontendnya untuk memperbaiki visualisasi data sekaligus membuat feel tampilannya lebih nyaman dilihat. Saat pertama kali dijalankan, saya mendapati bagian waktu Created pada card container menampilkan teks "n/a". Setelah saya periksa struktur data dari Docker API, ternyata nama variabel seharusnya adalah Created bukan CreatedAt. Lalu saya mengganti variabel tersebut dan mengkonversi format waktunya supaya jadi lebih gampang dibaca.

Lalu, saya melihat bagian status terlihat aneh karena memiliki panjang yang berbeda-beda contoh nya (seperti "Up 12 hours (healthy)"). Jadi, saya mengganti tampilannya dengan memisahkan status (seperti "RUNNING" atau "EXITED") untuk ditaruh di dalam bagian statusnya. Lalu, teks durasi saya pindahkan ke baris baru bernama "Uptime". Lalu, saya mengganti sedikit CSSnya agar posisi teks di dalam bagian status menjadi lebih rapih. Jadi saya hanya merubah bagian durasi, statusnya, dan juga format waktunya, karena menurut saya untuk desain awal dari frontendnya sudah bagus.

## Soal 2 — Investigasi Container Bermasalah (Troubleshooting)

**Skenario:**
Salah satu container di environment sudah di-setup agar restart loop / exit dengan kode error tertentu

Pada soal kedua, disebut bahwa ada container yang error dengan restart loop, jadi saya mencari container yang statusnya restarting di docker. setelah ketemu untuk container yang bermasalah yaitu "pe-support-test-reporting-service-1", saya mengecek log dari container tersebut untuk mencari tahu masalahnya. Pada log tertulis bahwa letak masalah terjadi karena "REPORTING_DB_URL is not set" saya berasumsi bahwa berarti belum ada variabel ini pada container tersebut. setelah itu, saya memodifikasi file docker-compose.yml dan memasukkan variabel "REPORTING_DB_URL" dan mengisinya dengan data dummy yang ditemukan di file env. Setelah itu saya merun perintah docker compose down dan docker compose up lagi untuk men refresh container-container tersebut.


## Soal 3 — Cek Kesesuaian Versi Deployment (Tie-in ke Traceability Tool)

**Skenario:**
 Diberikan sebuah "target version" untuk suatu service (misal dari file desired-state.json yang isinya {"service": "api-gateway", "expected_tag": "v2.3.1"}), sementara container yang aktual berjalan mungkin memakai tag lain.

Pada soal no 3 kita diberikan json dengan service dan juga version/tag nya.
Disini saya mencari image yang sesuai dengan json yang diberikan. Setelah ketemu, saya menghubungkan script dengan sistem docker local dan mengambil id dari containernya. Lalu saya mengambil hasil output dari kode yang saya tulis, memparsenya dan membandingkannya dengan data yang berada di json, dengan menggunakan if-else. lalu setelah selesai, ternyata saya bertemu error dimana ketika saya merun docker compose down dan saya docker compose up lagi, data container yang sudah diambil berubah dan docker id yang saya hardcode jadi tidak bekerja. disitu saya mengganti kode pengambilan containernya agar menjadi lebih dinamis.

Juga kalau script pengecekan versi ini ingin diimplementasikan pada skala yang lebih besar, script ini perlu dibuat lebih terotomatisasi. Daripada dieksekusi manual, script ini bagusnya diintegrasikan langsung ke dalam pipeline CI/CD dan juga dijalankan terus menerus menggunakan cron job atau scheduled job. 

Lalu, kalau script mendeteksi MISMATCH, kita bisa memakai webhook untuk langsung memberikan notifikasi ke aplikasi pembicaraan seperti contoh menggunakan bot aplikasi discord 


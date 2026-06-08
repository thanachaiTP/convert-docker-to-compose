# Docker Run to Compose Converter with Resource Limits

เว็บแอปพลิเคชันสำหรับแปลงคำสั่ง `docker run` เป็นไฟล์ `docker-compose.yml` ที่พร้อมใช้งานได้ทันที (คัดลอกง่ายในคลิกเดียว) มาพร้อมกับฟีเจอร์ขั้นสูงในการปรับแต่ง **Log Limits** และ **Resource Management (Limits & Reservations)** ทั้ง CPU และ RAM ผ่านหน้าต่าง UI ที่สวยงามและใช้งานง่าย

---

## 🚀 คุณสมบัติเด่น (Features)

* **Instant Conversion:** แปลงคำสั่ง `docker run` เป็นโครงสร้าง YAML ของ Docker Compose แบบ Real-time
* **Log Management:** สามารถจำกัดขนาดสูงสุดของไฟล์ Log (`max-size`) และจำนวนไฟล์สูงสุด (`max-file`) เพื่อป้องกันปัญหาดิสก์เต็ม โดยเลือกหน่วยเป็น **MB** หรือ **GB** ได้
* **Resource Limits:** กำหนดเพดานการใช้งานทรัพยากรสูงสุด (Limits) สำหรับ CPU และ Memory
* **Resource Reservations:** กำหนดการจองทรัพยากรขั้นต่ำ (Reservations) เพื่อการันตีประสิทธิภาพของคอนเทนเนอร์
* **Modern UI:** หน้าตาเว็บสไตล์ Dark Mode สวยงาม พัฒนาด้วย Tailwind CSS และใช้งานง่ายด้วยระบบคลิกเพื่อคัดลอก (One-click Copy)

---

## 🛠️ โครงสร้างโปรเจกต์ (Project Structure)

```text
docker-composerize-web/
├── index.html          # หน้าต่างอินเตอร์เฟส (UI)
├── app.js              # ตัวประมวลผลและการคำนวณฝั่ง Client-side
├── Dockerfile          # บลูพริ้นต์สำหรับสร้าง Docker Image (Nginx Alpine)
└── docker-compose.yml  # ไฟล์สำหรับสั่งรันและ Deploy แอปพลิเคชันนี้เอง
```

## 📦 วิธีการติดตั้งและใช้งาน (Deployment)
```bash
docker compose up -d --build
```
เมื่อระบบสตาร์ทเสร็จสิ้น สามารถเข้าใช้งานผ่านบราวเซอร์ได้ที่:

`👉 http://localhost:8080`


FROM nginx:alpine

# คัดลอกโค้ดหน้าเว็บทั้งหมดไปไว้ที่โฟลเดอร์สำหรับทำเว็บของ Nginx
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

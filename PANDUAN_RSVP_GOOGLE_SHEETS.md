# Panduan Menghubungkan RSVP ke Google Sheets

## Langkah 1: Buat Google Sheet Baru
1. Buka **Google Drive** (drive.google.com)
2. Klik **+ Buat** → **Google Sheet**
3. Beri nama: `Wedding RSVP - Gina & Ethon`
4. Buka sheet tersebut

## Langkah 2: Siapkan Struktur Sheet
Di baris pertama, buat header dengan kolom berikut:
```
A1: Timestamp
B1: Nama
C1: Konfirmasi
D1: Pesan
```

## Langkah 3: Buat Google Apps Script
1. Di Google Sheet, klik **Extensions** → **Apps Script**
2. Hapus kode default dan ganti dengan kode berikut:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp,
      data.nama,
      data.konfirmasi,
      data.pesan
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    Logger.log(error);
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Klik **Save** dan beri nama: `RSVP Handler`

## Langkah 4: Deploy sebagai Web App
1. Klik tombol **Deploy** (pojok kanan atas)
2. Pilih **New Deployment**
3. Di Type, pilih **Web app**
4. Di "Execute as" → pilih akun Google Anda
5. Di "Who has access" → pilih **Anyone**
6. Klik **Deploy**
7. Akan muncul dialog, copy link yang muncul (format: `https://script.google.com/macros/d/{SCRIPT_ID}/userweb?v=1`)

## Langkah 5: Update HTML
1. Buka file `script.js`
2. Cari baris:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb?v=1';
   ```
3. Ganti `YOUR_SCRIPT_ID` dengan SCRIPT_ID dari langkah sebelumnya
   
   **Contoh:**
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t/userweb?v=1';
   ```

## Langkah 6: Test
1. Buka website pernikahan Anda
2. Scroll ke bagian **RSVP**
3. Isi form dengan:
   - **Nama Lengkap**: nama tamu
   - **Konfirmasi Kehadiran**: pilih "Saya Akan Hadir" atau "Saya Tidak Bisa Hadir"
   - **Pesan**: (opsional) tulis doa atau harapan
4. Klik **Kirim Konfirmasi**
5. Cek Google Sheet → data seharusnya muncul otomatis di baris berikutnya

## Tips & Troubleshooting

### Jika form tidak bekerja:
- **Pastikan URL Google Apps Script benar** (copy-paste ulang tanpa spasi)
- **Cek console browser**: Klik F12 → Console → lihat error message
- **Pastikan deployment aktif**: Apps Script harus di-deploy sebagai Web App dengan akses "Anyone"
- **Cek izin Sheet**: Sheet harus dapat diakses oleh akun yang mengjalankan Apps Script

### Jika data tidak tersimpan:
- **Verifikasi struktur kolom**: Pastikan header di Sheet sesuai (Timestamp, Nama, Konfirmasi, Pesan)
- **Cek response error**: Buka F12 → Network → cek response dari POST request
- **Coba deploy ulang**: Delete deployment lama dan buat yang baru

### Untuk modifikasi lebih lanjut:
- **Tambah kolom baru**: Edit header di Sheet, lalu update `appendRow` di Apps Script dengan urutan yang sama
- **Ganti nama field**: Sesuaikan dengan attribute `name` di form HTML dan kode Apps Script
- **Notifikasi email**: Tambahkan `GmailApp.sendEmail()` di Apps Script setelah `appendRow`

## Keamanan
⚠️ **Penting**: 
- URL Apps Script ini PUBLIC, tapi hanya bisa diakses via POST dari website Anda
- Data RSVP akan tersimpan di Google Drive Anda (pastikan ter-backup)
- Jangan share URL script ke orang lain yang tidak perlu
- Pastikan hanya Anda atau pengantin yang tahu link website ini

---
**Selamat! RSVP Anda sekarang terhubung ke Google Sheets! 🎉**


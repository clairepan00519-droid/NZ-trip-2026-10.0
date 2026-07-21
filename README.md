# NZ Trip 家人共用同步 v12

## 重要：先設定 Supabase
1. 登入目前網站使用的 Supabase 專案。
2. 開啟 SQL Editor。
3. 貼上並執行 `SUPABASE_SETUP.sql` 全部內容。
4. 再把此資料夾所有檔案覆蓋到 GitHub 儲存庫。

## 這版修正
- 圖片上傳到 Supabase Storage `trip-media`。
- `localStorage` 只存圖片網址，不再存 Base64，因此不會再出現 `nz_photos exceeded the quota`。
- 景點照片、每日路線圖、購物照片、規範附圖、票券截圖都可跨裝置同步。
- 舊版仍留在瀏覽器內的 Base64 圖片，首次連線時會嘗試自動搬到 Storage。
- 文字、景點、行李、購物及筆記透過 `nz_sync` 共用。

## 注意
請先不要清除原本手機的網站資料。若舊圖片仍在該手機瀏覽器中，新版首次開啟時才有機會自動搬到雲端。

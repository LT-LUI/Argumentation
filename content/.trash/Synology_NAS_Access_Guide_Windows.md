# 🪟 Synology NAS Access Guide (Windows Setup)

This note explains how to connect to the **Synology NAS shared folder** from a **Windows PC** on the **same university network** (e.g., `172.16.10.x`).

---

## 1. Requirements

- Your PC must be connected to the same LAN (wired or Wi-Fi).  
- You’ll need:
  - NAS **IP address** → e.g. `172.16.10.128`
  - Your **NAS username** and **password** (provided by admin)
  - The **shared folder name** (e.g. `Research`)

---

## 2. Verify NAS Connectivity

1. Press **Windows + R**, type:
   ```
   cmd
   ```
   and hit **Enter**.
2. In the command prompt, check if the NAS is reachable:
   ```
   ping 172.16.10.128
   ```
   ✅ If you get replies, you’re good to proceed.

---

## 3. Connect to the NAS Temporarily (File Explorer)

1. Press **Windows + R**, type:
   ```
   \\172.16.10.128
   ```
   then press **Enter**.
2. Enter your NAS credentials when prompted:
   - **Username:** your NAS account  
   - **Password:** your NAS password  
3. You should now see all shared folders (e.g., `Research`, `Projects`, etc.).  
   You can drag and drop files just like on a normal drive.

---

## 4. Map a Network Drive (Permanent Mount)

1. Open **File Explorer**.  
2. In the left sidebar, right-click **This PC** → select **Map network drive...**  
3. Choose a drive letter (e.g. `Z:`).  
4. In the **Folder** field, enter:
   ```
   \\172.16.10.128\Research
   ```
5. Check **Reconnect at sign-in** (so it mounts automatically).  
6. Click **Finish**.  
7. Enter your NAS username and password again, and check **Remember my credentials**.

✅ You’ll now see the NAS shared folder as drive **Z:** in File Explorer.

---

## 5. Alternative: Using IP and Folder Path in Command Line

You can also map the drive from the Command Prompt or PowerShell:

```powershell
net use Z: \\172.16.10.128\Research /user:<your_nas_username> <your_nas_password> /persistent:yes
```

- `/persistent:yes` ensures it auto-reconnects on login.
- Replace `<your_nas_username>` and `<your_nas_password>` with your credentials.

---

## 6. To Disconnect the Drive

```powershell
net use Z: /delete
```

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
|----------|--------|------|
| **Login prompt keeps reappearing** | Wrong credentials | Use NAS username, not Windows account |
| **Drive doesn’t reconnect after reboot** | Missing “Reconnect at sign-in” | Re-map drive with that option checked |
| **“Network path not found”** | NAS unreachable | Check IP, firewall, and that SMB is enabled on NAS |
| **Slow access** | SMB version mismatch | Make sure SMB2/3 is enabled on NAS |
| **Access denied** | Insufficient permissions | Ask admin to grant Read/Write access on NAS |

---

## ✅ Final Result

- NAS appears as a local drive (e.g. **Z:**).  
- Files are synced instantly with the NAS shared folder.  
- Mount persists after reboot.  
- No additional software required — everything uses built-in Windows SMB support.

---

*Maintained by:*  
**[Your Name / Team]**  
_Last updated: 2025-10-09_

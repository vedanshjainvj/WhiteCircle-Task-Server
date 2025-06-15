// -------------------- PACKAGE IMPORT FILES -------------------- //
import cron from 'node-cron';

// --------------- Importing Other Files --------------- //
import adminService from './admin.service.js';

cron.schedule('* * * * *', async () => {
    console.log(`[CRON LOG] 🔁 Reminder job started at: ${new Date().toLocaleString()}`);
    const sentMailToAllUsers = await adminService.sendMailManual();
    console.log(`[CRON LOG] 📧 ${sentMailToAllUsers.message}`);
});

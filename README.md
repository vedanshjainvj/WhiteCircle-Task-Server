# 🧠 WhiteCircle Backend

This is the backend server for the **WhiteCircle Document Management Platform**, a secure system where users can upload, manage, and track document submissions with automatic deadline-based reminders.

---

## 📌 Objective

To build a robust, scalable, and secure backend API that enables:

- Secure client and admin authentication
- Document upload with metadata
- Email notifications/reminders before expiry
- Admin dashboard for data management
- Cloud storage support (AWS S3)
- Scheduled tasks via cron jobs

---

## 🛠 Tech Stack

| Layer           | Tech                          |
|----------------|-------------------------------|
| Runtime         | Node.js                        |
| Framework       | Express.js                     |
| Database        | MongoDB with Mongoose          |
| Auth            | JWT + bcryptjs                 |
| Email Service   | Nodemailer                     |
| Cron Jobs       | node-cron                      |
| File Uploads    | Multer + AWS S3                |
| Deployment      | Vercel-ready                   |
| Env Management  | dotenv                         |

---

## 🛠 Backend Project Structure

```
server/
├── src/
│   ├── config/                        # Environment config or DB config
│   │
│   ├── controllers/                   # Request controllers
│   │   ├── admin.controller.js
│   │   ├── resource.controller.js
│   │   └── user.controller.js
│   │
│   ├── database/                      # DB connection setup
│   │   └── database.js
│   │
│   ├── middlewares/                  # JWT or custom middlewares
│   │   └── userToken.js
│   │
│   ├── models/                        # Mongoose models
│   │   ├── notifications.model.js
│   │   ├── otp.model.js
│   │   ├── resource.model.js
│   │   └── user.model.js
│   │
│   ├── repository/                   # Abstraction layer for DB operations
│   │   ├── admin.repository.js
│   │   ├── otp.repository.js
│   │   ├── resource.repository.js
│   │   └── user.repository.js
│   │
│   ├── routes/                        # Centralized route management
│   │   └── main.route.js
│   │
│   ├── services/                      # Business logic
│   │   ├── admin.service.js
│   │   ├── cron.service.js
│   │   ├── otp.service.js
│   │   ├── resource.service.js
│   │   └── user.service.js
│   │
│   ├── utilities/                     # Helpers & utilities
│   │   ├── apiError.js
│   │   ├── apiErrorHandler.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── awsS3.js
│   │   ├── logout.js
│   │   ├── otpEmail.js
│   │   ├── paginationUtility.js
│   │   ├── remainderMail.js
│   │   ├── responseHandler.js
│   │   ├── sendMail.js
│   │   └── statusCodeUtility.js
│
│   ├── app.js                         # Main Express app config
│   └── constants.js                   # App-wide constants
├── .env                               # Environment variables
└── index.js                           # Entry point
```

---

## ✅ Features

### 🔐 Authentication
- JWT-based login for Admin and Clients
- Passwords hashed using bcrypt

### 📁 Document Management
- Upload files (PDF, Word, Images)
- Add metadata: title, type, expiry
- Edit/Delete document
- Admin can view all uploads

### 📬 Notifications
- Email reminders before deadline
- Manual or scheduled using cron jobs

### 🧑 Admin Panel
- See all users & uploads
- Filter by name, document type, expiry

---

## 📦 API Endpoints (Highlights)

| Method | Route                        | Description                         |
|--------|------------------------------|-------------------------------------|
| POST   | `/api/register`              | Register a new user                 |
| POST   | `/api/login`                 | Login and receive JWT               |
| POST   | `/api/upload`                | Upload a document                   |
| GET    | `/api/documents`             | Get uploaded documents              |
| POST   | `/api/send-reminder`         | Send a manual reminder              |
| GET    | `/api/admin/users`           | Get all registered users            |

---

## 🔒 Environment Variables (`.env`)

```env
export const envProvider = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    NODE_ENV: process.env.NODE_ENV
}
```

# 1. Clone the repo
git clone https://github.com/NitinChakrawarti/whitecircle.git

# 2. Navigate to backend folder
cd whitecircle/server

# 3. Install dependencies
npm install

# 4. Add .env file
# (Refer to the above example)

# 5. Start in dev mode
npm run dev

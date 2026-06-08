# ☁️ CloudVault

A full-stack cloud file manager where users can securely upload, store, preview, share, and manage their files. Files are stored on **AWS S3** with metadata in **MongoDB**, secured with JWT authentication.

![CloudVault Dashboard](./screenshots/dashboard.png)

---

## ✨ Features

- 🔐 **Secure authentication** — Signup & login with JWT + bcrypt password hashing
- ⬆️ **File upload** — Drag & drop or click to upload, stored on AWS S3
- ⬇️ **Download** — Download any file with one click
- 👁️ **In-app preview** — View PDFs and images without downloading
- 🔗 **Share links** — Copy a shareable link for any file
- 🔍 **Search & sort** — Find files by name, sort by name, size, or date
- 🗑️ **Delete** — Remove files from both S3 and the database
- 📊 **Storage tracking** — See total files and space used

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- lucide-react (icons)
- Axios

**Backend**
- Node.js + Express
- JWT authentication
- bcrypt
- Multer (file handling)

**Database & Cloud**
- MongoDB Atlas
- AWS S3 (Mumbai region)
- AWS IAM

---

## 📸 Screenshots

| Login | Dashboard |
|-------|-----------|
| ![Login](./screenshots/login.png) | ![Dashboard](./screenshots/dashboard.png) |

> _Add your screenshots in a `/screenshots` folder._

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   Express    │─────▶│   AWS S3    │
│  Frontend   │◀─────│   Backend    │◀─────│  (files)    │
└─────────────┘      └──────┬───────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  MongoDB    │
                     │ (metadata)  │
                     └─────────────┘
```

The React frontend talks to the Express API. Files go to AWS S3, while file metadata (name, size, type, URL, owner) is stored in MongoDB. JWT secures every request.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- AWS account with an S3 bucket

### 1. Clone the repo
```bash
git clone https://github.com/kunalshinde3996-sv/cloudvault-.git
cd cloudvault-
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_bucket_name
```

Start the backend:
```bash
node server.js
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/files` | Get all files of logged-in user |
| POST | `/api/files/upload` | Upload a file to S3 |
| DELETE | `/api/files/:id` | Delete a file |

---

## 👤 Author

**Kunal Shinde**
- GitHub: [@kunalshinde3996-sv](https://github.com/kunalshinde3996-sv)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

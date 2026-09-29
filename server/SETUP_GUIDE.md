# BLACKFITS BACKEND SETUP GUIDE
### MongoDB Atlas & Cloudinary CDN Configuration

This guide explains step-by-step how to set up your free MongoDB database and Cloudinary account.

---

## 1. MongoDB Atlas Setup (Free Cloud Database)

1. Go to **[mongodb.com](https://www.mongodb.com/)** and click **"Try Free"**.
2. Sign up and create a new project called **`BlackFits`**.
3. Under **Deploy a database**, select the **M0 FREE Cluster** (Free forever, 512 MB).
4. Choose any AWS region closest to your customers (e.g., **AWS / Mumbai (`ap-south-1`)** or Singapore).
5. Click **Create Deployment**.

### Create Database User:
1. In the **Security Quickstart** screen:
   - **Username**: e.g., `blackfits_admin`
   - **Password**: Click **Autogenerate Secure Password** or set one (e.g. `BlackFitsPass2026!`).
   - ⚠️ **Save this password** — you will need it for the connection string!
2. Click **Create Database User**.

### Network Access (IP Whitelist):
1. In the same screen under **Where would you like to connect from?**:
   - Choose **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Click **Add IP Address**.

### Get Your Connection String:
1. Click **Choose a connection method** → **Drivers** (Node.js).
2. Copy the connection string. It looks like:
   ```
   mongodb+srv://blackfits_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
3. Replace `<password>` with your actual database user password.
4. Replace `/?` with `/blackfits?` to name your database `blackfits`.
5. Paste this into `server/.env` as `MONGO_URI`.

---

## 2. Cloudinary Setup (Free Image CDN)

1. Go to **[cloudinary.com](https://cloudinary.com/)** and sign up for a **Free Account** (25 GB monthly bandwidth).
2. Go to your **Cloudinary Dashboard**.
3. Under **Product Environment Credentials**, you will see:
   - **Cloud Name** (e.g., `dxyza123`)
   - **API Key** (e.g., `8349284928492`)
   - **API Secret** (Click "View" to reveal)
4. Copy these 3 values into `server/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 3. Running the Backend Server

Open a new terminal in the `server` folder:

```powershell
# 1. Enter server directory
cd "d:\BlackFits.com\clothing Website\server"

# 2. Install dependencies
npm install

# 3. Copy .env.example to .env and insert your MongoDB & Cloudinary keys
cp .env.example .env

# 4. (Optional) Seed initial products & lookbook into MongoDB Atlas
npm run seed

# 5. Start the backend API server
npm run dev
```

Your API server will run at:
`http://localhost:5000`

Test it in your browser:
- Health check: `http://localhost:5000/api/health`
- Products catalog: `http://localhost:5000/api/products`
- Community Lookbook: `http://localhost:5000/api/lookbook`

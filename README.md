# GigFlow - Freelance Marketplace

GigFlow is a modern MERN stack freelance marketplace where Clients post jobs and Freelancers bid for them. It features secure authentication, real-time updates, and atomic hiring transactions.

## 🚀 Tech Stack
**Frontend:** React.js (Vite), Tailwind CSS, Lucide React  
**Backend:** Node.js, Express.js, Socket.io  
**Database:** MongoDB (Atlas), Mongoose

## ✨ Key Features

### 🔐 Authentication & Roles
*   **Secure Auth:** JWT with HttpOnly cookies.
*   **Dual Roles:** Users can seamlessly switch between Client and Freelancer roles.

### 💼 Gig & Bid Management
*   **Smart Search:** Filter gigs by Budget, Status, and Recency.
*   **Interactive Dashboard:** Track Bids, Hired Gigs, and Completed Jobs.
*   **Job Completion:** Mark jobs as "Completed" to update stats.

### ⚡ Advanced & Bonus Features
*   **🛡️ Transactional Hiring:** Uses **MongoDB Transactions** to prevent race conditions (e.g., double hiring).
*   **🔔 Real-time Notifications:** Instant **Socket.io** alerts when a freelancer is hired.
*   **📥 Persistent Alerts:** Notifications are saved to the database for offline users.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas URI

### 1. Clone Repository
```bash
git clone <repository-url>
cd Internshala_project
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in `/server`:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start Server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
Visit `http://localhost:5173` to run the app.

## 💡 Usage Flow
1.  **Register:** Create an account (acts as both Client & Freelancer).
2.  **Post a Job:** Go to "Post Gig" to create a new listing.
3.  **Browse & Bid:** Switch users (or use Incognito) to browse and submit a proposal.
4.  **Hire:** As the Client, view the proposal and click "Hire".
5.  **Track:** The Freelancer gets a real-time alert and tracks progress in the Dashboard.
6.  **Complete:** Mark the job as done to update stats.

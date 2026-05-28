# 🎮 PowerPlay Arena: Cyberpunk OS Scheduling Simulator

PowerPlay Arena is a fully responsive, full-stack web application that translates core Operating System CPU Scheduling Algorithms into a futuristic, gamified amusement arena simulator. 

By mapping abstract OS concepts to real-world gaming and entertainment arena activities, this project serves as a highly visual, interactive learning tool designed for computer science presentations and coursework.

---

## 🌌 Thematic Mapping: OS to Arena

We map standard operating system scheduling terminology directly to the operations of an amusement arena:

| OS Concept | PowerPlay Arena Metaphor | Description |
| :--- | :--- | :--- |
| **Processes** | 🎟️ **Visitors** | Individual clients seeking entry or session time. |
| **CPU / Core** | 🕹️ **Activity Zone** | Gaming PCs, VR bays, Bowling lanes, or Trampolines. |
| **Ready Queue** | 👥 **Waiting Lines** | Orderly queues of visitors waiting for their zone session. |
| **Execution** | ⏱️ **Active Session** | The visitor utilizing the activity resource. |
| **Burst Time** | ⏳ **Session Duration** | The time required for a visitor to finish their game/ride. |
| **Priority** | 👑 **Ticket Tier** | Regular, VIP, or VVIP priority level credentials. |
| **Terminated** | 🏁 **Activity Complete** | Visitors who have finished all scheduled sessions. |

---

## ⚡ The Scheduling Algorithms

The application implements four major CPU scheduling algorithms in pure JavaScript, working seamlessly on both the frontend simulation canvas and persisted via database collections on the backend:

1. **First-Come-First-Served (FCFS)**
   - Non-preemptive allocation based entirely on arrival time.
   - Mimics simple walk-in waiting line queues.
2. **Shortest Job First (SJF)**
   - Supports both **Preemptive (SRTF)** and **Non-Preemptive** execution modes.
   - Evaluates remaining burst (session) durations to minimize total waiting times.
3. **Priority Scheduling**
   - Supports both **Preemptive** and **Non-Preemptive** execution modes.
   - Custom toggles support both ascending priority logic (1 = Highest) and descending logic.
4. **Round Robin (RR)**
   - Preemptive time-sliced resource allocation using a custom **Time Quantum** duration slider.
   - Perfect for rotation pools, ensuring fair play across activities.

### Calculated Process Metrics
For every simulation run, the engine automatically calculates standard scheduling equations:
* **Completion Time ($C_T$)**
* **Turnaround Time ($T_{AT} = C_T - A_T$)**
* **Waiting Time ($W_T = T_{AT} - B_T$)**
* **Averages & Efficiency**: Average Waiting Time, Average Turnaround Time, and overall CPU utilization percentages.

---

## 🚀 Key Visual & Functional Zones

* **🎮 Interactive Simulation Lab**: Customize processes on-the-fly (name, arrival time, burst time, priority), run playback simulations, adjust timing speeds, and watch queues move visually in real time.
* **📈 Rich Comparative Analytics**: Interactive charts powered by `recharts` mapping FCFS, SJF, Priority, and Round Robin against each other to instantly compare average waiting times and efficiency metrics.
* **🛎️ Reception Department**: Ticketing counters simulating FCFS / Priority / RR algorithms.
* **🎪 Specialty Activity zones**: Kids Trampolines (Priority / RR), Esports Lanes (SJF / Priority), and VR centers.
* **👤 User Profile System**: Secure login and historical logs of visitor entries.
* **🔒 The Hidden Admin Suite (`/powerplay-secret-admin`)**: A full audit log trail, booking controls, and user moderation panel.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, HSL-tailored Cyberpunk Styling, Framer Motion (premium micro-animations), Lucide React.
* **Backend**: Node.js, Express, JSON Web Token (JWT) authorization, bcryptjs password hashing.
* **Database**: MongoDB (Mongoose ODM).

---

## 📦 Project Structure

```
power-play-arena/
├── package.json           # Root package running concurrent scripts
├── .env                   # Global environment configuration
├── cleanup.js             # Utility cleanup script
├── server/                # Backend API Server
│   ├── config/            # Mongoose / MongoDB connections
│   ├── controllers/       # Auth, Admin, Booking & Simulation managers
│   ├── middleware/        # JWT Authentication protectors
│   ├── models/            # Database schemas (User, Booking, Simulation, Log)
│   ├── routes/            # REST API endpoints
│   ├── simulators/        # Pure JS implementation of FCFS, SJF, Priority, RR
│   └── server.js          # Express server entry point
│
└── client/                # React Frontend application
    ├── vite.config.js     # Dev server configuration with backend proxy
    ├── src/
    │   ├── context/       # AuthState & Global Arena audio/theme Contexts
    │   ├── components/    # Gantt Charts, Queue Visualizers, Glassmorphism UI
    │   ├── pages/         # Dashboard, Simulation lab, Activity zones, Profile
    │   │   └── admin/     # AdminDashboard, Audit log trails, User list
    │   └── App.jsx        # Router assembly and Notification portals
```

---

## 🏁 Installation & Running Locally

Ensure you have **Node.js** and a local **MongoDB** service running.

### 1. Perform Project Pruning
Remove any initial configuration artifacts or temporary project folders:
```powershell
node cleanup.js
```

### 2. Configure Environment Variables
Verify your root `.env` settings:
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/powerplay
JWT_SECRET=supercyberpunksecretkey123!@#
NODE_ENV=development
```

### 3. Install All Dependencies
Install the required packages across the root, client, and server workspaces in a single command:
```powershell
npm run install-all
```

### 4. Seed the Database
Seed default visitors, mock bookings, activity logs, and the administrator account:
```powershell
npm run seed
```

### 5. Launch the Development Suite
Run the concurrent task runner to boot both the Express server and Vite frontend concurrently:
```powershell
npm run dev
```

---

## 🔑 Access Credentials

### 👥 Normal Visitor Access
* You can sign up with any custom details directly on the **Visitor Enrollment** page.
* Alternatively, log in using any standard user seeded database credentials.

### 🛡️ System Admin Access
* **Route**: Access the hidden dashboard at `/powerplay-secret-admin`
* **Email**: `admin@powerplay.com`
* **Password**: `admin123`

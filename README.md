# Implementation Plan - Power Play Arena

Power Play Arena is a full-stack localhost web application that simulates Operating System Scheduling Algorithms (FCFS, SJF, Priority, Round Robin) by mapping them to an interactive entertainment arena theme.

- **Processes** = Visitors
- **CPU** = Entertainment Resources (Gaming PCs, Bowling lanes, Trampolines, VR gear)
- **Ready Queue** = Waiting Lines
- **Execution** = Activity Sessions
- **Terminated Processes** = Completed Activities

The simulator will feature a highly immersive, futuristic, dark gaming aesthetic with glowing neon elements, fully responsive layout, robust analytics, and a secure authentication system (with a hidden admin route).

---

## User Review Required

> [!IMPORTANT]
> - **Default Admin Account**: An initial admin account will be seeded automatically (`admin@powerplay.com` / `admin123`) to allow access to the hidden admin panel (`/powerplay-secret-admin`).
> - **MongoDB Requirements**: You will need a running MongoDB server (either local `mongodb://localhost:27017/powerplay` or a MongoDB Atlas URI) defined in the `.env` file.
> - **Sound Toggle**: An optional sci-fi synthesizer audio chime will be played when a process is "scheduled" or "completed" if the sound toggle is active.

---

## Proposed Folder Structure & Components

We will organize the project in a single repository with `client` and `server` folders, enabling clean separations.

```
power-play-arena/
├── package.json                   # Root package.json to run client & server concurrently
├── README.md                      # Detailed setup guide
├── .env                           # Global Environment configurations
├── server/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   ├── User.js                # Name, email, hashed password, role (user/admin)
│   │   ├── Booking.js             # User bookings with queue status and allocation timings
│   │   ├── Simulation.js          # Logs of executed simulations
│   │   └── Log.js                 # Admin/system logs (for auditing)
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Current User
│   │   ├── bookingController.js   # Manage reservations & department allocations
│   │   ├── simulationController.js# Saved simulation sessions & stats
│   │   └── adminController.js     # User management, booking moderation, system logs
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verifying & Admin role checks
│   ├── simulators/
│   │   ├── fcfs.js                # First-Come-First-Served logic
│   │   ├── sjf.js                 # Shortest Job First logic (preemptive and non-preemptive)
│   │   ├── priority.js            # Priority scheduling logic (preemptive and non-preemptive)
│   │   └── roundRobin.js          # Round Robin logic (custom time quantum)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── simulations.js
│   │   └── admin.js
│   ├── utils/
│   │   └── seed.js                # Seeding initial users, bookings, logs
│   └── server.js                  # Express backend entrypoint
│
└── client/
    ├── vite.config.js             # Client configuration with proxy setup
    ├── tailwind.config.js         # Theme extensions (neon, glowing, font families)
    ├── src/
    │   ├── index.css              # Custom styling (scrollbars, neon glows, glassmorphism)
    │   ├── main.jsx               # React entrypoint
    │   ├── App.jsx                # Router, global Context providers
    │   ├── context/
    │   │   ├── AuthContext.jsx    # Authentication & User state
    │   │   └── ArenaContext.jsx   # Global simulator configuration, live visitor generation, sound toggles
    │   ├── components/
    │   │   ├── navbar/Navbar.jsx  # Glassmorphism header with status, clock & sound controls
    │   │   ├── sidebar/Sidebar.jsx# Neon glowing sidebar for admin & dashboard pages
    │   │   ├── gantt/GanttChart.jsx# Full SVG-based or CSS-based timeline gantt chart
    │   │   ├── scheduler/QueueVisualizer.jsx # Real-time process movement animations
    │   │   └── ui/Card.jsx        # Premium cyberpunk panels
    │   ├── pages/
    │   │   ├── Home.jsx           # Dark thematic welcome, core OS-to-Arena map, live counters
    │   │   ├── Login.jsx          # Cyberpunk credentials entry
    │   │   ├── Signup.jsx         # Sign up as a regular visitor
    │   │   ├── Dashboard.jsx      # Quick stats, interactive queue metrics
    │   │   ├── Simulation.jsx     # Master simulation lab (add/edit processes, configure Gantt, live playback)
    │   │   ├── Analytics.jsx      # Recharts comparison of FCFS vs SJF vs Priority vs RR
    │   │   ├── Profile.jsx        # History of completed bookings (terminated processes)
    │   │   ├── Reception.jsx      # Reception Simulator (FCFS / Priority / RR ticketing)
    │   │   ├── KidsActivities.jsx # Kids VR/Trampoline (Priority / RR timer rotation)
    │   │   ├── AdultActivities.jsx# Adult Arena (SJF / Priority esports lanes)
    │   │   ├── GamingZone.jsx     # Gaming Cafe PC allocations (Queue switching CPU simulator)
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx # Live server stats, logs preview
    │   │   │   ├── ManageUsers.jsx   # View and delete registrations
    │   │   │   ├── ManageBookings.jsx# Direct scheduling actions
    │   │   │   └── SystemLogs.jsx    # Audit trails of mock arena server
    │   │   └── NotFound.jsx
    │   └── routes/
    │       ├── AppRoutes.jsx      # Path matching & Layout wrappers
    │       ├── ProtectedRoute.jsx # Route guarding for authenticated users
    │       └── AdminRoute.jsx     # Hidden route guarding for the "/powerplay-secret-admin" route
```

---

## Technical Implementations of Scheduling Algorithms

Each algorithm will be programmed in pure JS (both on client for UI preview and on server for API persistence) using correct OS principles:
1. **First Come First Served (FCFS)**:
   - Sort by arrival time.
   - Non-preemptive execution.
2. **Shortest Job First (SJF)**:
   - Preemptive (SRTF) and Non-preemptive modes.
   - Dynamically selects process with minimum remaining burst time at each execution step.
3. **Priority Scheduling**:
   - Preemptive and Non-preemptive modes.
   - Higher priority processes scheduled first (1 can be Highest or Lowest, custom toggles will be supported).
4. **Round Robin (RR)**:
   - Uses a Ready Queue.
   - Processes are allocated CPU for a specific Time Quantum.
   - Handles newly arrived processes and re-enqueuing of running processes properly.

Each algorithm outputs:
- **Gantt Chart Blocks** (Process ID, start time, end time).
- **Process Metrics**: Completion Time ($C_T$), Turnaround Time ($T_{AT} = C_T - A_T$), Waiting Time ($W_T = T_{AT} - B_T$).
- **Overall Statistics**: Average Waiting Time, Average Turnaround Time, CPU Utilization percentage.

---

## Verification Plan

### Automated/Unit Testing
- Validate all four scheduling algorithms with traditional textbook examples (e.g., standard process tables) to verify correct calculations of waiting times, turnaround times, and Gantt charts.
- Verify JWT creation, verification, and route protection.

### Manual Verification
- **Functional Testing**: Log in as a newly created user, make visual bookings in different departments, and see them simulated under various algorithms.
- **Master Simulation Lab**: Customize a simulation with $5+$ processes of varying arrival times, burst times, and priorities, run FCFS, SJF, Priority, and Round Robin, and check calculations.
- **Admin Verification**: Access `/powerplay-secret-admin`, verify users, delete database entries, and observe changes.

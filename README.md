# System Design Simulator 🚀

A full-stack interactive platform to design, simulate, and stress-test distributed systems. Build production-ready architectures with AI assistance, monitor real-time performance metrics, and perform chaos engineering experiments.

![System Design Simulator](https://picsum.photos/seed/system-design/1200/600)

## ✨ Features

### 🧠 AI-Assisted Architecture
- **Instant Generation**: Use natural language prompts (e.g., "Design a YouTube backend") to generate complex architectures.
- **Expert Best Practices**: AI follows industry standards for load balancing, caching, and asynchronous processing.
- **Hierarchical Layout**: Automatically organizes components from CDN to Database.

### 📊 Real-Time Simulation
- **Live Metrics**: Monitor Requests Per Second (RPS), Latency, CPU, and Memory usage across all nodes.
- **WebSocket Driven**: Real-time data updates powered by a dedicated simulation engine.
- **Traffic Scaling**: Dynamically adjust traffic load to see how your system handles stress.

### 🌪️ Chaos Engineering
- **Network Latency**: Induce artificial delays to test system responsiveness.
- **Packet Loss**: Simulate unstable network conditions and monitor error rates.
- **Targeted Failures**: Kill specific database nodes or random services to test failover and resilience.

### ☁️ Cloud & Export
- **Google Authentication**: Secure login to manage your private designs.
- **Cloud Saving**: Persist your architectures to Firebase Firestore.
- **PDF Export**: Download high-resolution snapshots of your designs for documentation.
- **Cost Estimation**: Real-time AWS/GCP infrastructure cost calculation based on your architecture.

## 🛠️ Tech Stack

- **Frontend**: React 19, React Flow, Tailwind CSS, Motion, Lucide React.
- **Backend**: Node.js, Express, WebSockets (`ws`).
- **Database & Auth**: Firebase (Firestore, Authentication).
- **AI**: Google Gemini API (`@google/genai`).
- **Export**: jsPDF, html2canvas.
- **Tooling**: Vite, TypeScript, tsx.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Google Gemini API Key
- A Firebase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/system-design-simulator.git
   cd system-design-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   VITE_FIREBASE_API_KEY=your_firebase_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to `http://localhost:3000` in your browser.

## 📖 Usage Guide

1. **Design**: Drag and drop components from the sidebar or use the **AI Assistant** at the bottom to generate a starting point.
2. **Connect**: Draw lines between nodes to define data flow.
3. **Configure**: Click on any node to adjust its instances and see specific metrics.
4. **Simulate**: Hit "Start Simulation" to see traffic flowing through your system.
5. **Test**: Use the "Chaos Engineering" section to break things and see how the metrics react.
6. **Save**: Login with Google and click "Save Design" to keep your work in the cloud.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.

---
Built with ❤️ for the System Design community.

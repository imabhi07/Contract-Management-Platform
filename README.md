# 📄 Contract Management Platform

A robust, frontend-centric Contract Management System built with **Next.js 14**, **TypeScript**, and **Zustand**. This application streamlines the lifecycle of legal contracts-from dynamic blueprint creation to final signature-while enforcing strict business logic and state transitions.

> **Status:** 🚀 Complete

---

## 📖 Project Overview

This platform serves as a modern solution for managing contract workflows without a heavy backend. It demonstrates advanced frontend capabilities including complex state management, drag-and-drop interfaces, and persistent local storage simulation.

---

## ✨ Key Features

### 🏗 Core Functionality
* **Dynamic Blueprint Builder:** Create reusable contract templates using a flexible form builder.
* **Strict Lifecycle Management:** Enforces a secure workflow: `Created` → `Approved` → `Sent` → `Signed` → `Locked`.
* **Role-Based Simulation:** Seamlessly simulates different user roles (Creator, Approver, Signer) in a single session.
* **Dashboard & Filtering:** Powerful filtering options to view contracts by status (`Active`, `Pending`, `Signed`).
* **Local Persistence:** robust data retention using `localStorage`, ensuring work is saved across browser reloads.

### 🚀 Advanced Enhancements
* **Drag-and-Drop Ordering:** Implemented using **@dnd-kit** for a smooth, accessible field reordering experience in the Blueprint Builder.
* **Reusable Component Library:** A modular UI kit (`src/components/ui`) featuring atomic components like `Card`, `Badge`, and `Button` for consistent design.
* **Visual Status Timeline:** An intuitive progress bar in the Contract Viewer to visualize the current stage of the lifecycle.
* **Logic Verification:** Integrated manual test script (`src/lib/lifecycle.test.ts`) to programmatically verify state transition rules.

---

## 🛠 Tech Stack & Architecture

| Technology | Usage | Justification |
| :--- | :--- | :--- |
| **Next.js 14** | Framework | Leverages the App Router and Server Components for a modern, scalable structure. |
| **TypeScript** | Language | Ensures strict type safety for critical data models like `Contract` and `Blueprint`. |
| **Zustand** | State | Selected for its minimalist API and built-in `persist` middleware over Redux. |
| **Tailwind CSS** | Styling | Facilitates rapid UI development with a utility-first, responsive design system. |
| **@dnd-kit** | Drag & Drop | Industry-standard library for performant and accessible drag-and-drop interactions. |
| **Framer Motion** | Animation | Adds polished layout animations for list reordering and table interactions. |

---

## 📂 Project Structure

The project adheres to a **Feature-Based Architecture** to ensure maintainability and scalability:

```text
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── features/           # Domain-specific components (Complex logic)
│   │   ├── BlueprintBuilder.tsx  # Drag-and-drop form editor
│   │   ├── ContractViewer.tsx    # Lifecycle management UI
│   │   └── ContractTable.tsx     # Dashboard with filters
│   └── ui/                 # Reusable atomic components (Presentational components)
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       └── Input.tsx
├── lib/                    # Pure utility functions & business logic
│   └── lifecycle.ts        # State machine logic
├── store/                  # Global state (Zustand)
│   └── useStore.ts         # Central store with persistence
└── types/                  # TypeScript interfaces (Single source of truth)
    └── index.ts        
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ installed  
- npm or yarn  

### Installation

Clone the repository:

    git clone https://github.com/imabhi07/Contract-Management-Platform.git
    cd Contract-Management-Platform

Install dependencies:

    npm install

Run the development server:

    npm run dev

Access the App:  
Open http://localhost:3000 in your browser.

---

## 🧪 How to Test

### 1. Blueprint Creation (Drag-and-Drop)
- Navigate to **"New Blueprint"** from the dashboard.  
- Add multiple fields (e.g., "Client Name", "Effective Date", "Signature").  
- Use the **"Grip"** icon (⋮⋮) to drag and reorder fields.  
- Click **Save Blueprint**.  

### 2. Contract Lifecycle Workflow
- Create a New Contract using your saved blueprint.  
- Open the contract; observe the status is **CREATED**.  
- Attempt to Sign immediately (verify the button is disabled/hidden).  
- Progress the workflow: Click **Mark as Approved** → **Mark as Sent**.  
- Fill in the required fields and Sign the contract.  
- Verify the status updates to **SIGNED** and all inputs become Locked (Read-Only).  

### 3. Verify Business Logic
Run the included test script to verify the state machine logic via the console:

    npx tsx src/lib/lifecycle.test.ts

---

## ✅ Assumptions & Limitations
- **Authentication:** No complex authentication is implemented. The app operates in a "Super User" mode, allowing one user to perform all lifecycle actions for demonstration purposes.  
- **Data Persistence:** Data is stored in the browser's `localStorage`. Clearing the browser cache or testing in Incognito mode will reset the application state.  
- **Signatures:** Digital signatures are simulated via a text input field rather than a cryptographic signature integration.  

---

Developed by **Abhijeet Pawanoji**

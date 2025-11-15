# RoadMap.com

## Project Overview

This is a full-featured web application for task management. The project focuses on interactivity and a modern design, achieved using Tailwind CSS.

### Key Features:

* **Authentication:** User registration and login functionality.
* **Task Management:** Ability to create, read, edit, and delete tasks.
* **Priority Board:** Tasks are automatically grouped and displayed based on their **Priority** level.
* **Interactivity:** **Drag and Drop (D&D)** functionality is implemented for easy task reordering.

---

## Technologies

| Category | Technology | Notes |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express.js | Handles API routing and user authentication. |
| **Database** | MongoDB (via Mongoose) | Used for persistent data storage. |
| **Styling** | **Tailwind CSS** | Used for rapid, utility-first styling for a modern interface. |
| **Frontend** | Vanilla JavaScript, HTML5 | Pure JavaScript handles all client-side logic. |
| **Drag and Drop** | **Sortable.js** | Used to implement the smooth drag-and-drop and sorting functionality for tasks. |
| **Tools** | GSAP, PostCSS | Used for animations and CSS processing. |

---

## Installation and Run Instructions

To run the project locally, you need to have **Node.js** and **npm** installed.

### 1. Install Dependencies

In the project's root directory, you must install all necessary packages using npm.

### 2. Start the Server

To launch the server (backend and API), use the `dev` script. The server will automatically restart when code changes are saved.

**To start the server, execute the command:** `npm run dev`

### 3. Run Tailwind CSS Watcher

Since **Tailwind CSS** is used, you must run a separate process to monitor and update the styles when frontend files are changed.

**To start the Tailwind CSS watcher, execute the command:** `npx tailwindcss -i ./styles/style.css -o ./styles/output.css --watch`

### 4. Access the Application

After successfully starting both processes (server and style watcher), the application will be accessible at the address configured in your server (typically `http://localhost:5500`).

---

## Drag and Drop (D&D)

The smooth drag-and-drop functionality is implemented using the **Sortable.js** library. This allows users to easily change the order of tasks on the board.

**Sortable.js Website:** [https://sortablejs.github.io/Sortable/](https://sortablejs.github.io/Sortable/)
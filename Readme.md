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

## Configuration

For the application to function correctly, you must create an environment variables file named **`.env`** in the project's root directory. This file contains critical data required for database connection and security.

### 1. Create the `.env` File

Create a new file in the root directory of your project and name it **`.env`**.

### 2. File Structure

Copy and paste the following structure into your new `.env` file. **Crucially, replace the placeholder values** (especially for `MONGO_URI` and `JWT_SECRET`) with your actual, secure credentials.

### 3. Variable Descriptions

| Variable | Purpose | Notes |
| :--- | :--- | :--- |
| **`PORT`** | Defines the port on which the Express server will run. | Default is typically 5500. |
| **`MONGO_URI`** | The full connection URL for your MongoDB database (e.g., MongoDB Atlas). | **Must be replaced** with your actual database credentials and cluster URL. |
| **`JWT_SECRET`** | The secret key used for signing JSON Web Tokens. | **Must be replaced** with a long, complex, and unique string for security. |

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

**To start the Tailwind CSS watcher, execute the command:** `npx tailwindcss -i public/styles/style.css -o public/dist/output.css --watch `

### 4. Access the Application

After successfully starting both processes (server and style watcher), the application will be accessible at the address configured in your server (typically `http://localhost:5500`).

---

## Drag and Drop (D&D)

The smooth drag-and-drop functionality is implemented using the **Sortable.js** library. This allows users to easily change the order of tasks on the board.

**Sortable.js Website:** [https://sortablejs.github.io/Sortable/](https://sortablejs.github.io/Sortable/)

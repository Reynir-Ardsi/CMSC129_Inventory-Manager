# CMSC129 Inventory Manager

A full-stack web application designed to help users efficiently manage their inventory. This project features a React (Vite) frontend and a Node.js/Express backend, utilizing Firebase Firestore as its database.

## 🚀 Features

* **Complete CRUD Operations:** Create, Read, Update, and Delete inventory items.
* **Soft Deletion:** Safely remove items from the dashboard without permanently deleting them from the database records.
* **Categorization:** Organize items into specific categories (Electronics, Sports, Food, Health & Beauty, Clothing, School Supplies).
* **Responsive Dashboard:** A clean, intuitive user interface for managing data.
* **Secure Database Access:** Backend integrates securely with Firebase Admin SDK using environment variables.

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite, React Router DOM
* **Backend:** Node.js, Express.js, CORS
* **Database:** Firebase Firestore (Admin SDK)

---

## ⚙️ Installation & Setup

To run this project locally, you will need to set up both the backend server and the frontend development server.

### Prerequisites
* Node.js installed on your machine.
* A Firebase project with Firestore enabled.
* Firebase Admin service account credentials.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/reynir-ardsi/cmsc129_inventory-manager.git
cd cmsc129_inventory-manager
\`\`\`

### 2. Backend Setup
Navigate to the server directory, install dependencies, and configure your environment variables.

\`\`\`bash
cd server
npm install
\`\`\`

**Environment Variables:**
Create a `.env` file inside the `/server` directory and add your Firebase Admin SDK credentials:

\`\`\`env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"
\`\`\`
*(Note: Ensure your `.env` file is included in your `.gitignore` to keep your keys secure).*

**Start the Server:**
\`\`\`bash
node server.js
\`\`\`
The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window, navigate back to the root project directory, and start the React app.

\`\`\`bash
# From the root directory
npm install
npm run dev
\`\`\`
The Vite development server will start, typically on `http://localhost:5173`.

---

## 📖 Usage Guide

1. **Login:** Open the frontend URL in your browser. You will be greeted by the Login page. (Note: Currently, validation is mocked, so clicking "Log-in" will successfully redirect you to the dashboard).
2. **View Inventory:** Navigate to the inventory tab to see a table of all active items fetched from the database.
3. **Add an Item:** Click the **+** button in the top navigation bar to open the "Add New Item" modal. Fill in the Name, Category, Quantity, and Price, then click "Save Item".
4. **Edit an Item:** Click the blue pencil icon next to an item in the table to modify its details.
5. **Delete an Item:** Click the red trash can icon next to an item. This will trigger a soft delete, removing it from your view while maintaining the backend record for auditing purposes.

---

## 📡 API Endpoints

The Express backend provides the following RESTful API endpoints for inventory management. The base URL for the API is `http://localhost:5000/api/inventory`.

### 1. Get All Inventory Items
* **Endpoint:** `GET /`
* **Description:** Retrieves all active inventory items. Filters out items that have been soft-deleted (`isDeleted: true`).
* **Response (200 OK):**
  \`\`\`json
  [
    {
      "id": "doc-id-123",
      "name": "Laptop",
      "category": "Electronics",
      "quantity": 10,
      "price": 999.99,
      "isDeleted": false,
      "createdAt": "Timestamp"
    }
  ]
  \`\`\`

### 2. Add a New Item
* **Endpoint:** `POST /`
* **Description:** Creates a new inventory item in the database. Automatically assigns `isDeleted: false` and a server timestamp.
* **Request Body:**
  \`\`\`json
  {
    "name": "Basketball",
    "category": "Sports",
    "quantity": 25,
    "price": 29.99
  }
  \`\`\`
* **Response (201 Created):** Returns the newly created item along with its generated Firestore `id`.

### 3. Update an Item
* **Endpoint:** `PUT /:id`
* **Description:** Modifies the details of an existing inventory item based on its document ID.
* **Request Parameters:** `id` (string) - The Firestore document ID of the item.
* **Request Body:** Include the fields you wish to update (e.g., quantity, price).
  \`\`\`json
  {
    "quantity": 20,
    "price": 24.99
  }
  \`\`\`
* **Response (200 OK):** `{ "message": "Item updated successfully" }`

### 4. Delete an Item (Soft Delete)
* **Endpoint:** `DELETE /:id`
* **Description:** Performs a soft delete on an item by updating its `isDeleted` flag to `true` rather than permanently erasing the document.
* **Request Parameters:** `id` (string) - The Firestore document ID of the item.
* **Response (200 OK):** `{ "message": "Item soft-deleted successfully" }`
# Car Management Application

## Introduction

This is a **Car Management Application** where users can create, view, edit, and delete cars. Each car can contain up to **10 images**, a **title**, a **description**, and **tags** such as car type, company, dealer, etc. The application includes **user authentication**, allows users to manage only their products, and provides **search functionality** across products.

#### sample user login credentials:
```
email: environment@nature.com
password: environment@nature.com
```
## Features

### Backend

- **User Authentication** (Sign Up, Login, Logout)
- **CRUD Operations on Cars**
- **Global Search Functionality**
- **API Documentation** via Swagger
- **Database Integration using MongoDB**
- **Image Upload Support** via Multer & Cloudinary
- **Deployed on:** [Backend Hosted Link](https://car-management-spyne-ai.vercel.app/)

### Frontend

- **User Authentication** (Register/Login)
- **Dashboard to View Cars**
- **Create, Edit, and Delete Cars**
- **Search Functionality**
- **Styled with Tailwind CSS**
- **Deployed on:** [Frontend Hosted Link](https://carhub-spyneai.vercel.app/)

## Tech Stack

### Frontend (Client)

- **React.js** (with Vite)
- **Redux Toolkit**
- **React Router**
- **Tailwind CSS**
- **Axios**

### Backend (Server)

- **Node.js** & **Express.js**
- **MongoDB with Mongoose**
- **JWT Authentication**
- **Swagger for API Documentation**
- **Cloudinary for Image Upload**

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+)
- **MongoDB**

### Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/HSRAKTU/Car_management_spyne_ai.git
   cd <in_repo>
   ```

2. **Install dependencies for the backend:**

   ```sh
   cd server
   npm install
   ```

3. **Set up environment variables in **``**:**

   ```env
   PORT=8000
   CORS_ORIGIN=*
   MONGODB_URI=<your mongodburi>
   
   ACCESS_TOKEN_SECRET=
   ACCESS_TOKEN_EXPIRY=1d
   
   REFRESH_TOKEN_SECRET=
   
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

4. **Run the backend server:**

   ```sh
   npm run dev
   ```

5. **Install dependencies for the frontend:**

   ```sh
   cd ../client
   npm install
   ```

6. **Run the frontend application:**

   ```sh
   npm run dev
   ```

## API Documentation

The backend provides a **Swagger API Documentation** available at:

```
http://localhost:8000/api/docs
```

### Available API Endpoints

#### User Routes

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| POST   | `/user/register`    | Register a new user         |
| POST   | `/user/login`       | Login with email & password |
| POST   | `/user/logout`      | Logout user                 |
| GET    | `/user/currentUser` | Get current logged-in user  |

#### Car Routes

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| POST   | `/car/create-product`         | Create a new car listing |
| GET    | `/car/list-products`          | Fetch all cars           |
| GET    | `/car/list-product-by-id/:id` | Fetch a car by ID        |
| PATCH  | `/car/update-product/:id`     | Update car details       |
| DELETE | `/car/delete-product/:id`     | Delete a car             |

### Postman Collection

The **Postman API collection** is available at: [Postman Collection Link](https://www.postman.com/myworkspaceatpostman/workspace/car-management-assignment/collection/32695735-13c87926-d8d3-48ec-894d-3c031485549d?action=share\&source=collection_link\&creator=32695735)

## Deployment

The application is deployed at:

- **Frontend:** [Frontend URL](https://carhub-spyneai.vercel.app/)
- **Backend:** [Backend URL](https://car-management-spyne-ai.vercel.app/)



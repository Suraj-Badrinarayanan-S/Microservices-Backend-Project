# Nodejs-Backend-Development

## Project Architecture
![image](https://github.com/Suraj-Badrinarayanan-S/Nodejs-Backend-Development/blob/main/assets/architecture.png)

This project demonstrates a microservices-based NodeJS backend system using Docker containers and message queueing.

---

## 🛠 Tools and Technology Used:

➡️ Node JS + Express for backend service development  
➡️ Docker for containerizing individual services  
➡️ MongoDB for database operations  
➡️ RabbitMQ for message brokering and async notifications  
➡️ Postman for API testing and route validation  

---

## ⚙️ Project Workflow:

Developed and containerized a **Task Management System** with the following services:

### 🔹 User Service (Docker Port: 3001)
- Handles user data and authentication (if applicable).
- Interacts with MongoDB for storing user information.
- Connects to RabbitMQ to send notifications (e.g., user created).

### 🔹 Task Service (Docker Port: 3002)
- Responsible for creating, managing, and updating tasks.
- Communicates with MongoDB (on port 27017) to store and retrieve task data.
- Sends task-related notifications via RabbitMQ.

### 🔹 MongoDB (Docker Port: 27017)
- Acts as the main persistent database for both user and task services.
- All documents are stored in collections like `users` and `tasks`.

### 🔹 RabbitMQ Notifications
- Acts as a broker to queue notification events triggered by either user or task service.
- Listens for messages on specific queues like `task_created`, `user_registered`.

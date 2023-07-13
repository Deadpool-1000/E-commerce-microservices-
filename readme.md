# E-commerce Microservices Architecture

This repository contains a simple skeleton for an e-commerce microservices architecture. It includes three microservices: Product, Order, and Authentication. Each microservice is implemented using Node.js and utilizes the RabbitMQ library, amqplib, for inter-service communication via message queues.

## Microservices Overview

1. **Product Microservice**: Manages product information such as name, description, price, and inventory. It provides APIs for creating and buying products.

2. **Order Microservice**: Handles order processing and management. It allows users to place orders, and other order-related operations.

3. **Authentication Microservice**: Handles user authentication and authorization. It provides APIs for user registration, login, and token-based authentication.

## Prerequisites

To set up and run the microservices locally, you need to have the following dependencies installed:

- Node.js (v12 or higher)
- Docker Desktop

## Getting Started

### 1. Clone the Repository

Clone the repository to your local machine using the following command:
   ```bash
   git clone https://github.com/Deadpool-1000/E-commerce-microservices-.git
   ```

### 2. Install Dependencies

Navigate to the root directory of each microservice (product-service, order-service, and auth-service) and install the required dependencies by running the following command:

   ```bash
   npm install
   ```

### 3. Set Up RabbitMQ Locally

To run RabbitMQ locally using Docker Desktop, follow these steps:

#### Step 1: Install Docker Desktop

If you haven't already, download and install Docker Desktop for your operating system from the official Docker website: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

#### Step 2: Pull the RabbitMQ Image

Open a terminal or command prompt and execute the following command to pull the RabbitMQ Docker image:

```bash
docker pull rabbitmq:3-management
```

#### Step 3: Run RabbitMQ Container

Run the RabbitMQ container using the following command:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

This command starts the RabbitMQ container with port mappings for RabbitMQ (5672) and the management UI (15672).

### 4. Start the Microservices

To start each microservice, navigate to their respective directories (product-service, order-service, and auth-service) and run the following command:

```bash
npx nodemon index.js
```

Each microservice will start running on a different port specified in their respective configuration files.

## Contributing

Contributions are welcome! If you have any suggestions or improvements for this project, please create a pull request or open an issue.



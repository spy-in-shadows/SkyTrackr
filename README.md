# 🚀 SkyTrakr – Real-Time Space Activity Dashboard

## 🌌 Project Overview

SkyTrakr is a modern web application designed to help users explore real-time space activity, including rocket launches, astronauts, and space agencies.

The platform provides an interactive way to discover space data using powerful search, filtering, and sorting capabilities, all powered by live API data.

---

## ✨ Features

### 🚀 Launch Explorer (Core Feature)

* View upcoming rocket launches in real time
* Search launches by mission or rocket name
* Filter launches by status (upcoming, success, failure)
* Sort launches by date or name

---

### 🧑‍🚀 Astronaut Explorer (Planned)

* Browse astronauts from around the world
* Search by name
* Filter by nationality or status

---

### 🏢 Agency Explorer (Planned)

* Explore space agencies and organizations
* Filter by country or type
* Sort alphabetically

---

### 🎨 User Experience

* Clean and modern UI
* Fully responsive design (mobile, tablet, desktop)
* Card-based layout for better readability

---

## 🌐 APIs Used

This project uses the **Launch Library 2 API** to fetch real-time space data.
API: https://ll.thespacedevs.com/2.2.0/

### 🚀 Core Endpoints

* **Launches API** → Get upcoming and past rocket launches
* **Astronauts API** → Retrieve astronaut details
* **Agencies API** → Fetch space agency information

---

## ⚙️ API Type

* REST API
* JSON-based responses

---

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript (ES6+)
* **API Integration:** Fetch API
* **Styling:** CSS

---

## ⚙️ How It Works

1. The application fetches data from the Space Devs API.
2. Data is stored and managed in JavaScript.
3. Array methods like `map`, `filter`, and `sort` are used to process the data.
4. The UI dynamically updates based on user interactions.

---

## 🔎 Example Use Case

User searches: **"Falcon"**

👉 The app filters and displays all rocket launches related to Falcon missions.

---

## 💡 Additional Features (Planned Enhancements)

* ⭐ Save favorite launches (localStorage)
* 🌙 Dark mode toggle
* 📊 Advanced filtering options
* 🔄 Pagination or infinite scrolling

---

## 📂 Project Structure

space-explorer/
│── index.html
│── style.css
│── script.js
│── README.md

---

## 🎯 Learning Objectives

* Work with real-world REST APIs
* Handle asynchronous JavaScript (fetch API)
* Implement search, filtering, and sorting logic
* Build responsive and interactive UI

---

## 📌 Future Improvements

* Multi-page navigation (Launches, Astronauts, Agencies)
* Performance optimization
* Deployment with custom domain
* Progressive Web App (PWA) support

---

## 🙌 Acknowledgment

* Data provided by **The Space Devs (Launch Library 2 API)**
* Built as a real-world frontend project to practice API integration and UI development
# Campuz - Modern Academic Communication Platform

An all-in-one academic platform built for modern Indian colleges, combining a sleek "Instagram-style" social feed, academic records, attendance tracking, and AI-assisted bot interactions.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- Python 3.8 or higher
- MongoDB Server (Running locally on the default port `27017` or a Mongo URI)
- Node.js (Optional, but recommended for advanced frontend dev)

***

## 🚀 Quick Start Guide

### 1. Database Setup
Ensure that your MongoDB server is running. By default, Django (via Djongo) will attempt to connect to `mongodb://localhost:27017` and create a database named `campuz_db`. If you need to change this, edit `backend/campuz/settings.py`.

### 2. Backend Setup
The backend is built with Django and Django Rest Framework (DRF).

Open your terminal and navigate to the backend folder:
```bash
cd backend
```

Create a virtual environment:
```bash
python -m venv venv
```

Activate the virtual environment:
- On Windows: `venv\Scripts\activate`
- On macOS/Linux: `source venv/bin/activate`

Install the required Python packages:
```bash
pip install -r requirements.txt
```

Run the database migrations to set up your MongoDB schema:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Generate Sample / Demo Data (Important)
To populate the database with dummy students, faculty, announcements, and academic records so you can test the UI quickly, run the custom seed command:
```bash
python manage.py seed
```

*This will create the following test accounts (all passwords are listed in terminal when ran, e.g. `pwd_student`):*
- `student@campuz.com` (Student Role)
- `faculty@campuz.com` (Faculty Role)
- `hod@campuz.com` (Head of Department)
- `admin@campuz.com` (Admin / Superuser)

### 4. Run the Backend Server
Start the Django development server:
```bash
python manage.py runserver
```
The REST APIs will now be available at `http://localhost:8000/`.

### 5. Open the Frontend
The frontend does not strictly require a build step or server unless you install Tailwind variants. You can simply open the HTML files directly in your web browser:
1. Navigate to the `frontend/` directory.
2. Open `index.html` in your favorite browser.
3. Explore the `dashboard.html`, `feed.html`, and `chat.html` pages!

***

## 🧱 Tech Stack Overview

- **Frontend:** HTML5, Tailwind CSS (via CDN), Vanilla JavaScript, FontAwesome Icons.
- **Backend:** Python, Django 4.1+, Django REST Framework (DRF), SimpleJWT.
- **Database:** MongoDB (using `djongo`).
- **Design System:** Deep dark mode `(#0F172A)`, purple-to-pink gradients, soft shadows, and glassmorphism.

## 📄 Core Features
- **Student Dashboard:** View real-time attendance percentages, current CGPA, fees status, and branch information.
- **Social Feed:** 'Instagram-style' continuous vertical scrolling feed for official college notices and events.
- **AI College Assistant:** A built-in chat interface answering basic queries regarding the college infrastructure and records.
- **Role-Based Access:** Differential UIs and permissions automatically handled via JWTs for students, teachers, and admins.

# Thoughts Out Loud

A Twitter clone built with Flask - share your thoughts with the world!

## Features

- **User Authentication**: Register and login securely
- **Post Tweets**: Share your thoughts in 280 characters or less
- **Timeline**: View all tweets from the community
- **User Profiles**: View individual user profiles and their tweets
- **Modern UI**: Dark-themed, Twitter-inspired interface

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sudomastery/thoughts-out-loud.git
cd thoughts-out-loud
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Flask application:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

3. Register a new account and start tweeting!

## Project Structure

```
thoughts-out-loud/
├── app.py              # Main application file
├── requirements.txt    # Python dependencies
├── templates/          # HTML templates
│   ├── base.html      # Base template
│   ├── login.html     # Login page
│   ├── register.html  # Registration page
│   ├── timeline.html  # Home timeline
│   └── profile.html   # User profile
└── instance/          # Database directory (auto-created)
    └── twitter_clone.db
```

## Technologies Used

- **Flask**: Web framework
- **SQLAlchemy**: Database ORM
- **Flask-Login**: User session management
- **SQLite**: Database
- **HTML/CSS**: Frontend

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Post Tweets**: Share thoughts up to 280 characters
4. **View Timeline**: See all tweets from all users
5. **View Profiles**: Click on usernames to see individual profiles

## Security Note

This is a demonstration project. For production use, please:
- Change the `SECRET_KEY` in `app.py`
- Use environment variables for sensitive configuration
- Implement HTTPS
- Add additional security measures (CSRF protection, rate limiting, etc.)
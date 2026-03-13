# Navigate to frontend directory

cd canteen-frontend

# Install React dependencies

npm install

# The following packages will be installed automatically from package.json:

# - react

# - react-router-dom (for navigation)

# - recharts (for charts)

# - @heroicons/react (for icons)

# - tailwindcss (for styling)

# Create environment file

# On Windows:

copy .env.example .env

# On Mac/Linux:

# cp .env.example .env

# Update the API URL in .env file

# Open .env and set:

REACT_APP_API_URL=http://localhost:8000/api

# Start the React development server

npm start

# The app will open at http://localhost:3000

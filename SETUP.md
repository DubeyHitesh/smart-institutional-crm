# Smart Institutional CRM - Setup Guide

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space minimum
- **Internet**: Required for Gemini API integration

### Software Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **MongoDB**: v4.4.0 or higher
- **Git**: Latest version

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-institutional-crm
```

### 2. Install Node.js and npm
Download and install from: https://nodejs.org/
Verify installation:
```bash
node --version
npm --version
```

### 3. Install MongoDB
**Windows:**
- Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service: `net start MongoDB`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` file:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/smart_crm
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
NODE_ENV=development
```

### 5. Frontend Setup
```bash
# Navigate to root directory
cd ..

# Install frontend dependencies
npm install
```

### 6. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### 7. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Environment Variables

### Backend (.env)
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/smart_crm
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
NODE_ENV=development
```

### Gemini API Integration
The application uses Google's Gemini API for assignment summarization. The API key is currently hardcoded in the frontend. For production, move this to environment variables.

## Database Setup

MongoDB will automatically create the required databases:
- `smart_crm_master` - Master database for admin registry
- `smart_crm_[username]_[timestamp]` - Tenant databases for each institution

## Troubleshooting

### Common Issues

1. **Port 3000/5001 already in use:**
   ```bash
   # Kill processes using the ports
   npx kill-port 3000
   npx kill-port 5001
   ```

2. **MongoDB connection error:**
   - Ensure MongoDB service is running
   - Check MongoDB URI in .env file
   - Verify MongoDB is installed correctly

3. **npm install errors:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **CORS errors:**
   - Ensure backend is running on port 5001
   - Check CORS configuration in backend/server.js

## Development Tools (Optional)

### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client
- MongoDB for VS Code

### Database GUI (Optional)
- MongoDB Compass: https://www.mongodb.com/products/compass

## Production Deployment

### Environment Variables for Production
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_crm
JWT_SECRET=your-very-secure-production-secret-key
PORT=5001
```

### Build Commands
```bash
# Frontend build
npm run build

# Backend production
NODE_ENV=production npm start
```

## Support

For issues and questions:
1. Check this setup guide
2. Review the main README.md
3. Check console logs for error messages
4. Ensure all dependencies are installed correctly

## License

MIT License - see LICENSE file for details.
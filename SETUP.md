# 🚀 Smart Institutional CRM - Complete Setup Guide

## 📋 Prerequisites

### Required Software
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)
- **MongoDB Atlas Account** (cloud database) - [Sign up](https://www.mongodb.com/atlas)

### Optional Tools
- **MongoDB Compass** - GUI for database management
- **Postman** or **Thunder Client** - API testing
- **React Developer Tools** - Browser extension

## 🛠️ Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smart-institutional-crm.git
cd smart-institutional-crm
```

### 2. MongoDB Atlas Setup
1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster

2. **Configure Database Access**
   - Go to Database Access
   - Create a new database user
   - Username: `admin`
   - Password: `adminforever`
   - Grant `Atlas Admin` privileges

3. **Configure Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - Or add your specific IP address for security

4. **Get Connection String**
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
echo "PORT=5001" > .env
echo "MONGODB_URI=mongodb+srv://admin:adminforever@smart-crm-cluster.hwyemja.mongodb.net/smart_crm_master?retryWrites=true&w=majority&appName=smart-crm-cluster" >> .env
echo "JWT_SECRET=your-super-secret-jwt-key-here-change-in-production" >> .env
echo "NODE_ENV=development" >> .env

# Start backend server
npm start
```

### 4. Frontend Setup
```bash
# Navigate to root directory
cd ..

# Install dependencies
npm install

# Start development server
npm start
```

## 🌐 Access the Application

### URLs
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001](http://localhost:5001)
- **MongoDB Atlas**: Your cluster dashboard

### Default Admin Account
After first setup, create an admin account through the registration page:
- **Role**: Admin
- **Username**: Choose your username
- **Password**: Choose a secure password

## 🔧 Development Environment Setup

### VS Code Extensions (Recommended)
```bash
# Install these extensions for better development experience
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
code --install-extension formulahendry.auto-rename-tag
code --install-extension ms-vscode.vscode-json
```

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 📁 Project Structure Overview
```
smart-institutional-crm/
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── server.js           # Express server
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── context/            # React Context
│   ├── services/           # API services
│   └── types/              # TypeScript types
├── public/                 # Static assets
└── package.json            # Frontend dependencies
```

## 🔍 Verification Steps

### 1. Backend Health Check
```bash
# Test backend is running
curl http://localhost:5001/api/auth/me
# Should return: {"message": "No token provided"}
```

### 2. Frontend Access
- Open [http://localhost:3000](http://localhost:3000)
- Should see the 3D landing page
- Navigation should be responsive

### 3. Database Connection
- Check backend console for "Connected to MongoDB Atlas"
- No connection errors should appear

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5001
npx kill-port 5001
```

#### MongoDB Connection Issues
1. **Check Connection String**
   - Ensure password is correct
   - Verify cluster name matches
   - Check network access settings

2. **Firewall Issues**
   - Add `0.0.0.0/0` to MongoDB Atlas Network Access
   - Or add your specific IP address

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Environment Variables Check
Verify your `.env` file in the backend directory:
```bash
cat backend/.env
```

Should contain:
```
PORT=5001
MONGODB_URI=mongodb+srv://admin:adminforever@smart-crm-cluster.hwyemja.mongodb.net/smart_crm_master?retryWrites=true&w=majority&appName=smart-crm-cluster
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
NODE_ENV=development
```

## 🚀 Production Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=5001
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-super-secure-production-secret
```

### Build Commands
```bash
# Build frontend for production
npm run build

# Start backend in production mode
cd backend
NODE_ENV=production npm start
```

### Deployment Platforms
- **Frontend**: Netlify, Vercel, GitHub Pages
- **Backend**: Heroku, Railway, DigitalOcean
- **Database**: MongoDB Atlas (already cloud-hosted)

## 📊 Performance Optimization

### Development Mode
- Hot reloading enabled
- Source maps for debugging
- Detailed error messages

### Production Mode
- Minified bundles
- Optimized assets
- Error logging
- Performance monitoring

## 🔐 Security Considerations

### Development
- Use strong JWT secrets
- Enable CORS for localhost only
- Regular dependency updates

### Production
- Use environment-specific secrets
- Configure proper CORS origins
- Enable HTTPS
- Regular security audits

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

### Learning Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Styled Components](https://styled-components.com/docs)
- [JWT.io](https://jwt.io/) - JWT debugger

## 🆘 Getting Help

### Support Channels
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides
- **Community**: Developer community support

### Debug Information
When reporting issues, include:
- Node.js version: `node --version`
- npm version: `npm --version`
- Operating system
- Error messages and stack traces
- Steps to reproduce

---

**Setup complete! 🎉 Your Smart Institutional CRM is ready for development.**

*Happy coding! 🚀*
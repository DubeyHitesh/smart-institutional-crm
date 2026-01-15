# 🔗 System Integration - Smart Institutional CRM

## 🌐 Full-Stack Architecture Overview

### Three-Tier Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │    DATABASE     │
│   (React)       │◄──►│   (Node.js)     │◄──►│  (MongoDB)      │
│                 │    │                 │    │                 │
│ • UI Components │    │ • API Routes    │    │ • Master DB     │
│ • State Mgmt    │    │ • Auth System   │    │ • Tenant DBs    │
│ • API Calls     │    │ • File Upload   │    │ • Collections   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔄 Data Flow Architecture

### Request-Response Cycle

#### 1. User Authentication Flow
```
Frontend                Backend                 Database
   │                       │                       │
   │ 1. Login Request      │                       │
   ├──────────────────────►│                       │
   │                       │ 2. Validate Creds    │
   │                       ├──────────────────────►│
   │                       │ 3. User Data          │
   │                       │◄──────────────────────┤
   │                       │ 4. Generate JWT       │
   │ 5. JWT Token          │                       │
   │◄──────────────────────┤                       │
   │                       │                       │
```

#### 2. Multi-Tenant Data Access
```
Frontend                Backend                 Database
   │                       │                       │
   │ 1. API Request        │                       │
   │    + JWT Token        │                       │
   ├──────────────────────►│                       │
   │                       │ 2. Decode JWT         │
   │                       │    Extract DB Name    │
   │                       │ 3. Connect to         │
   │                       │    Tenant DB          │
   │                       ├──────────────────────►│
   │                       │ 4. Query Data         │
   │                       │◄──────────────────────┤
   │ 5. JSON Response      │                       │
   │◄──────────────────────┤                       │
```

---

## 🔐 Authentication Integration

### JWT Token Flow
```javascript
// Frontend: Login Request
const loginUser = async (username, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  // Store token for future requests
  localStorage.setItem('token', data.token);
  return data;
};

// Backend: Token Generation
const generateToken = (user, databaseName) => {
  return jwt.sign(
    { 
      userId: user._id, 
      role: user.role, 
      databaseName 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Frontend: Authenticated Requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  return fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
};
```

### Multi-Tenant Authentication
```javascript
// Backend: Tenant Authentication Middleware
const tenantAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // Route to correct database based on role
  if (decoded.role === 'admin') {
    // Admin from master database
    const masterConnection = DatabaseManager.getMasterConnection();
    const AdminRegistry = masterConnection.model('AdminRegistry');
    req.user = await AdminRegistry.findById(decoded.userId);
  } else {
    // Teacher/Student from tenant database
    req.tenantModels = DatabaseManager.getTenantModels(decoded.databaseName);
    req.user = await req.tenantModels.User.findById(decoded.userId);
  }
  
  req.databaseName = decoded.databaseName;
  next();
};
```

---

## 🗄️ Database Integration Patterns

### Connection Management
```javascript
// Backend: Database Manager
class DatabaseManager {
  constructor() {
    this.connections = new Map();
    this.masterConnection = null;
  }

  // Singleton master connection
  getMasterConnection() {
    if (!this.masterConnection) {
      this.masterConnection = mongoose.createConnection(process.env.MONGODB_URI);
    }
    return this.masterConnection;
  }

  // Cached tenant connections
  getTenantConnection(databaseName) {
    if (!this.connections.has(databaseName)) {
      const tenantUri = this.buildTenantUri(databaseName);
      const connection = mongoose.createConnection(tenantUri);
      this.connections.set(databaseName, connection);
    }
    return this.connections.get(databaseName);
  }

  // Dynamic model creation
  getTenantModels(databaseName) {
    const connection = this.getTenantConnection(databaseName);
    return {
      User: connection.model('User', UserSchema),
      Class: connection.model('Class', ClassSchema),
      Schedule: connection.model('Schedule', ScheduleSchema),
      // ... other models
    };
  }
}
```

### Data Synchronization
```javascript
// Frontend: State Management Integration
const useApiData = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.request(endpoint);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Usage in components
const UserManagement = () => {
  const { data: users, loading, error, refetch } = useApiData('/users');
  const { dispatch } = useApp();

  useEffect(() => {
    if (users) {
      dispatch({ type: 'SET_USERS', payload: users });
    }
  }, [users, dispatch]);

  // Component logic...
};
```

---

## 📡 API Integration Patterns

### RESTful API Design
```javascript
// Frontend: API Service Class
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    this.token = localStorage.getItem('token');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Resource-specific methods
  async getUsers() { return this.request('/users'); }
  async createUser(userData) { 
    return this.request('/users', { 
      method: 'POST', 
      body: JSON.stringify(userData) 
    }); 
  }
  async updateUser(id, userData) { 
    return this.request(`/users/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(userData) 
    }); 
  }
}
```

### Error Handling Integration
```javascript
// Frontend: Global Error Handler
const GlobalErrorHandler = ({ children }) => {
  const handleError = (error, errorInfo) => {
    console.error('Global error:', error, errorInfo);
    
    // Send to logging service
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

// Backend: Centralized Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Database errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Authentication errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Default error
  res.status(500).json({ 
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

---

## 🔄 Real-Time Integration

### File Upload Integration
```javascript
// Frontend: File Upload Component
const FileUpload = ({ onUpload, accept, multiple = false }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files) => {
    setUploading(true);
    
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const result = await response.json();
      onUpload(result.filePaths);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <input
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={(e) => handleFileUpload(e.target.files)}
      disabled={uploading}
    />
  );
};

// Backend: File Upload Handler
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${uniqueName}-${file.originalname}`);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/upload', tenantAuth, upload.array('files', 5), (req, res) => {
  const filePaths = req.files.map(file => file.path);
  res.json({ filePaths });
});
```

### Real-Time Messaging Integration
```javascript
// Frontend: Message Polling
const useMessages = (userId) => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await apiService.getMessages(userId);
        setMessages(data);
        
        const unread = data.filter(msg => 
          !msg.isRead && msg.receiverId === currentUser.id
        ).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  return { messages, unreadCount };
};

// Backend: Message API
router.get('/messages/:userId', tenantAuth, async (req, res) => {
  try {
    const messages = await req.tenantModels.Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    }).sort({ timestamp: 1 });

    // Mark messages as read
    await req.tenantModels.Message.updateMany(
      { 
        senderId: req.params.userId, 
        receiverId: req.user._id, 
        isRead: false 
      },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});
```

---

## 📊 State Management Integration

### Context API Integration
```javascript
// Frontend: App Context Provider
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-sync with backend
  useEffect(() => {
    const syncData = async () => {
      if (state.currentUser) {
        try {
          // Fetch latest data based on user role
          if (state.currentUser.role === 'admin') {
            const [users, classes, schedules] = await Promise.all([
              apiService.getUsers(),
              apiService.getClasses(),
              apiService.getSchedules()
            ]);
            
            dispatch({ type: 'SET_USERS', payload: users });
            dispatch({ type: 'SET_CLASSES', payload: classes });
            dispatch({ type: 'SET_SCHEDULES', payload: schedules });
          }
        } catch (error) {
          console.error('Data sync failed:', error);
        }
      }
    };

    syncData();
  }, [state.currentUser]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// State reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        )
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      };
    default:
      return state;
  }
};
```

---

## 🔒 Security Integration

### CORS Configuration
```javascript
// Backend: CORS Setup
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://smartinsticrm.onrender.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Input Validation Integration
```javascript
// Frontend: Form Validation
const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validate = (fieldName, value) => {
    const rule = validationRules[fieldName];
    if (rule) {
      const error = rule(value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      return !error;
    }
    return true;
  };

  const handleChange = (fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    validate(fieldName, value);
  };

  return { values, errors, handleChange, validate };
};

// Backend: Validation Middleware
const validateUser = (req, res, next) => {
  const { username, password, role } = req.body;
  const errors = [];

  if (!username || username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (!['teacher', 'student'].includes(role)) {
    errors.push('Invalid role specified');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};
```

---

## 📈 Performance Integration

### Caching Strategy
```javascript
// Frontend: API Response Caching
class CachedApiService extends ApiService {
  constructor() {
    super();
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async request(endpoint, options = {}) {
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
    
    // Check cache for GET requests
    if (!options.method || options.method === 'GET') {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const data = await super.request(endpoint, options);

    // Cache successful GET responses
    if (!options.method || options.method === 'GET') {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }

    return data;
  }
}

// Backend: Response Compression
const compression = require('compression');
app.use(compression());

// Database query optimization
const getOptimizedUsers = async (req, res) => {
  try {
    const users = await req.tenantModels.User
      .find({ isActive: true })
      .select('-password -__v')
      .lean() // Return plain objects instead of Mongoose documents
      .limit(100)
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

---

## 🚀 Deployment Integration

### Environment Configuration
```javascript
// Frontend: Environment Variables
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  environment: process.env.NODE_ENV || 'development',
  version: process.env.REACT_APP_VERSION || '1.0.0'
};

// Backend: Environment Setup
require('dotenv').config();

const config = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});
```

### Health Monitoring Integration
```javascript
// Backend: Health Check Endpoint
router.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  };

  try {
    // Check database connectivity
    await DatabaseManager.getMasterConnection().db.admin().ping();
    health.database = 'connected';
  } catch (error) {
    health.status = 'unhealthy';
    health.database = 'disconnected';
    health.error = error.message;
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Frontend: Health Check Integration
const useHealthCheck = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setHealth(data);
      } catch (error) {
        setHealth({ status: 'error', message: error.message });
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return health;
};
```

This comprehensive integration architecture ensures seamless communication between all system components while maintaining security, performance, and scalability across the entire application stack.
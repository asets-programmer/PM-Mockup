# Frontend - Preventive Maintenance SPBU

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16.0 atau lebih tinggi
- npm 7.0 atau lebih tinggi
- Git

### **Installation**
```bash
# Clone repository
git clone <repository-url>
cd preventive-maintenance

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

---

## 🏗️ **Project Structure**

```
src/
├── components/              # Reusable UI components
│   ├── Navbar.jsx          # Navigation bar
│   ├── Sidebar.jsx         # Sidebar navigation
│   └── common/             # Common components
├── pages/                  # Page components
│   ├── dashboard/          # Dashboard page
│   ├── equipment/          # Equipment management
│   ├── work orders/        # Work order management
│   ├── Schedule/           # Schedule management
│   ├── Team/               # Team management
│   ├── reports/            # Reports & analytics
│   ├── notifications/      # Notifications
│   ├── Settings/           # Settings
│   └── proses flow/        # Process flow
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── services/               # API services
├── contexts/               # React contexts
├── assets/                 # Static assets
└── styles/                 # Global styles
```

---

## 🎨 **Design System**

### **Color Palette**
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Status Colors */
--success-500: #10b981;
--warning-500: #f59e0b;
--error-500: #ef4444;
--info-500: #06b6d4;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;
```

### **Typography Scale**
```css
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
```

### **Spacing System**
```css
/* Spacing Scale */
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-6: 1.5rem;       /* 24px */
--space-8: 2rem;         /* 32px */
```

---

## 🔧 **Component Guidelines**

### **Component Structure**
```jsx
import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';

const ComponentName = ({ prop1, prop2 }) => {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Event logic
  };
  
  // Render
  return (
    <div className="component-wrapper">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### **Naming Conventions**
- **Components**: PascalCase (e.g., `EquipmentCard`)
- **Files**: PascalCase (e.g., `PageEquipment.jsx`)
- **Variables**: camelCase (e.g., `equipmentData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### **Props Validation**
```jsx
import PropTypes from 'prop-types';

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  prop3: PropTypes.arrayOf(PropTypes.object),
};
```

---

## 📱 **Responsive Design**

### **Breakpoints**
```css
/* Tailwind CSS Breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Tablets */
lg: 1024px   /* Laptops */
xl: 1280px   /* Desktops */
2xl: 1536px  /* Large screens */
```

### **Mobile-First Approach**
```jsx
// Example responsive component
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
  {/* Content */}
</div>
```

---

## 🔌 **API Integration**

### **API Service Structure**
```jsx
// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### **API Usage Example**
```jsx
// services/equipmentService.js
import api from './api';

export const equipmentService = {
  // Get all equipment
  getAll: () => api.get('/equipment'),
  
  // Get equipment by ID
  getById: (id) => api.get(`/equipment/${id}`),
  
  // Create new equipment
  create: (data) => api.post('/equipment', data),
  
  // Update equipment
  update: (id, data) => api.put(`/equipment/${id}`, data),
  
  // Delete equipment
  delete: (id) => api.delete(`/equipment/${id}`),
};
```

---

## 🎯 **State Management**

### **Local State (useState)**
```jsx
const [equipment, setEquipment] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### **Global State (Context)**
```jsx
// contexts/AppContext.js
import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  equipment: [],
  workOrders: [],
  loading: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_EQUIPMENT':
      return { ...state, equipment: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

---

## 🧪 **Testing**

### **Unit Testing Setup**
```jsx
// __tests__/EquipmentCard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import EquipmentCard from '../components/EquipmentCard';

describe('EquipmentCard', () => {
  const mockEquipment = {
    id: 'EQ-001',
    name: 'Test Equipment',
    status: 'Normal',
    health: 95,
  };

  it('renders equipment information correctly', () => {
    render(<EquipmentCard equipment={mockEquipment} />);
    
    expect(screen.getByText('Test Equipment')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });
});
```

### **Testing Commands**
```bash
npm test                    # Run tests
npm run test:coverage      # Run tests with coverage
npm run test:watch         # Run tests in watch mode
```

---

## 🚀 **Build & Deployment**

### **Environment Variables**
```bash
# .env.development
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development

# .env.production
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
```

### **Build Process**
```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### **Deployment to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

---

## 🔍 **Code Quality**

### **ESLint Configuration**
```json
{
  "extends": [
    "eslint:recommended",
    "@vitejs/plugin-react/recommended"
  ],
  "rules": {
    "react/prop-types": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": "error"
  }
}
```

### **Pre-commit Hooks**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "git add"
    ]
  }
}
```

---

## 📚 **Best Practices**

### **Performance**
- Use `React.memo()` for expensive components
- Implement `useMemo()` and `useCallback()` for expensive calculations
- Lazy load components with `React.lazy()`
- Optimize images and assets

### **Accessibility**
- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios

### **Security**
- Sanitize user inputs
- Use HTTPS for API calls
- Implement proper authentication
- Avoid storing sensitive data in localStorage

### **Code Organization**
- Keep components small and focused
- Use custom hooks for reusable logic
- Separate concerns (UI, business logic, data)
- Maintain consistent file structure

---

## 🐛 **Debugging**

### **React Developer Tools**
- Install React Developer Tools browser extension
- Use Profiler for performance debugging
- Inspect component state and props

### **Console Debugging**
```jsx
// Debug state changes
useEffect(() => {
  console.log('State changed:', state);
}, [state]);

// Debug API calls
const fetchData = async () => {
  try {
    console.log('Fetching data...');
    const response = await api.get('/equipment');
    console.log('Data received:', response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
```

---

## 📖 **Documentation**

### **Component Documentation**
```jsx
/**
 * EquipmentCard component displays equipment information
 * @param {Object} equipment - Equipment data object
 * @param {string} equipment.id - Equipment ID
 * @param {string} equipment.name - Equipment name
 * @param {string} equipment.status - Equipment status
 * @param {number} equipment.health - Health score (0-100)
 * @param {Function} onEdit - Edit button click handler
 * @param {Function} onDelete - Delete button click handler
 */
const EquipmentCard = ({ equipment, onEdit, onDelete }) => {
  // Component implementation
};
```

### **API Documentation**
- Document all API endpoints
- Include request/response examples
- Specify error codes and messages
- Maintain API versioning

---

## 🔄 **Version Control**

### **Git Workflow**
```bash
# Feature branch
git checkout -b feature/equipment-management
git add .
git commit -m "feat: add equipment management functionality"
git push origin feature/equipment-management

# Create pull request
# After review and approval, merge to main
```

### **Commit Message Convention**
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

---

*Dokumen ini akan terus diupdate seiring dengan perkembangan proyek.*

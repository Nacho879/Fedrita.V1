import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster.jsx';
import AppRoutes from '@/navigation/AppRoutes.jsx';
import ScrollToHashElement from '@/components/ScrollToHashElement.jsx';
import { IAProvider } from '@/hooks/useIA.jsx';
import { DemoProvider } from '@/hooks/useDemo.jsx';

function App() {
  return (
    <DemoProvider>
      <AuthProvider>
        <IAProvider>
          <Router>
            <ScrollToHashElement />
            <div className="App">
              <AppRoutes />
              <Toaster />
            </div>
          </Router>
        </IAProvider>
      </AuthProvider>
    </DemoProvider>
  );
}

export default App;
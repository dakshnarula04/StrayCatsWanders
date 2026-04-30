import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { Layout } from './components/layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import JournalPage from './pages/JournalPage';
import { ContactPage } from './pages/ContactPage';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * Main Application component.
 * Sets up routing and global theme management.
 */
function App() {
  // Initialize theme at the top level to ensure dark mode class is applied immediately
  useTheme();

  return (
    <ErrorBoundary>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route 
            path="*" 
            element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-serif text-forest-900 dark:text-linen-50">404</h1>
                  <p className="mt-4 text-stone-500 dark:text-stone-400">Page not found</p>
                </div>
              </div>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

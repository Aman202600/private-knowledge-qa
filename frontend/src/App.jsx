import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';

// Lazy loading pages for performance
const Home = lazy(() => import('./pages/Home'));
const Upload = lazy(() => import('./pages/Upload'));
const Query = lazy(() => import('./pages/Query'));
const Status = lazy(() => import('./pages/Status'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          } />
          <Route path="upload" element={
            <Suspense fallback={<PageLoader />}>
              <Upload />
            </Suspense>
          } />
          <Route path="query" element={
            <Suspense fallback={<PageLoader />}>
              <Query />
            </Suspense>
          } />
          <Route path="status" element={
            <Suspense fallback={<PageLoader />}>
              <Status />
            </Suspense>
          } />
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

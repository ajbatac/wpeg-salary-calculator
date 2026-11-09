import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from '@/react-app/pages/Home';
import ChangelogPage from '@/react-app/pages/Changelog';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
      </Routes>
    </BrowserRouter>
  );
}

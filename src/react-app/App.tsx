import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from '@/react-app/pages/Home';
import ChangelogPage from '@/react-app/pages/Changelog';
import ChartPage from '@/react-app/pages/Chart';
import SiteFooter from '@/react-app/components/SiteFooter';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/chart" element={<ChartPage />} />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  );
}

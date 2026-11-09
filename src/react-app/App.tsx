import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from '@/react-app/pages/Home';
import ChangelogPage from '@/react-app/pages/Changelog';
import ChartPage from '@/react-app/pages/Chart';
import NotFoundPage from '@/react-app/pages/NotFound';
import SiteFooter from '@/react-app/components/SiteFooter';
import BackToTop from '@/react-app/components/BackToTop';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
      <BackToTop />
    </BrowserRouter>
  );
}

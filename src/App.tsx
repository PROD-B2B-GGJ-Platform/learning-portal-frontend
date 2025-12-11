import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CourseCatalog from './pages/CourseCatalog';
import MyLearning from './pages/MyLearning';
import Certifications from './pages/Certifications';
import Skills from './pages/Skills';
import Mentorship from './pages/Mentorship';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<CourseCatalog />} />
          <Route path="my-learning" element={<MyLearning />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="skills" element={<Skills />} />
          <Route path="mentorship" element={<Mentorship />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


// App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import BookDashboard from './components/BookDashboard';
import BookDetail from './components/BookDetail';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Routes>
        <Route path="/" element={<BookDashboard />} />
        <Route path="/book/:bookKey" element={<BookDetail />} />
      </Routes>
    </div>
  );
}

export default App;

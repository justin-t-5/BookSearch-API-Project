// components/Sidebar.jsx
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div style={{ padding: '10px', background: '#f0f0f0' }}>
    <Link to="/">📚 Book Dashboard</Link>
  </div>
);

export default Sidebar;

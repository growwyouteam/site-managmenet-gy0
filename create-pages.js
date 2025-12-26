const fs = require('fs');
const path = require('path');

// Admin pages templates
const adminPages = {
  'MachineCategory.jsx': `import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const MachineCategory = () => {
  const { category } = useParams();
  const [machines, setMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', quantity: '', assignedSite: '', status: 'available', remarks: '' });

  useEffect(() => {
    fetchMachines();
  }, [category]);

  const fetchMachines = async () => {
    try {
      const res = await api.get(\`/admin/machines?category=\${category}\`);
      setMachines(res.data.data || []);
    } catch (error) {
      showToast('Failed to load machines', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/machines', { ...formData, category });
      showToast('Machine added successfully', 'success');
      setShowForm(false);
      setFormData({ name: '', quantity: '', assignedSite: '', status: 'available', remarks: '' });
      fetchMachines();
    } catch (error) {
      showToast('Failed to add machine', 'error');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ textTransform: 'capitalize' }}>{category} Machines</h1>
      <button onClick={() => setShowForm(!showForm)} style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        {showForm ? 'Cancel' : 'Add Machine'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '10px' }}>
          <input type="text" placeholder="Machine Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input type="text" placeholder="Assigned Site (optional)" value={formData.assignedSite} onChange={(e) => setFormData({...formData, assignedSite: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input type="text" placeholder="Remarks" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Machine</button>
        </form>
      )}

      <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '10px' }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Quantity</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Assigned Site</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {machines.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{m.name}</td>
                <td style={{ padding: '12px' }}>{m.quantity}</td>
                <td style={{ padding: '12px' }}>{m.assignedSite || 'None'}</td>
                <td style={{ padding: '12px' }}>{m.status}</td>
                <td style={{ padding: '12px' }}>{m.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MachineCategory;`,

  'Stock.jsx': `import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ projectId: '', materialName: '', unit: '', quantity: '', remarks: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stockRes, projRes] = await Promise.all([
        api.get('/admin/stocks'),
        api.get('/admin/projects')
      ]);
      setStocks(stockRes.data.data || []);
      setProjects(projRes.data.data || []);
    } catch (error) {
      showToast('Failed to load data', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stocks', formData);
      showToast('Stock added successfully', 'success');
      setShowForm(false);
      setFormData({ projectId: '', materialName: '', unit: '', quantity: '', remarks: '' });
      fetchData();
    } catch (error) {
      showToast('Failed to add stock', 'error');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Stock Management</h1>
      <button onClick={() => setShowForm(!showForm)} style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        {showForm ? 'Cancel' : 'Add Stock'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '10px' }}>
          <select value={formData.projectId} onChange={(e) => setFormData({...formData, projectId: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="text" placeholder="Material Name" value={formData.materialName} onChange={(e) => setFormData({...formData, materialName: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input type="text" placeholder="Unit (kg/ltr/bags)" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input type="text" placeholder="Remarks" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Stock</button>
        </form>
      )}

      <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '10px' }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Project</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Material</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Quantity</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Unit</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{s.projectId}</td>
                <td style={{ padding: '12px' }}>{s.materialName}</td>
                <td style={{ padding: '12px' }}>{s.quantity}</td>
                <td style={{ padding: '12px' }}>{s.unit}</td>
                <td style={{ padding: '12px' }}>{s.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;`,

  'Projects.jsx': `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', startDate: '', endDate: '', budget: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/admin/projects');
      setProjects(res.data.data || []);
    } catch (error) {
      showToast('Failed to load projects', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/projects', formData);
      showToast('Project created successfully', 'success');
      setShowForm(false);
      setFormData({ name: '', location: '', startDate: '', endDate: '', budget: '', description: '' });
      fetchProjects();
    } catch (error) {
      showToast('Failed to create project', 'error');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Projects</h1>
      <button onClick={() => setShowForm(!showForm)} style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        {showForm ? 'Cancel' : 'Create Project'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '10px' }}>
          <input type="text" placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input type="date" placeholder="Start Date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input type="date" placeholder="End Date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input type="number" placeholder="Budget" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px', minHeight: '80px' }} />
          <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Create Project</button>
        </form>
      )}

      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {projects.map(p => (
          <Link key={p.id} to={\`/admin/projects/\${p.id}\`} style={{ textDecoration: 'none', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>{p.name}</h3>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>📍 {p.location}</p>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '10px' }}>Budget: ₹{p.budget?.toLocaleString()}</p>
            <span style={{ display: 'inline-block', marginTop: '10px', padding: '4px 12px', background: p.status === 'running' ? '#d1fae5' : '#dbeafe', color: p.status === 'running' ? '#065f46' : '#1e40af', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{p.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;`
};

// Create admin pages
// const adminDir = path.join(__dirname, 'frontend', 'src', 'pages', 'Admin');
// if (!fs.existsSync(adminDir)) {
//   fs.mkdirSync(adminDir, { recursive: true });
// }

// Object.entries(adminPages).forEach(([filename, content]) => {
//   fs.writeFileSync(path.join(adminDir, filename), content);
//   console.log(\`Created \${filename}\`);
// });

console.log('Admin pages created successfully!');
  
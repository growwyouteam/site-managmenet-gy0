import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const Transfer = () => {
  const [transfers, setTransfers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [labours, setLabours] = useState([]);
  const [machines, setMachines] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [labEquipments, setLabEquipments] = useState([]);
  const [consumableGoods, setConsumableGoods] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: 'labour', itemId: '', fromProject: '', toProject: '', quantity: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transfersRes, projectsRes, laboursRes, machinesRes, stocksRes, labEquipmentsRes, consumableGoodsRes, equipmentsRes] = await Promise.all([
        api.get('/admin/transfers'),
        api.get('/admin/projects'),
        api.get('/admin/labours'),
        api.get('/admin/machines'),
        api.get('/admin/stocks'),
        api.get('/admin/lab-equipments'),
        api.get('/admin/consumable-goods'),
        api.get('/admin/equipments')
      ]);

      if (transfersRes.data.success) {
        setTransfers(transfersRes.data.data);
      }

      if (projectsRes.data.success) {
        setProjects(projectsRes.data.data);
        if (projectsRes.data.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            fromProject: prev.fromProject || projectsRes.data.data[0]._id,
            toProject: prev.toProject || projectsRes.data.data[0]._id
          }));
        }
      }

      if (laboursRes.data.success) {
        setLabours(laboursRes.data.data);
        if (laboursRes.data.data.length > 0 && formData.type === 'labour') {
          setFormData(prev => ({ ...prev, itemId: prev.itemId || laboursRes.data.data[0]._id }));
        }
      }

      if (machinesRes.data.success) {
        setMachines(machinesRes.data.data);
        if (machinesRes.data.data.length > 0 && formData.type === 'machine') {
          setFormData(prev => ({ ...prev, itemId: prev.itemId || machinesRes.data.data[0]._id }));
        }
      }

      if (stocksRes.data.success) {
        setStocks(stocksRes.data.data);
        if (stocksRes.data.data.length > 0 && formData.type === 'stock') {
          setFormData(prev => ({ ...prev, itemId: prev.itemId || stocksRes.data.data[0]._id }));
        }
      }

      if (labEquipmentsRes.data.success) {
        setLabEquipments(labEquipmentsRes.data.data);
      }

      if (consumableGoodsRes.data.success) {
        setConsumableGoods(consumableGoodsRes.data.data);
      }

      if (equipmentsRes.data.success) {
        setEquipments(equipmentsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await api.post('/admin/transfers', formData);
      if (response.data.success) {
        showToast('Transfer completed', 'success');
        setShowForm(false);
        setFormData({ type: 'labour', itemId: '', fromProject: projects[0]?._id || '', toProject: projects[0]?._id || '', quantity: 1 });
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to create transfer', 'error');
      console.error('Error creating transfer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Resource Transfer</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        {showForm ? 'Cancel' : 'New Transfer'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="labour">👷 Labour</option>
                <option value="machine">🚜 Machine</option>
                <option value="stock">📦 Stock</option>
                <option value="lab-equipment">🧪 Lab Test Equipment</option>
                <option value="consumable-goods">🛒 Consumable Goods</option>
                <option value="equipment">🔧 Equipment</option>
              </select>
            </div>
            {formData.type === 'labour' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Labour</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Labour</option>
                  {labours.map(l => <option key={l._id} value={l._id}>{l.name} - {l.designation || 'Labour'}</option>)}
                </select>
              </div>
            )}
            {formData.type === 'machine' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Machine/Equipment</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Machine</option>
                  {machines.map(m => <option key={m._id} value={m._id}>{m.name} ({m.category || 'N/A'}) - {m.status || 'Available'}</option>)}
                </select>
              </div>
            )}
            {formData.type === 'stock' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Stock Item</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Stock</option>
                  {stocks.map(s => <option key={s._id} value={s._id}>{s.materialName} ({s.quantity} {s.unit})</option>)}
                </select>
              </div>
            )}
            {formData.type === 'lab-equipment' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Lab Equipment</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Lab Equipment</option>
                  {labEquipments.map(e => <option key={e._id} value={e._id}>{e.name} - {e.projectId?.name || 'N/A'}</option>)}
                </select>
              </div>
            )}
            {formData.type === 'consumable-goods' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Consumable Goods</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Consumable Goods</option>
                  {consumableGoods.map(c => <option key={c._id} value={c._id}>{c.name} ({c.quantity} {c.unit}) - {c.projectId?.name || 'N/A'}</option>)}
                </select>
              </div>
            )}
            {formData.type === 'equipment' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Equipment</label>
                <select
                  value={formData.itemId}
                  onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Equipment</option>
                  {equipments.map(e => <option key={e._id} value={e._id}>{e.name} - {e.projectId?.name || 'N/A'}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Project *</label>
              <select
                value={formData.fromProject}
                onChange={(e) => setFormData({ ...formData, fromProject: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select From Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name} ({p.location})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Project *</label>
              <select
                value={formData.toProject}
                onChange={(e) => setFormData({ ...formData, toProject: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select To Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name} ({p.location})</option>)}
              </select>
            </div>
            {(formData.type === 'stock' || formData.type === 'machine') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) || 1 })}
                  min="1"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-5 px-6 py-2.5 text-white rounded-lg transition-colors font-medium flex items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
            {isSubmitting ? 'Processing...' : 'Transfer'}
          </button>
        </form>
      )}

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Transfer History</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-3">
          {transfers.map(t => (
            <div key={t._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">
                {t.type === 'labour' && '👷 '}
                {t.type === 'machine' && '🚜 '}
                {t.type === 'stock' && '📦 '}
                {t.type?.charAt(0).toUpperCase() + t.type?.slice(1)} Transfer
              </div>
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Item:</span> {t.itemName || 'N/A'}</div>
                <div><span className="font-medium">From:</span> {typeof t.fromProject === 'object' ? t.fromProject?.name : t.fromProject}</div>
                <div><span className="font-medium">To:</span> {typeof t.toProject === 'object' ? t.toProject?.name : t.toProject}</div>
                {t.quantity && <div><span className="font-medium">Quantity:</span> {t.quantity}</div>}
                <div><span className="font-medium">Status:</span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    t.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {t.status}
                  </span>
                </div>
                <div><span className="font-medium">Date:</span> {new Date(t.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">From</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">To</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(t => (
                <tr key={t._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {t.type === 'labour' && '👷 '}
                    {t.type === 'machine' && '🚜 '}
                    {t.type === 'stock' && '📦 '}
                    {t.type?.charAt(0).toUpperCase() + t.type?.slice(1)}
                  </td>
                  <td className="px-4 py-3">{t.itemName || 'N/A'}</td>
                  <td className="px-4 py-3">{typeof t.fromProject === 'object' ? t.fromProject?.name : t.fromProject}</td>
                  <td className="px-4 py-3">{typeof t.toProject === 'object' ? t.toProject?.name : t.toProject}</td>
                  <td className="px-4 py-3">{t.quantity || '1'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      t.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transfer;

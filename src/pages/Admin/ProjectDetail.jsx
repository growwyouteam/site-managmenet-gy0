import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);

      // Validate ID before making API call
      if (!id || id === 'undefined') {
        showToast('Invalid project ID', 'error');
        setData(null);
        setLoading(false);
        return;
      }

      // Make all API calls in parallel for better performance
      const [projectResponse, stocksResponse, machinesResponse] = await Promise.all([
        api.get(`/admin/projects/${id}`),
        api.get('/admin/stocks'),
        api.get('/admin/machines')
      ]);

      if (!projectResponse.data.success) {
        setData(null);
        setLoading(false);
        showToast(projectResponse.data.error || 'Failed to fetch project details', 'error');
        return;
      }

      const projectData = projectResponse.data.data;

      // Filter stocks and machines for this project
      const projectStocks = stocksResponse.data.success
        ? stocksResponse.data.data.filter(stock => stock.projectId === id)
        : [];

      const projectMachines = machinesResponse.data.success
        ? machinesResponse.data.data.filter(machine => machine.projectId === id)
        : [];

      setData({
        project: projectData.project,
        expenses: projectData.expenses || [],
        stocks: projectStocks,
        machines: projectMachines,
        labours: projectData.labours || []
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project:', error);
      showToast('Failed to load project details', 'error');
      setData(null);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-8 text-center text-gray-500">
      <p>Loading project details...</p>
    </div>
  );

  if (!data) return (
    <div className="p-8 text-center text-gray-500">
      <p>Project not found.</p>
      <Link to="/admin/projects" className="text-blue-500 font-medium">Back to Projects</Link>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{data.project.name}</h1>
      <p className="text-gray-600 mt-2">📍 {data.project.location}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Budget</h3>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">₹{data.project.budget?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Expenses</h3>
          <p className="text-2xl md:text-3xl font-bold text-red-600">₹{data.project.expenses?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Labours</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-600">{data.labours?.length || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Stock Items</h3>
          <p className="text-2xl md:text-3xl font-bold text-orange-600">{data.stocks?.length || 0}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Project Manager</h2>
        {data.manager ? (
          <p className="text-gray-700">{data.manager.name} - {data.manager.email}</p>
        ) : (
          <p className="text-gray-400">No manager assigned</p>
        )}
      </div>

      {/* Active Machines Section */}
      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Machines ({data.machines?.length || 0})</h2>
        {data.machines && data.machines.length > 0 ? (
          <div className="space-y-3">
            {data.machines.map(machine => (
              <div key={machine._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{machine.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {machine.model && `Model: ${machine.model}`}
                      {machine.plateNumber && ` | Plate: ${machine.plateNumber}`}
                      {machine.category && ` | Category: ${machine.category}`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${machine.status === 'in-use' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {machine.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Quantity: {machine.quantity}
                  {machine.assignedAsRental && (
                    <span className="ml-3 text-purple-600 font-semibold">Rental: ₹{machine.assignedRentalPerDay}/day</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No machines assigned to this project</p>
        )}
      </div>

      {/* Stock Items Section */}
      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Stock Items ({data.stocks?.length || 0})</h2>
        {data.stocks && data.stocks.length > 0 ? (
          <div className="space-y-3">
            {data.stocks.map(stock => (
              <div key={stock._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{stock.materialName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {stock.vendorId?.name && `Vendor: ${stock.vendorId.name}`}
                      {stock.remarks && ` | Remarks: ${stock.remarks}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{stock.totalPrice?.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{stock.quantity} {stock.unit} × ₹{stock.unitPrice}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Added: {new Date(stock.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No stock items for this project</p>
        )}
      </div>

      {/* Labours Section */}
      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Labours ({data.labours?.length || 0})</h2>
        {data.labours && data.labours.length > 0 ? (
          <div className="space-y-3">
            {data.labours.map(labour => (
              <div key={labour._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{labour.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {labour.designation && `Designation: ${labour.designation}`}
                      {labour.phone && ` | Phone: ${labour.phone}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">₹{labour.dailyWage}/day</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${labour.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {labour.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Enrolled: {new Date(labour.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No labours assigned to this project</p>
        )}
      </div>

      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Expenses</h2>
        {data.expenses && data.expenses.length > 0 ? (
          <>
            {/* Mobile View */}
            <div className="block md:hidden space-y-3">
              {data.expenses.slice(0, 5).map(e => (
                <div key={e._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-medium text-gray-900">{e.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="font-bold text-green-600">₹{e.amount?.toLocaleString()}</div>
                    <div>{new Date(e.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenses.slice(0, 5).map(e => (
                    <tr key={e._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">{e.name}</td>
                      <td className="px-4 py-3 font-bold text-green-600">₹{e.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3">{new Date(e.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-400">No expenses recorded</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;

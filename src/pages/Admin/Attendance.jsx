import { useState, useEffect } from 'react';
import api from '../../services/api';
import { showToast } from '../../components/Toast';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);
  const [labours, setLabours] = useState([]);
  const [labourAttendance, setLabourAttendance] = useState([]);
  const [projects, setProjects] = useState([]);
  const [walletAllocations, setWalletAllocations] = useState([]);

  // Filter states
  const [filterType, setFilterType] = useState('managers'); // 'managers' or 'labour'
  const [searchQuery, setSearchQuery] = useState('');

  // Detail modal state
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [personAttendanceDetails, setPersonAttendanceDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attendanceRes, usersRes, laboursRes, labourAttendanceRes, projectsRes] = await Promise.all([
        api.get('/admin/attendance'),
        api.get('/admin/users'),
        api.get('/admin/labours'),
        api.get('/admin/labour-attendance'),
        api.get('/admin/projects'),
        api.get('/admin/accounts')
      ]);

      if (attendanceRes.data.success) {
        setAttendance(attendanceRes.data.data);
      }

      if (usersRes.data.success) {
        setUsers(usersRes.data.data.filter(u => u.role === 'sitemanager'));
      }

      if (laboursRes.data.success) {
        setLabours(laboursRes.data.data);
      }

      if (labourAttendanceRes.data.success) {
        setLabourAttendance(labourAttendanceRes.data.data);
      }

      if (projectsRes.data.success) {
        setProjects(projectsRes.data.data);
      }

      // Extract wallet allocations from accounts data
      const accountsRes = await Promise.all([
        api.get('/admin/accounts'),
        api.get('/admin/projects'),
        api.get('/admin/labour-attendance'),
        api.get('/admin/users'),
        api.get('/admin/labours')
      ]);

      if (accountsRes[0].data.success) {
        const transactions = accountsRes[0].data.data.transactions || [];
        const allocations = transactions.filter(t => t.category === 'wallet_allocation');
        setWalletAllocations(allocations);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to load attendance data', 'error');
    }
  };

  // Calculate attendance percentage
  const calculateAttendancePercentage = (userId) => {
    const userAttendance = attendance.filter(att => att.userId === userId || att.userId?._id === userId);
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentDay = today.getDate();

    const attendanceDays = userAttendance.filter(att => {
      const attDate = new Date(att.date);
      return attDate >= startOfMonth && attDate <= today;
    }).length;

    return ((attendanceDays / currentDay) * 100).toFixed(1);
  };

  // Calculate labour attendance percentage
  const calculateLabourAttendancePercentage = (labourId) => {
    const labAttendance = labourAttendance.filter(att =>
      (att.labourId === labourId || att.labourId?._id === labourId) && att.status === 'present'
    );
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentDay = today.getDate();

    const attendanceDays = labAttendance.filter(att => {
      const attDate = new Date(att.date);
      return attDate >= startOfMonth && attDate <= today;
    }).length;

    return ((attendanceDays / currentDay) * 100).toFixed(1);
  };

  // Calculate total salary based on attendance
  const calculateTotalSalary = (user) => {
    const percentage = parseFloat(calculateAttendancePercentage(user._id));
    const monthlySalary = user.salary || 0;
    return Math.round((monthlySalary * percentage) / 100);
  };

  // Calculate labour total wage
  const calculateLabourTotalWage = (labour) => {
    const labAttendance = labourAttendance.filter(att =>
      (att.labourId === labour._id || att.labourId?._id === labour._id) && att.status === 'present'
    );
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const daysWorked = labAttendance.filter(att => {
      const attDate = new Date(att.date);
      return attDate >= startOfMonth && attDate <= today;
    }).length;

    return daysWorked * (labour.dailyWage || 0);
  };

  // Calculate total paid to manager
  const calculateTotalPaid = (managerId) => {
    const managerAllocations = walletAllocations.filter(allocation => {
      const desc = allocation.description || '';
      const manager = users.find(u => u._id === managerId);
      if (!manager) return false;
      return desc.toLowerCase().includes(manager.name.toLowerCase());
    });
    return managerAllocations.reduce((sum, allocation) => sum + (allocation.amount || 0), 0);
  };

  // Handle view details
  const handleViewDetails = async (person, type) => {
    setSelectedPerson({ ...person, type });
    setShowDetailModal(true);
    setLoadingDetails(true);

    try {
      if (type === 'manager') {
        // Fetch manager attendance details
        const managerAttendance = attendance.filter(att =>
          att.userId === person._id || att.userId?._id === person._id
        );

        // Enrich with project names
        const enrichedAttendance = managerAttendance.map(att => {
          const project = projects.find(p => p._id === att.projectId || p._id === att.projectId?._id);
          return {
            ...att,
            projectName: project?.name || 'Unknown Project',
            projectLocation: project?.location || '-',
            markedByName: person.name, // Self-marked
            date: att.date,
            time: att.time
          };
        });

        setPersonAttendanceDetails(enrichedAttendance);
      } else {
        // Fetch labour attendance details
        const labAttendance = labourAttendance.filter(att =>
          att.labourId === person._id || att.labourId?._id === person._id
        );

        // Enrich with project and manager names
        const enrichedAttendance = labAttendance.map(att => {
          const project = projects.find(p => p._id === (att.projectId?._id || att.projectId));
          const manager = users.find(u => u._id === (att.markedBy?._id || att.markedBy));

          return {
            ...att,
            projectName: att.projectId?.name || project?.name || 'Unknown Project',
            projectLocation: att.projectId?.location || project?.location || '-',
            markedByName: att.markedBy?.name || manager?.name || 'Unknown Manager',
            date: att.date,
            time: att.createdAt
          };
        });

        setPersonAttendanceDetails(enrichedAttendance);
      }
    } catch (error) {
      console.error('Error fetching attendance details:', error);
      showToast('Failed to load attendance details', 'error');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filter data based on search query
  const getFilteredData = () => {
    const data = filterType === 'managers' ? users : labours;
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(item =>
      item.name.toLowerCase().includes(query) ||
      (item.email && item.email.toLowerCase().includes(query)) ||
      (item.phone && item.phone.toLowerCase().includes(query))
    );
  };

  const filteredData = getFilteredData();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Attendance Management</h1>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="managers">Site Managers</option>
              <option value="labour">Labour Workers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {filterType === 'managers' ? 'Site Managers' : 'Labour Workers'}
        </h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          {filteredData.map(item => (
            <div key={item._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-bold text-gray-900 mb-2">{item.name}</div>
              <div className="text-sm space-y-1">
                {filterType === 'managers' ? (
                  <>
                    <div><span className="font-medium">Email:</span> {item.email}</div>
                    <div><span className="font-medium">Phone:</span> {item.phone || 'N/A'}</div>
                    <div><span className="font-medium">Monthly Salary:</span> ₹{item.salary?.toLocaleString()}</div>
                    <div><span className="font-medium">Attendance:</span> {calculateAttendancePercentage(item._id)}%</div>
                    <div><span className="font-medium">Total Salary:</span> <span className="text-green-600 font-bold">₹{calculateTotalSalary(item).toLocaleString()}</span></div>
                    <div><span className="font-medium">Total Paid:</span> <span className="text-blue-600 font-bold">₹{calculateTotalPaid(item._id).toLocaleString()}</span></div>
                  </>
                ) : (
                  <>
                    <div><span className="font-medium">Phone:</span> {item.phone}</div>
                    <div><span className="font-medium">Designation:</span> {item.designation}</div>
                    <div><span className="font-medium">Daily Wage:</span> ₹{item.dailyWage?.toLocaleString()}</div>
                    <div><span className="font-medium">Attendance:</span> {calculateLabourAttendancePercentage(item._id)}%</div>
                    <div><span className="font-medium">Total Wage:</span> <span className="text-green-600 font-bold">₹{calculateLabourTotalWage(item).toLocaleString()}</span></div>
                  </>
                )}
              </div>
              <button
                onClick={() => handleViewDetails(item, filterType === 'managers' ? 'manager' : 'labour')}
                className="mt-3 w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
              >
                👁️ View Details
              </button>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">No records found</div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                {filterType === 'managers' ? (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Monthly Salary</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Attendance %</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Salary</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Paid</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Designation</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Daily Wage</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Attendance %</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Wage</th>
                  </>
                )}
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  {filterType === 'managers' ? (
                    <>
                      <td className="px-4 py-3">{item.email}</td>
                      <td className="px-4 py-3">{item.phone || 'N/A'}</td>
                      <td className="px-4 py-3">₹{item.salary?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                          {calculateAttendancePercentage(item._id)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-green-600">₹{calculateTotalSalary(item).toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">₹{calculateTotalPaid(item._id).toLocaleString()}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">{item.phone}</td>
                      <td className="px-4 py-3">{item.designation}</td>
                      <td className="px-4 py-3">₹{item.dailyWage?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                          {calculateLabourAttendancePercentage(item._id)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-green-600">₹{calculateLabourTotalWage(item).toLocaleString()}</td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewDetails(item, filterType === 'managers' ? 'manager' : 'labour')}
                      className="px-3 py-1.5 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                      title="View Details"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={filterType === 'managers' ? 7 : 7} className="px-4 py-8 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Detail Modal */}
      {showDetailModal && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-0 max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedPerson.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedPerson.type === 'manager' ? 'Site Manager' : 'Labour Worker'} - Attendance Details
                </p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>

            {/* Person Info */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedPerson.type === 'manager' ? (
                  <>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{selectedPerson.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{selectedPerson.phone || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Monthly Salary</div>
                      <div className="font-medium">₹{selectedPerson.salary?.toLocaleString()}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{selectedPerson.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Designation</div>
                      <div className="font-medium">{selectedPerson.designation}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Daily Wage</div>
                      <div className="font-medium">₹{selectedPerson.dailyWage?.toLocaleString()}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Attendance Records */}
            <div className="flex-1 overflow-y-auto p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Attendance Records</h4>

              {loadingDetails ? (
                <div className="text-center py-8 text-gray-500">Loading attendance details...</div>
              ) : personAttendanceDetails.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No attendance records found</div>
              ) : (
                <div className="space-y-3">
                  {personAttendanceDetails.map((record, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-gray-500">Site/Project</div>
                          <div className="font-medium text-gray-900">{record.projectName}</div>
                          {record.projectLocation && record.projectLocation !== '-' && (
                            <div className="text-xs text-gray-600">📍 {record.projectLocation}</div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Marked By</div>
                          <div className="font-medium text-gray-900">{record.markedByName}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Date</div>
                          <div className="font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Time</div>
                          <div className="font-medium text-gray-900">
                            {new Date(record.time || record.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        {record.status && (
                          <div>
                            <div className="text-xs text-gray-500">Status</div>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'half' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {record.status.toUpperCase()}
                            </span>
                          </div>
                        )}
                        {record.remarks && (
                          <div className="md:col-span-2">
                            <div className="text-xs text-gray-500">Remarks</div>
                            <div className="text-sm text-gray-700">{record.remarks}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../components/Toast';
import api from '../../services/api';

const MachineCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [assignProjectId, setAssignProjectId] = useState('');
  const [assignToContractor, setAssignToContractor] = useState(false);
  const [assignAsRental, setAssignAsRental] = useState(false);
  const [rentalAmount, setRentalAmount] = useState(0);
  const [rentalType, setRentalType] = useState('perDay');
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    plateNumber: '',
    quantity: '',
    status: 'available',
    ownershipType: 'own',
    vendorName: '',
    machineCategory: '',
    machinePhoto: '',
    perDayExpense: 0,
    projectId: ''
  });
  const [editingMachine, setEditingMachine] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMachines();
    fetchProjects();
    fetchContractors();
  }, [category]);

  const fetchMachines = async () => {
    try {
      const response = await api.get('/admin/machines');
      if (response.data.success) {
        const filteredMachines = response.data.data.filter(m => m.category === category);
        const machinesWithProjects = filteredMachines.map((machine) => {
          // If status is 'available', always show 'Not Assigned'
          if (machine.status === 'available') {
            return {
              ...machine,
              projectName: 'Not Assigned',
              projectLocation: '-'
            };
          }
          // Otherwise, check if projectId exists
          if (machine.projectId && machine.projectId.name) {
            return {
              ...machine,
              projectName: machine.projectId.name,
              projectLocation: machine.projectId.location
            };
          } else {
            return {
              ...machine,
              projectName: 'Not Assigned',
              projectLocation: '-'
            };
          }
        });
        setMachines(machinesWithProjects);
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
      showToast('Failed to fetch machines', 'error');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/admin/projects');
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchContractors = async () => {
    try {
      const response = await api.get('/admin/contractors');
      if (response.data.success) {
        setContractors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching contractors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast(`Please enter ${isConsumable ? 'item' : 'machine'} name`, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newMachine = {
        ...formData,
        category,
        quantity: isConsumable ? formData.quantity : Number(formData.quantity) || 1,
        status: isConsumable ? 'available' : formData.status
      };

      const response = await api.post('/admin/machines', newMachine);
      if (response.data.success) {
        showToast(`${isConsumable ? 'Consumable item' : isEquipment ? 'Equipment' : 'Machine'} added successfully`, 'success');
        setShowForm(false);
        setFormData({ name: '', model: '', plateNumber: '', quantity: '', status: 'available', ownershipType: 'own', vendorName: '', machineCategory: '', machinePhoto: '', perDayExpense: 0, projectId: '' });
        fetchMachines();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.errors
        ? `Validation failed: ${error.response.data.errors.map(e => e.message || e).join(', ')}`
        : error.response?.data?.error || `Failed to add ${isConsumable ? 'item' : 'machine'}`;
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
    setFormData({
      name: machine.name,
      model: machine.model || '',
      plateNumber: machine.plateNumber || '',
      quantity: machine.quantity,
      status: machine.status,
      ownershipType: machine.ownershipType || 'own',
      vendorName: machine.vendorName || '',
      machineCategory: machine.machineCategory || '',
      machinePhoto: machine.machinePhoto || '',
      perDayExpense: machine.perDayExpense || 0,
      projectId: machine.projectId?._id || machine.projectId || ''
    });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingMachine) return;
    if (!formData.name.trim()) {
      showToast(`Please enter ${isConsumable ? 'item' : 'machine'} name`, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedMachine = {
        ...formData,
        category,
        quantity: isConsumable ? formData.quantity : Number(formData.quantity) || 1,
        status: isConsumable ? 'available' : formData.status
      };

      const response = await api.put(`/admin/machines/${editingMachine._id}`, updatedMachine);
      if (response.data.success) {
        showToast(`${isConsumable ? 'Consumable item' : isEquipment ? 'Equipment' : 'Machine'} updated successfully`, 'success');
        setShowForm(false);
        setEditingMachine(null);
        setFormData({ name: '', model: '', plateNumber: '', quantity: '', status: 'available', ownershipType: 'own', vendorName: '', machineCategory: '', machinePhoto: '', perDayExpense: 0, projectId: '' });
        fetchMachines();
      }
    } catch (error) {
      showToast(error.response?.data?.error || `Failed to update ${isConsumable ? 'item' : 'machine'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignMachine = async () => {
    if (!assignProjectId) {
      showToast('Please select a project or contractor', 'error');
      return;
    }
    if (assignAsRental && (!rentalAmount || rentalAmount <= 0)) {
      showToast(`Please enter valid rental ${rentalType === 'perDay' ? 'per day' : 'per hour'} amount`, 'error');
      return;
    }

    try {
      const updateData = {
        status: 'in-use',
        assignedAsRental: assignAsRental,
        assignedRentalPerDay: assignAsRental ? Number(rentalAmount) : 0,
        rentalType: assignAsRental ? rentalType : 'perDay',
        assignedAt: new Date().toISOString()
      };

      // Check if assigning to contractor or project
      if (assignToContractor) {
        updateData.assignedToContractor = assignProjectId;
        updateData.projectId = null;
      } else {
        updateData.projectId = assignProjectId;
        updateData.assignedToContractor = null;
      }

      const response = await api.put(`/admin/machines/${selectedMachine._id}`, updateData);
      if (response.data.success) {
        showToast('Machine assigned successfully', 'success');
        setShowAssignModal(false);
        setSelectedMachine(null);
        setAssignProjectId('');
        setAssignToContractor(false);
        setAssignAsRental(false);
        setRentalAmount(0);
        setRentalType('perDay');
        fetchMachines();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to assign machine', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this machine?')) return;
    try {
      const response = await api.delete(`/admin/machines/${id}`);
      if (response.data.success) {
        showToast('Machine deleted', 'success');
        fetchMachines();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete machine', 'error');
    }
  };

  const handleReturn = async (machine) => {
    const confirmMsg = `Return ${machine.name}?\n\nThis will:\n- Calculate total rental cost\n- Update machine status to "Returned"\n- Create expense entry automatically`;

    if (!confirm(confirmMsg)) return;

    try {
      const response = await api.post(`/admin/machines/${machine._id}/return`);
      if (response.data.success) {
        const { rentalDetails } = response.data.data;
        showToast(
          `Machine returned! Total rent: ₹${rentalDetails.totalRent} (${rentalDetails.days} days @ ₹${rentalDetails.perDayRate}/day)`,
          'success'
        );
        fetchMachines();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to return machine', 'error');
    }
  };


  const handleViewDetails = (machine) => {
    setSelectedMachine(machine);
    setShowDetailModal(true);
  };

  const handleOpenAssignModal = (machine) => {
    if (machine.status === 'in-use' || machine.status === 'maintenance') {
      showToast(`Cannot assign machine in "${machine.status}" status`, 'error');
      return;
    }
    setSelectedMachine(machine);
    setShowAssignModal(true);
  };

  const categoryNames = {
    big: 'Big Machines',
    lab: 'Lab Equipment',
    consumables: 'Consumable Goods',
    equipment: 'Equipment'
  };

  const handlePhotoUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, machinePhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const isLabEquipment = category === 'lab';
  const isConsumable = category === 'consumables';
  const isEquipment = category === 'equipment';
  const isBigMachine = category === 'big';

  // Get contractor name for a machine
  const getContractorName = (machine) => {
    if (!machine.assignedToContractor) return null;
    const contractorId = typeof machine.assignedToContractor === 'object'
      ? machine.assignedToContractor._id
      : machine.assignedToContractor;
    const contractor = contractors.find(c => c._id === contractorId);
    return contractor?.name || 'Unknown Contractor';
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/admin/machines')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
      >
        ← Back
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{categoryNames[category] || category}</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        {showForm ? 'Cancel' : `Add ${isConsumable ? 'Consumable Item' : isEquipment ? 'Equipment' : isLabEquipment ? 'Equipment' : 'Machine'}`}
      </button>

      {showForm && (
        <form onSubmit={editingMachine ? handleUpdate : handleSubmit} className="mt-5 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipment Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isConsumable ? 'Item Name' : isEquipment ? 'Equipment Name' : isLabEquipment ? 'Equipment Name' : 'Machine Name'}
              </label>
              <input
                type="text"
                placeholder={isConsumable ? "e.g., Cement, Steel Rods" : isEquipment ? "e.g., Drill Machine, Hammer" : isLabEquipment ? "e.g., Concrete Tester" : "e.g., JCB, Crane"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Ownership Type - Show for Equipment and Big Machines, not for Lab or Consumables */}
            {(isEquipment || isBigMachine) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ownership Type</label>
                <select
                  value={formData.ownershipType}
                  onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="own">Own</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
            )}

            {/* Model - Hide for Equipment */}
            {!isConsumable && !isEquipment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model/Brand</label>
                <input
                  type="text"
                  placeholder="Model Number or Brand"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Plate Number - Only for Big Machines */}
            {isBigMachine && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g., DL-01-AB-1234"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Equipment Category - Show for Equipment */}
            {isEquipment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Category</label>
                <input
                  type="text"
                  placeholder="e.g., Power Tools, Hand Tools"
                  value={formData.machineCategory}
                  onChange={(e) => setFormData({ ...formData, machineCategory: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Machine Category - Only for Big Machines */}
            {isBigMachine && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Machine Category</label>
                <input
                  type="text"
                  placeholder="e.g., Excavator, Crane, Mixer"
                  value={formData.machineCategory}
                  onChange={(e) => setFormData({ ...formData, machineCategory: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Vendor fields for rented equipment */}
            {(isEquipment || isBigMachine) && formData.ownershipType === 'rented' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                  <input
                    type="text"
                    placeholder="Enter vendor name"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Per Day Expense (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter daily rental cost"
                    value={formData.perDayExpense}
                    onChange={(e) => setFormData({ ...formData, perDayExpense: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Equipment Photo */}
            {(isEquipment || isBigMachine || isLabEquipment) && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isEquipment ? 'Equipment Photo' : 'Machine Photo'}
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.machinePhoto && formData.machinePhoto.startsWith('data:') && (
                    <div className="mt-2">
                      <img src={formData.machinePhoto} alt="Preview" className="h-20 w-20 object-cover rounded border" />
                      <p className="text-xs text-green-600 mt-1">✓ Photo uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isConsumable ? 'Quantity (with unit)' : 'Quantity'}
              </label>
              <input
                type={isConsumable ? "text" : "number"}
                placeholder={isConsumable ? "e.g., 100 bags, 50 kg" : "Quantity"}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            {!isConsumable && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="in-use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            )}

            {/* Project Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Project (Optional)</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-5 px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (editingMachine ? 'Updating...' : 'Adding...') : (editingMachine ? `Update ${isEquipment ? 'Equipment' : 'Machine'}` : `Add ${isEquipment ? 'Equipment' : 'Machine'}`)}
          </button>
        </form>
      )}

      {/* Machines List */}
      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {isConsumable ? 'Consumable Goods List' : isLabEquipment ? 'Equipment List' : isEquipment ? 'Equipment List' : 'Machines List'}
        </h2>

        {/* Desktop View */}
        <div className="overflow-x-auto">
          {machines.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-lg font-semibold">No {isConsumable ? 'consumable items' : isLabEquipment ? 'equipment' : 'machines'} found</p>
              <p className="text-sm mt-2">Click "Add {isConsumable ? 'Consumable Item' : isEquipment ? 'Equipment' : 'Machine'}" above to get started</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  {!isEquipment && <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Model</th>}
                  {isBigMachine && <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Plate Number</th>}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assigned To</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {machines.map(m => {
                  const contractorName = getContractorName(m);
                  const canAssign = m.status !== 'in-use' && m.status !== 'maintenance';

                  return (
                    <tr key={m._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{m.name}</td>
                      {!isEquipment && <td className="px-4 py-3">{m.model || 'N/A'}</td>}
                      {isBigMachine && <td className="px-4 py-3">{m.plateNumber || 'N/A'}</td>}
                      <td className="px-4 py-3">
                        {contractorName ? (
                          <span className="text-purple-600 font-semibold">👷 {contractorName}</span>
                        ) : m.projectName !== 'Not Assigned' ? (
                          <span className="text-green-600 font-semibold">
                            {m.projectName}
                            {m.projectLocation !== '-' && <span className="text-xs text-gray-500 block">{m.projectLocation}</span>}
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{m.quantity}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${m.status === 'available' ? 'bg-green-100 text-green-800' :
                          m.status === 'in-use' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {m.status === 'available' ? '🟢 Available' : m.status === 'in-use' ? '🟡 In Use' : '🔴 Maintenance'}
                        </span>
                        {m.assignedAsRental && (
                          <div className="text-xs text-purple-600 mt-1">
                            Rental: ₹{m.assignedRentalPerDay}/{m.rentalType === 'perHour' ? 'hr' : 'day'}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(m)}
                            className="px-3 py-1.5 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleOpenAssignModal(m)}
                            className={`px-3 py-1.5 rounded text-sm ${canAssign
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            disabled={!canAssign}
                            title={canAssign ? 'Assign to Project' : `Cannot assign - ${m.status}`}
                          >
                            Assign
                          </button>
                          {/* Return button - only for rented machines in-use */}
                          {m.ownershipType === 'rented' && m.status === 'in-use' && (
                            <button
                              onClick={() => handleReturn(m)}
                              className="px-3 py-1.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                              title="Return rented machine"
                            >
                              Return
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(m)}
                            className="px-3 py-1.5 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(m._id)}
                            className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Assign Machine Modal */}
      {showAssignModal && selectedMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Machine</h3>
            <p className="text-gray-600 mb-4">Machine: <strong>{selectedMachine.name}</strong></p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!assignToContractor}
                    onChange={() => {
                      setAssignToContractor(false);
                      setAssignProjectId('');
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">Project</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={assignToContractor}
                    onChange={() => {
                      setAssignToContractor(true);
                      setAssignProjectId('');
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">Contractor</span>
                </label>
              </div>

              <select
                value={assignProjectId}
                onChange={(e) => setAssignProjectId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select {assignToContractor ? 'Contractor' : 'Project'}</option>
                {assignToContractor ? (
                  contractors.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))
                ) : (
                  projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))
                )}
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignAsRental}
                  onChange={(e) => setAssignAsRental(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Assign as Rental</span>
              </label>
            </div>

            {assignAsRental && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rental Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="perDay"
                        checked={rentalType === 'perDay'}
                        onChange={(e) => setRentalType(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">Per Day</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="perHour"
                        checked={rentalType === 'perHour'}
                        onChange={(e) => setRentalType(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">Per Hour</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Amount (₹/{rentalType === 'perDay' ? 'day' : 'hour'})
                  </label>
                  <input
                    type="number"
                    placeholder={`Enter rental cost ${rentalType === 'perDay' ? 'per day' : 'per hour'}`}
                    value={rentalAmount}
                    onChange={(e) => setRentalAmount(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAssignMachine}
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Assign
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedMachine(null);
                  setAssignProjectId('');
                  setAssignToContractor(false);
                  setAssignAsRental(false);
                  setRentalAmount(0);
                  setRentalType('perDay');
                }}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Machine Detail Modal */}
      {showDetailModal && selectedMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-0 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedMachine.name}</h3>
                <p className="text-sm text-gray-500">{categoryNames[category]} Details</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>

            <div className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                {selectedMachine.model && (
                  <div>
                    <div className="text-sm text-gray-500">Model</div>
                    <div className="font-medium">{selectedMachine.model}</div>
                  </div>
                )}
                {selectedMachine.plateNumber && (
                  <div>
                    <div className="text-sm text-gray-500">Plate Number</div>
                    <div className="font-medium">{selectedMachine.plateNumber}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500">Quantity</div>
                  <div className="font-medium">{selectedMachine.quantity}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="font-medium capitalize">{selectedMachine.status}</div>
                </div>
                {selectedMachine.ownershipType && (
                  <div>
                    <div className="text-sm text-gray-500">Ownership</div>
                    <div className="font-medium capitalize">{selectedMachine.ownershipType}</div>
                  </div>
                )}
              </div>

              {/* Assignment Info */}
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Assignment Information</h4>
                <div className="space-y-3">
                  {getContractorName(selectedMachine) ? (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-600 font-medium">Assigned to Contractor</div>
                      <div className="font-bold text-purple-900">👷 {getContractorName(selectedMachine)}</div>
                    </div>
                  ) : selectedMachine.projectName !== 'Not Assigned' ? (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">Assigned to Project</div>
                      <div className="font-bold text-green-900">{selectedMachine.projectName}</div>
                      {selectedMachine.projectLocation !== '-' && (
                        <div className="text-sm text-green-700">📍 {selectedMachine.projectLocation}</div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-gray-500">Not assigned to any project or contractor</div>
                    </div>
                  )}

                  {selectedMachine.assignedAt && (
                    <div>
                      <div className="text-sm text-gray-500">Assignment Date/Time</div>
                      <div className="font-medium">
                        {new Date(selectedMachine.assignedAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}

                  {selectedMachine.assignedAsRental && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-sm text-yellow-700 font-medium">Rental Information</div>
                      <div className="font-bold text-yellow-900">
                        ₹{selectedMachine.assignedRentalPerDay} / {selectedMachine.rentalType === 'perHour' ? 'Hour' : 'Day'}
                      </div>
                      <div className="text-xs text-yellow-700 mt-1">
                        This machine is generating rental income
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo */}
              {selectedMachine.machinePhoto && (
                <div className="border-t pt-4">
                  <h4 className="font-bold text-gray-900 mb-3">Photo</h4>
                  <img
                    src={selectedMachine.machinePhoto}
                    alt={selectedMachine.name}
                    className="w-full max-h-64 object-contain rounded-lg border"
                  />
                </div>
              )}
            </div>

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

export default MachineCategory;

import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css'

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    email: '',
    phone: '',
    department: '',
    date_of_joining: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const departments = ['HR', 'Engineering', 'Marketing', 'Finance'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.employee_id) newErrors.employee_id = 'Employee ID is required';
    else if (formData.employee_id.length > 10)
      newErrors.employee_id = 'Employee ID must be at most 10 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.date_of_joining)
      newErrors.date_of_joining = 'Date of joining is required';
    else if (new Date(formData.date_of_joining) > new Date())
      newErrors.date_of_joining = 'Date of joining cannot be in the future';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/employees', formData);
      setMessage(response.data);
      setFormData({
        name: '',
        employee_id: '',
        email: '',
        phone: '',
        department: '',
        date_of_joining: '',
        role: '',
      });
    } catch (error) {
      setMessage(error.response.data || 'Submission failed');
    }
  };

  return (
    <div className="container">
      <h1>Employee Management System</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <small>{errors.name}</small>}
        </div>
        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            value={formData.employee_id}
            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
          />
          {errors.employee_id && <small>{errors.employee_id}</small>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <small>{errors.email}</small>}
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {errors.phone && <small>{errors.phone}</small>}
        </div>
        <div>
          <label>Department:</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && <small>{errors.department}</small>}
        </div>
        <div>
          <label>Date of Joining:</label>
          <DatePicker
            selected={formData.date_of_joining ? new Date(formData.date_of_joining) : null}
            onChange={(date) =>
              setFormData({ ...formData, date_of_joining: date.toISOString().split('T')[0] })
            }
            maxDate={new Date()}
          />
          {errors.date_of_joining && <small>{errors.date_of_joining}</small>}
        </div>
        <div>
          <label>Role:</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          {errors.role && <small>{errors.role}</small>}
        </div>
        <button type="submit">Submit</button>
        <button type="reset" onClick={() => setFormData({})}>
          Reset
        </button>
      </form>
    </div>
  );
};

export default App;
app.js

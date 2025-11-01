import React, { useState } from 'react';
import { Patient, VaccinationStatus, VaccineType } from '../types';

interface PatientFormProps {
  onSubmit: (patient: Patient) => void;
  onCancel: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !email || !phone) {
        alert("Please fill in all fields.");
        return;
    }
    const newPatient: Patient = {
      id: `PAT-${Date.now()}`,
      name,
      age: parseInt(age),
      gender,
      email,
      phone,
      status: VaccinationStatus.NotVaccinated,
      vaccinationHistory: [],
    };
    onSubmit(newPatient);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-down">
      <h2 className="text-2xl font-semibold text-neutral mb-4">New Patient Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={e => setAge(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
                id="gender"
                value={gender}
                onChange={e => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
            <button
                type="button"
                onClick={onCancel}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                Save Patient
            </button>
        </div>
      </form>
    </div>
  );
};

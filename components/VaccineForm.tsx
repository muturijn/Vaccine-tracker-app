import React, { useState } from 'react';
import { Vaccine } from '../types';

interface VaccineFormProps {
  onSubmit: (vaccine: Vaccine) => void;
  onCancel: () => void;
}

export const VaccineForm: React.FC<VaccineFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [type, setType] = useState<'mRNA' | 'Viral Vector' | 'Inactivated Virus'>('mRNA');
  const [dosesRequired, setDosesRequired] = useState('2');
  const [efficacy, setEfficacy] = useState('95');
  const [inStock, setInStock] = useState('5000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !manufacturer || !dosesRequired || !efficacy || !inStock) {
        alert("Please fill in all fields.");
        return;
    }
    const newVaccine: Vaccine = {
      id: `VAC-${Date.now()}`,
      name,
      manufacturer,
      type,
      dosesRequired: parseInt(dosesRequired),
      efficacy: parseFloat(efficacy),
      inStock: parseInt(inStock),
    };
    onSubmit(newVaccine);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-down">
      <h2 className="text-2xl font-semibold text-neutral mb-4">New Vaccine Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="vaccine-name" className="block text-sm font-medium text-gray-700">Vaccine Name</label>
            <input
              type="text"
              id="vaccine-name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">Manufacturer</label>
            <input
              type="text"
              id="manufacturer"
              value={manufacturer}
              onChange={e => setManufacturer(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
           <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Vaccine Type</label>
            <select
                id="type"
                value={type}
                onChange={e => setType(e.target.value as 'mRNA' | 'Viral Vector' | 'Inactivated Virus')}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
                <option value="mRNA">mRNA</option>
                <option value="Viral Vector">Viral Vector</option>
                <option value="Inactivated Virus">Inactivated Virus</option>
            </select>
          </div>
          <div>
            <label htmlFor="dosesRequired" className="block text-sm font-medium text-gray-700">Doses Required</label>
            <input
              type="number"
              id="dosesRequired"
              value={dosesRequired}
              onChange={e => setDosesRequired(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="efficacy" className="block text-sm font-medium text-gray-700">Efficacy (%)</label>
            <input
              type="number"
              id="efficacy"
              value={efficacy}
              onChange={e => setEfficacy(e.target.value)}
              step="0.1"
              min="0"
              max="100"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
           <div>
            <label htmlFor="inStock" className="block text-sm font-medium text-gray-700">Initial Stock</label>
            <input
              type="number"
              id="inStock"
              value={inStock}
              onChange={e => setInStock(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
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
                Save Vaccine
            </button>
        </div>
      </form>
    </div>
  );
};
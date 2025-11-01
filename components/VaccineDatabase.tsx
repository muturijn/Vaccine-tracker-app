import React, { useState } from 'react';
import { Vaccine } from '../types';
import { VaccineForm } from './VaccineForm';

interface VaccineDatabaseProps {
  vaccines: Vaccine[];
  onAddVaccine: (vaccine: Vaccine) => void;
}

const getStockStatus = (stock: number): { text: string; color: string } => {
    if (stock < 500) return { text: 'Low', color: 'bg-error/20 text-error' };
    if (stock < 2000) return { text: 'Medium', color: 'bg-warning/20 text-yellow-700' };
    return { text: 'High', color: 'bg-success/20 text-success' };
};

export const VaccineDatabase: React.FC<VaccineDatabaseProps> = ({ vaccines, onAddVaccine }) => {
  const [showForm, setShowForm] = useState(false);
  
  const handleAddVaccine = (vaccine: Vaccine) => {
      onAddVaccine(vaccine);
      setShowForm(false);
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-neutral">Vaccine Database</h1>
         <button
          onClick={() => setShowForm(!showForm)}
          className="w-full md:w-auto bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {showForm ? 'Cancel' : 'Add New Vaccine'}
        </button>
      </div>

      {showForm && <VaccineForm onSubmit={handleAddVaccine} onCancel={() => setShowForm(false)} />}

       <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-base-300">
            <thead className="bg-base-200">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doses Req.</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficacy</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-base-200">
                {vaccines.length > 0 ? vaccines.map((vaccine) => {
                    const status = getStockStatus(vaccine.inStock);
                    return (
                        <tr key={vaccine.id} className="hover:bg-base-100">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{vaccine.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vaccine.manufacturer}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vaccine.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{vaccine.dosesRequired}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm w-48">
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${vaccine.efficacy}%` }}></div>
                                    </div>
                                    <span className="font-semibold text-primary w-12 text-right">{vaccine.efficacy}%</span>
                                </div>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{vaccine.inStock.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                                {status.text}
                                </span>
                            </td>
                        </tr>
                    );
                }) : (
                    <tr>
                        <td colSpan={7} className="text-center py-10 text-gray-500">
                            No vaccine data available.
                        </td>
                    </tr>
                )}
            </tbody>
          </table>
       </div>
    </div>
  );
};
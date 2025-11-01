import React from 'react';
import { Patient, VaccinationStatus } from '../types';

interface PatientListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  patients: Patient[];
}

const statusColorMap: Record<VaccinationStatus, string> = {
  [VaccinationStatus.FullyVaccinated]: 'bg-success/20 text-success',
  [VaccinationStatus.PartiallyVaccinated]: 'bg-warning/20 text-yellow-700',
  [VaccinationStatus.NotVaccinated]: 'bg-error/10 text-error',
};

export const PatientListModal: React.FC<PatientListModalProps> = ({ isOpen, onClose, title, patients }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{patients.length} patient(s) found</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto">
          {patients.length > 0 ? (
            <ul className="divide-y divide-base-200">
              {patients.map((patient) => (
                <li key={patient.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                    <p className="text-xs text-gray-500">{patient.email} | Age: {patient.age}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[patient.status]}`}>
                      {patient.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No patients match this criteria.</p>
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-50 flex justify-end rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

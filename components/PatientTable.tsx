import React from 'react';
import { Patient, VaccinationStatus, Vaccine, VaccinationRecord } from '../types';

interface PatientTableProps {
  patients: Patient[];
  vaccines: Vaccine[];
  onAdministerClick: (patient: Patient) => void;
}

const statusColorMap: Record<VaccinationStatus, string> = {
  [VaccinationStatus.FullyVaccinated]: 'bg-success/20 text-success',
  [VaccinationStatus.PartiallyVaccinated]: 'bg-warning/20 text-yellow-700',
  [VaccinationStatus.NotVaccinated]: 'bg-error/10 text-error',
};


export const PatientTable: React.FC<PatientTableProps> = ({ patients, vaccines, onAdministerClick }) => {

  const getVaccineSeriesDisplay = (patient: Patient) => {
    if (patient.vaccinationHistory.length === 0) {
      return <span className="text-gray-500">N/A</span>;
    }

    // Group vaccination records by vaccine name
    const historyByVaccine: { [key: string]: VaccinationRecord[] } = {};
    patient.vaccinationHistory.forEach(record => {
      if (!historyByVaccine[record.vaccineName]) {
        historyByVaccine[record.vaccineName] = [];
      }
      historyByVaccine[record.vaccineName].push(record);
    });

    return (
      <ul className="space-y-2">
        {Object.entries(historyByVaccine).map(([vaccineName, records]) => {
          const vaccineInfo = vaccines.find(v => v.name === vaccineName);
          const required = vaccineInfo ? vaccineInfo.dosesRequired : '?';
          return (
            <li key={vaccineName} className="text-xs">
              <div>
                <span className="font-semibold">{vaccineName}</span>
                <span className="text-gray-600"> ({records.length}/{required} doses)</span>
              </div>
              <ul className="pl-4 mt-1 space-y-0.5">
                {records
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((record, index) => (
                   <li key={`${record.date}-${index}`} className="text-gray-500">
                     Dose {index + 1}: {record.date}
                   </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-base-300">
        <thead className="bg-base-200">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Info</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccination History</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Dose Due</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-base-200">
          {patients.length > 0 ? patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-base-100">
              <td className="px-6 py-4 whitespace-nowrap align-top">
                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                <div className="text-xs text-gray-500">{patient.id}</div>
                <div className="text-xs text-gray-500 mt-1">{patient.email} | {patient.phone}</div>
                <div className="text-xs text-gray-500">Age: {patient.age}, {patient.gender}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap align-top">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[patient.status]}`}>
                  {patient.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                {getVaccineSeriesDisplay(patient)}
              </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 align-top">{patient.nextDoseDate || 'N/A'}</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-top">
                 <button 
                  onClick={() => onAdministerClick(patient)}
                  className="text-primary hover:text-primary-focus disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                 >
                   Administer Dose
                 </button>
               </td>
            </tr>
          )) : (
            <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                    No patients found.
                </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
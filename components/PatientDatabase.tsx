import React, { useState, useMemo } from 'react';
import { Patient, VaccinationStatus, VaccineType, Vaccine, VaccinationRecord } from '../types';
import { PatientForm } from './PatientForm';
import { PatientTable } from './PatientTable';
import { IssueVaccineModal } from './IssueVaccineModal';

interface PatientDatabaseProps {
  patients: Patient[];
  vaccines: Vaccine[];
  onAddPatient: (patient: Patient) => void;
  onAdministerVaccine: (patientId: string, newRecord: VaccinationRecord, nextDoseDate?: string) => void;
}

export const PatientDatabase: React.FC<PatientDatabaseProps> = ({ patients, vaccines, onAddPatient, onAdministerVaccine }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const patientsPerPage = 10;

  const filteredPatients = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(lowercasedTerm) ||
      patient.id.toLowerCase().includes(lowercasedTerm) ||
      patient.email.toLowerCase().includes(lowercasedTerm) ||
      patient.phone.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * patientsPerPage;
    return filteredPatients.slice(startIndex, startIndex + patientsPerPage);
  }, [filteredPatients, currentPage, patientsPerPage]);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handleAddPatient = (patient: Patient) => {
    onAddPatient(patient);
    setShowForm(false);
  };
  
  const handleOpenModal = (patient: Patient) => {
    setSelectedPatient(patient);
  };
  
  const handleConfirmVaccination = (patientId: string, newRecord: VaccinationRecord, nextDoseDate?: string) => {
    onAdministerVaccine(patientId, newRecord, nextDoseDate);
    setSelectedPatient(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-neutral">Patient Database</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full md:w-auto bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {showForm ? 'Cancel' : 'Add New Patient'}
        </button>
      </div>

      {showForm && <PatientForm onSubmit={handleAddPatient} onCancel={() => setShowForm(false)} />}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <input 
          type="text"
          placeholder="Search by name, ID, email, or phone..."
          value={searchTerm}
          onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
          }}
          className="w-full p-2 border border-base-300 rounded-md mb-4 focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <PatientTable patients={paginatedPatients} vaccines={vaccines} onAdministerClick={handleOpenModal} />
        {totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-base-200 rounded-md disabled:opacity-50 hover:bg-base-300"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-base-200 rounded-md disabled:opacity-50 hover:bg-base-300"
                >
                    Next
                </button>
            </div>
        )}
      </div>
      {selectedPatient && (
        <IssueVaccineModal 
            patient={selectedPatient}
            vaccines={vaccines}
            onConfirm={handleConfirmVaccination}
            onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};
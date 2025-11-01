import React, { useState, useMemo, useEffect } from 'react';
import { Patient, Vaccine, VaccinationRecord } from '../types';
import { findIncompleteVaccineSeries } from '../utils/vaccineUtils';

interface IssueVaccineModalProps {
    patient: Patient;
    vaccines: Vaccine[];
    onConfirm: (patientId: string, newRecord: VaccinationRecord, nextDoseDate?: string) => void;
    onClose: () => void;
}

type AdministerMode = 'completeSeries' | 'newSeries';

export const IssueVaccineModal: React.FC<IssueVaccineModalProps> = ({ patient, vaccines, onConfirm, onClose }) => {
    const availableVaccines = useMemo(() => vaccines.filter(v => v.inStock > 0), [vaccines]);
    const incompleteSeries = useMemo(() => findIncompleteVaccineSeries(patient.vaccinationHistory, vaccines), [patient, vaccines]);
    
    const [mode, setMode] = useState<AdministerMode>(incompleteSeries ? 'completeSeries' : 'newSeries');
    const [selectedVaccineId, setSelectedVaccineId] = useState<string>(availableVaccines[0]?.id || '');
    const [nextDoseDateInput, setNextDoseDateInput] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const { vaccineForAction, dosesAlreadyGiven } = useMemo(() => {
        if (mode === 'completeSeries' && incompleteSeries) {
            return { vaccineForAction: incompleteSeries.vaccine, dosesAlreadyGiven: incompleteSeries.dosesGiven };
        }
        if (mode === 'newSeries' && selectedVaccineId) {
            const vaccine = availableVaccines.find(v => v.id === selectedVaccineId);
            if (!vaccine) return { vaccineForAction: null, dosesAlreadyGiven: 0 };
            const dosesGiven = patient.vaccinationHistory.filter(r => r.vaccineId === selectedVaccineId).length;
            return { vaccineForAction: vaccine, dosesAlreadyGiven: dosesGiven };
        }
        return { vaccineForAction: null, dosesAlreadyGiven: 0 };
    }, [mode, incompleteSeries, selectedVaccineId, patient.vaccinationHistory, availableVaccines]);

    const needsNextDose = vaccineForAction ? (dosesAlreadyGiven + 1) < vaccineForAction.dosesRequired : false;
    
    useEffect(() => {
        if (mode === 'newSeries' && availableVaccines.length > 0 && !selectedVaccineId) {
            setSelectedVaccineId(availableVaccines[0].id);
        }
    }, [mode, availableVaccines, selectedVaccineId]);
    
    useEffect(() => {
        if (needsNextDose) {
            const date = new Date(today);
            date.setDate(date.getDate() + 28); // Default to 28 days
            setNextDoseDateInput(date.toISOString().split('T')[0]);
        } else {
            setNextDoseDateInput('');
        }
    }, [needsNextDose, today]);

    const handleConfirm = () => {
        if (!vaccineForAction) {
            alert("Please select a valid vaccine.");
            return;
        }

        const newRecord: VaccinationRecord = {
            vaccineId: vaccineForAction.id,
            vaccineName: vaccineForAction.name,
            date: today,
        };
        
        onConfirm(patient.id, newRecord, needsNextDose ? nextDoseDateInput : undefined);
    };

    const renderCompleteSeriesContent = () => {
        if (!incompleteSeries) return null;
        const { vaccine, dosesGiven } = incompleteSeries;
        return (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="font-semibold text-blue-800">Complete Existing Series</p>
                <p className="text-sm text-gray-700 mt-1">
                    Administering <span className="font-bold">Dose #{dosesGiven + 1}</span> of 
                    <span className="font-bold"> {vaccine.name}</span>.
                </p>
            </div>
        );
    }
    
    const renderNewSeriesContent = () => (
        <div>
            <label htmlFor="vaccine-select" className="block text-sm font-medium text-gray-700 mb-1">Select Vaccine for New Series</label>
            <select
                id="vaccine-select"
                value={selectedVaccineId}
                onChange={e => setSelectedVaccineId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
                {availableVaccines.map(v => (
                    <option key={v.id} value={v.id}>
                        {v.name} ({v.inStock.toLocaleString()} in stock)
                    </option>
                ))}
            </select>
            {availableVaccines.length === 0 && (
                <p className="text-xs text-red-500 mt-1">No vaccines currently in stock.</p>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-down">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-neutral">Administer Vaccine Dose</h2>
                    <p className="text-sm text-gray-500 mt-1">To: {patient.name} (ID: {patient.id})</p>
                </div>
                <div className="p-6 space-y-4">
                    <p><span className="font-semibold">Date of Administration:</span> {today}</p>
                    
                    {incompleteSeries && (
                         <div className="space-y-2">
                             <label className="flex items-center">
                                 <input type="radio" name="mode" value="completeSeries" checked={mode==='completeSeries'} onChange={() => setMode('completeSeries')} className="form-radio text-primary focus:ring-primary-focus" />
                                 <span className="ml-2 text-sm font-medium text-gray-700">Complete existing series</span>
                             </label>
                             <label className="flex items-center">
                                 <input type="radio" name="mode" value="newSeries" checked={mode==='newSeries'} onChange={() => setMode('newSeries')} className="form-radio text-primary focus:ring-primary-focus" />
                                 <span className="ml-2 text-sm font-medium text-gray-700">Start a new vaccine series / booster</span>
                             </label>
                         </div>
                    )}
                    
                    <div className="pt-2">{mode === 'completeSeries' ? renderCompleteSeriesContent() : renderNewSeriesContent()}</div>

                    {needsNextDose && (
                        <div>
                            <label htmlFor="next-dose-date" className="block text-sm font-medium text-gray-700">
                                Set Next Dose Date
                            </label>
                            <input
                                type="date"
                                id="next-dose-date"
                                value={nextDoseDateInput}
                                onChange={e => setNextDoseDateInput(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                min={today}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Provider-set due date for the patient's next dose.</p>
                        </div>
                    )}

                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-4 rounded-b-lg">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!vaccineForAction || (needsNextDose && !nextDoseDateInput)}
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
                    >
                        Confirm Administration
                    </button>
                </div>
            </div>
        </div>
    );
};
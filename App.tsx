import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientDatabase } from './components/PatientDatabase';
import { VaccineDatabase } from './components/VaccineDatabase';
import { Patient, DashboardStats, MockData, Vaccine, VaccinationStatus, VaccinationRecord } from './types';
import { generateMockData } from './services/geminiService';
import { getPatientStatus } from './utils/vaccineUtils';

type View = 'dashboard' | 'patients' | 'vaccines';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: MockData = await generateMockData();
      if(data.patients && data.dashboardStats && data.vaccines) {
        setPatients(data.patients);
        setDashboardStats(data.dashboardStats);
        setVaccines(data.vaccines);
      } else {
        setError("Failed to fetch valid data from the service.");
      }
    } catch (e) {
      setError("An unexpected error occurred while fetching data.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
    if (dashboardStats) {
      setDashboardStats(prev => prev ? ({ ...prev, totalPatients: prev.totalPatients + 1 }) : null);
    }
  };

  const addVaccine = (vaccine: Vaccine) => {
    setVaccines(prev => [vaccine, ...prev]);
    if (dashboardStats) {
        setDashboardStats(prev => {
            if (!prev) return null;
            // Avoid adding duplicates if a vaccine with the same name already exists in the stats
            if (prev.dosesByManufacturer.some(d => d.name === vaccine.name)) {
                return prev;
            }
            return {
                ...prev,
                dosesByManufacturer: [...prev.dosesByManufacturer, { name: vaccine.name, doses: 0 }],
            };
        });
    }
  };
  
  const handleAdministerVaccine = (patientId: string, newRecord: VaccinationRecord, nextDoseDateInput?: string) => {
    const patientToUpdate = patients.find(p => p.id === patientId);
    if (!patientToUpdate) return;

    const wasPreviouslyFullyVaccinated = patientToUpdate.status === VaccinationStatus.FullyVaccinated;
    
    const updatedHistory = [...patientToUpdate.vaccinationHistory, newRecord];
    const { status: newStatus } = getPatientStatus(updatedHistory, vaccines);
    const isNowFullyVaccinated = newStatus === VaccinationStatus.FullyVaccinated;

    setPatients(prevPatients =>
      prevPatients.map(p =>
        p.id === patientId
          ? { ...p, vaccinationHistory: updatedHistory, status: newStatus, nextDoseDate: nextDoseDateInput }
          : p
      )
    );

    setVaccines(prevVaccines =>
      prevVaccines.map(v => (v.id === newRecord.vaccineId ? { ...v, inStock: v.inStock - 1 } : v))
    );

    if (dashboardStats) {
      setDashboardStats(prev => {
        if (!prev) return null;

        const updatedDoses = prev.dosesByManufacturer.map(d =>
          d.name === newRecord.vaccineName ? { ...d, doses: d.doses + 1 } : d
        );

        // If the administered vaccine is new to the stats, add it.
        if (!updatedDoses.some(d => d.name === newRecord.vaccineName)) {
          updatedDoses.push({ name: newRecord.vaccineName, doses: 1 });
        }

        return {
          ...prev,
          totalDosesAdministered: prev.totalDosesAdministered + 1,
          fullyVaccinatedCount: (!wasPreviouslyFullyVaccinated && isNowFullyVaccinated)
            ? prev.fullyVaccinatedCount + 1
            : prev.fullyVaccinatedCount,
          dosesByManufacturer: updatedDoses,
        };
      });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-neutral font-semibold">Generating Mock Data with Gemini...</p>
          </div>
        </div>
      );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-md" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                    <p className="text-sm mt-2">Please check your Gemini API key and network connection.</p>
                     <button onClick={fetchData} className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-focus transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard stats={dashboardStats} allPatients={patients} />;
      case 'patients':
        return <PatientDatabase patients={patients} vaccines={vaccines} onAddPatient={addPatient} onAdministerVaccine={handleAdministerVaccine} />;
      case 'vaccines':
        return <VaccineDatabase vaccines={vaccines} onAddVaccine={addVaccine} />;
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="flex h-screen bg-base-200">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
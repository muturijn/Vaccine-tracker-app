import React, { useState } from 'react';
import { DashboardStats, Patient, VaccinationStatus } from '../types';
import { StatCard } from './StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PatientListModal } from './PatientListModal';

interface DashboardProps {
  stats: DashboardStats | null;
  allPatients: Patient[];
}

const COLORS = ['#0D9488', '#0891B2', '#6366F1', '#FBBF24'];

export const Dashboard: React.FC<DashboardProps> = ({ stats, allPatients }) => {
  const [modalContent, setModalContent] = useState<{ title: string; patients: Patient[] } | null>(null);

  if (!stats) {
    return <div className="text-center p-8">No dashboard data available.</div>;
  }

  const handleManufacturerClick = (data: { name: string }) => {
    if (!data || !data.name) return;
    const manufacturerName = data.name;
    const filteredPatients = allPatients.filter(p => 
        p.vaccinationHistory.some(record => record.vaccineName === manufacturerName)
    );
    setModalContent({
        title: `Patients Vaccinated with ${manufacturerName}`,
        patients: filteredPatients
    });
  };
  
  const handleStatusClick = (data: { name: string }) => {
    if (!data || !data.name) return;
    const statusName = data.name;
    let filteredPatients: Patient[] = [];

    if (statusName === 'Fully Vaccinated') {
        filteredPatients = allPatients.filter(p => p.status === VaccinationStatus.FullyVaccinated);
    } else { // 'Partially/Not Vaccinated'
        filteredPatients = allPatients.filter(p => p.status !== VaccinationStatus.FullyVaccinated);
    }

    setModalContent({
        title: `Patients: ${statusName}`,
        patients: filteredPatients
    });
  };

  const handleAgeGroupClick = (data: { ageGroup: string }) => {
    if (!data || !data.ageGroup) return;
    const ageGroup = data.ageGroup;
    const [minAgeStr, maxAgeStr] = ageGroup.replace('+', '').split('-');
    const minAge = parseInt(minAgeStr, 10);
    const maxAge = maxAgeStr ? parseInt(maxAgeStr, 10) : Infinity;

    const filteredPatients = allPatients.filter(p => p.age >= minAge && p.age <= maxAge);

    setModalContent({
        title: `Patients in Age Group ${ageGroup}`,
        patients: filteredPatients
    });
  };

  const fullyVaccinatedPercentage = stats.totalPatients > 0 
    ? ((stats.fullyVaccinatedCount / stats.totalPatients) * 100).toFixed(1) 
    : 0;

  const pieData = [
    { name: 'Fully Vaccinated', value: stats.fullyVaccinatedCount },
    { name: 'Partially/Not Vaccinated', value: stats.totalPatients - stats.fullyVaccinatedCount },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral">Vaccine Distribution Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Patients" value={stats.totalPatients.toLocaleString()} />
        <StatCard title="Doses Administered" value={stats.totalDosesAdministered.toLocaleString()} />
        <StatCard title="Fully Vaccinated" value={`${fullyVaccinatedPercentage}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-neutral mb-4">Doses by Manufacturer</h2>
          <p className="text-sm text-gray-500 -mt-2 mb-4">Click a bar to see patient details.</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.dosesByManufacturer} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} onClick={(payload) => payload && handleManufacturerClick(payload.activePayload?.[0]?.payload)}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip cursor={{fill: 'rgba(243, 244, 246, 0.5)'}} />
              <Legend />
              <Bar dataKey="doses" fill="#0D9488" className="cursor-pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-neutral mb-4">Vaccination Status</h2>
          <p className="text-sm text-gray-500 -mt-2 mb-4">Click a slice to see patient details.</p>
           <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label onClick={(data) => handleStatusClick(data)}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="cursor-pointer" />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-neutral mb-4">Vaccination Rate by Age Group</h2>
        <p className="text-sm text-gray-500 -mt-2 mb-4">Click a bar to see patient details.</p>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.vaccinationsByAgeGroup} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }} onClick={(payload) => payload && handleAgeGroupClick(payload.activePayload?.[0]?.payload)}>
                <XAxis type="number" hide />
                <YAxis dataKey="ageGroup" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip formatter={(value, name, props) => [`${((props.payload.vaccinated/props.payload.total)*100).toFixed(1)}%`, 'Vaccination Rate']} />
                <Legend formatter={(value, entry) => value === 'vaccinated' ? 'Vaccinated' : 'Total Population'} />
                <Bar dataKey="total" stackId="a" fill="#E5E7EB" name="Unvaccinated" className="cursor-pointer" />
                <Bar dataKey="vaccinated" stackId="a" fill="#0891B2" name="Vaccinated" className="cursor-pointer" />
            </BarChart>
        </ResponsiveContainer>
      </div>

      {modalContent && (
        <PatientListModal
            isOpen={!!modalContent}
            onClose={() => setModalContent(null)}
            title={modalContent.title}
            patients={modalContent.patients}
        />
      )}
    </div>
  );
};
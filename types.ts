export enum VaccineType {
  Pfizer = "Pfizer-BioNTech",
  Moderna = "Moderna",
  JohnsonAndJohnson = "Johnson & Johnson",
  AstraZeneca = "AstraZeneca",
  Sinovac = "Sinovac",
  SputnikV = "Sputnik V",
}

export enum VaccinationStatus {
  NotVaccinated = "Not Vaccinated",
  PartiallyVaccinated = "Partially Vaccinated",
  FullyVaccinated = "Fully Vaccinated",
}

export interface Vaccine {
    id: string;
    name: VaccineType | string;
    manufacturer: string;
    type: 'mRNA' | 'Viral Vector' | 'Inactivated Virus';
    dosesRequired: number;
    efficacy: number;
    inStock: number;
}

export interface VaccinationRecord {
    vaccineId: string;
    vaccineName: string;
    date: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  email: string;
  phone: string;
  status: VaccinationStatus;
  vaccinationHistory: VaccinationRecord[];
  nextDoseDate?: string;
}

export interface DosesByManufacturer {
    name: VaccineType | string;
    doses: number;
}

export interface VaccinationsByAgeGroup {
    ageGroup: string;
    vaccinated: number;
    total: number;
}

export interface DashboardStats {
    totalPatients: number;
    totalDosesAdministered: number;
    fullyVaccinatedCount: number;
    dosesByManufacturer: DosesByManufacturer[];
    vaccinationsByAgeGroup: VaccinationsByAgeGroup[];
}

export interface MockData {
    patients: Patient[];
    dashboardStats: DashboardStats;
    vaccines: Vaccine[];
}

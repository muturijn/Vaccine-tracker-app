import { VaccinationRecord, Vaccine, VaccinationStatus, Patient } from '../types';

interface IncompleteSeries {
    vaccine: Vaccine;
    dosesGiven: number;
}

/**
 * Finds the first incomplete vaccine series in a patient's history.
 */
export const findIncompleteVaccineSeries = (history: VaccinationRecord[], vaccines: Vaccine[]): IncompleteSeries | null => {
    if (!history || history.length === 0) return null;

    const seriesCount: { [key: string]: number } = {};
    history.forEach(record => {
        seriesCount[record.vaccineId] = (seriesCount[record.vaccineId] || 0) + 1;
    });

    for (const vaccineId in seriesCount) {
        const vaccine = vaccines.find(v => v.id === vaccineId);
        if (vaccine && seriesCount[vaccineId] < vaccine.dosesRequired) {
            return {
                vaccine,
                dosesGiven: seriesCount[vaccineId],
            };
        }
    }

    return null;
}

const getNextDoseDate = (doseDate: string): string => {
    const date = new Date(doseDate);
    date.setDate(date.getDate() + 28); // Add 28 days for the next dose
    return date.toISOString().split('T')[0];
}

/**
 * Calculates a patient's overall vaccination status based on their history.
 */
export const getPatientStatus = (history: VaccinationRecord[], vaccines: Vaccine[]): { status: VaccinationStatus, nextDoseDate?: string } => {
    if (!history || history.length === 0) {
        return { status: VaccinationStatus.NotVaccinated };
    }

    const incompleteSeries = findIncompleteVaccineSeries(history, vaccines);

    if (incompleteSeries) {
        const lastDoseOfIncompleteSeries = [...history].reverse().find(record => record.vaccineId === incompleteSeries.vaccine.id);
        return {
            status: VaccinationStatus.PartiallyVaccinated,
            nextDoseDate: lastDoseOfIncompleteSeries ? getNextDoseDate(lastDoseOfIncompleteSeries.date) : undefined,
        };
    }
    
    // If no incomplete series are found, they must be fully vaccinated for at least one series.
    return { status: VaccinationStatus.FullyVaccinated };
};

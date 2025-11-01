import { GoogleGenAI, Type } from "@google/genai";
import { MockData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const schema = {
  type: Type.OBJECT,
  properties: {
    patients: {
      type: Type.ARRAY,
      description: 'A list of 50 mock patients.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Unique identifier (e.g., UUID)' },
          name: { type: Type.STRING, description: 'Patient\'s full name' },
          age: { type: Type.INTEGER, description: 'Patient\'s age' },
          gender: { type: Type.STRING, description: 'Patient\'s gender (Male, Female, Other)' },
          email: { type: Type.STRING, description: 'Patient\'s email address' },
          phone: { type: Type.STRING, description: 'Patient\'s phone number' },
          status: { type: Type.STRING, description: 'Overall vaccination status (Not Vaccinated, Partially Vaccinated, Fully Vaccinated)' },
          vaccinationHistory: {
            type: Type.ARRAY,
            description: 'A history of all vaccine doses administered.',
            items: {
              type: Type.OBJECT,
              properties: {
                vaccineId: { type: Type.STRING, description: 'The ID of the administered vaccine.' },
                vaccineName: { type: Type.STRING, description: 'The name of the administered vaccine.' },
                date: { type: Type.STRING, description: 'Date of administration (YYYY-MM-DD).' },
              },
              required: ['vaccineId', 'vaccineName', 'date'],
            }
          },
          nextDoseDate: { type: Type.STRING, description: 'Recommended date for the next dose for any incomplete series (YYYY-MM-DD), null if not applicable' },
        },
        required: ['id', 'name', 'age', 'gender', 'email', 'phone', 'status', 'vaccinationHistory'],
      },
    },
    dashboardStats: {
        type: Type.OBJECT,
        properties: {
            totalPatients: { type: Type.INTEGER },
            totalDosesAdministered: { type: Type.INTEGER },
            fullyVaccinatedCount: { type: Type.INTEGER },
            dosesByManufacturer: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        doses: { type: Type.INTEGER }
                    },
                    required: ['name', 'doses']
                }
            },
            vaccinationsByAgeGroup: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        ageGroup: { type: Type.STRING },
                        vaccinated: { type: Type.INTEGER },
                        total: { type: Type.INTEGER }
                    },
                    required: ['ageGroup', 'vaccinated', 'total']
                }
            }
        },
        required: ['totalPatients', 'totalDosesAdministered', 'fullyVaccinatedCount', 'dosesByManufacturer', 'vaccinationsByAgeGroup']
    },
    vaccines: {
        type: Type.ARRAY,
        description: 'A list of 5 common vaccines.',
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING, description: 'Unique identifier for the vaccine' },
                name: { type: Type.STRING, description: 'Name of the vaccine' },
                manufacturer: { type: Type.STRING, description: 'Manufacturer of the vaccine' },
                type: { type: Type.STRING, description: 'Type of vaccine (e.g., mRNA, Viral Vector)' },
                dosesRequired: { type: Type.INTEGER, description: 'Number of doses required for full vaccination' },
                efficacy: { type: Type.NUMBER, description: 'Efficacy rate of the vaccine (e.g., 95.0)' },
                inStock: { type: Type.INTEGER, description: 'Number of doses currently in stock' },
            },
            required: ['id', 'name', 'manufacturer', 'type', 'dosesRequired', 'efficacy', 'inStock']
        }
    }
  },
  required: ['patients', 'dashboardStats', 'vaccines'],
};

export const generateMockData = async (): Promise<MockData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a realistic dataset for a vaccine tracking application. Include 50 diverse patients with contact details and a flexible vaccinationHistory array. Also include corresponding dashboard statistics and a list of 5 common vaccines with their details (including current stock levels). Some patients should have incomplete vaccination series.",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MockData;
  } catch (error) {
    console.error("Error generating mock data:", error);
    // Fallback to basic mock data in case of API failure
    return {
      patients: [],
      dashboardStats: {
        totalPatients: 0,
        totalDosesAdministered: 0,
        fullyVaccinatedCount: 0,
        dosesByManufacturer: [],
        vaccinationsByAgeGroup: [],
      },
      vaccines: [],
    };
  }
};

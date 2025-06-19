'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          header: 'FHIR Query Assistant',
          subtext: 'Ask me anything about patients (e.g., "Show me all cancer patients over 50")',
          placeholder: 'Enter a medical query...',
          submit: 'Submit',
          parsed: 'Parsed Query',
          response: 'FHIR Response',
          noInput: 'Please enter a query before submitting',
          connectionFail: 'Failed to connect to backend',
          name: 'Name',
          age: 'Age',
          condition: 'Condition',
          chartTitle: 'Distribution',
          ageDist: 'Age Distribution'
        }
      },
      es: {
        translation: {
          header: 'Asistente de Consulta FHIR',
          subtext: 'Hazme cualquier pregunta sobre pacientes (por ejemplo, "Muéstrame todos los pacientes con cáncer mayores de 50")',
          placeholder: 'Introduce una consulta médica...',
          submit: 'Enviar',
          parsed: 'Consulta Analizada',
          response: 'Respuesta FHIR',
          noInput: 'Por favor introduce una consulta antes de enviar',
          connectionFail: 'Error al conectar con el servidor',
          name: 'Nombre',
          age: 'Edad',
          condition: 'Condición',
          chartTitle: 'Distribución de Condiciones',
          ageDist: 'Distribución por Edad'
        }
      }
    }
  });

export default i18n;

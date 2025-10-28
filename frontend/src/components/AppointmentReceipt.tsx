// File: frontend/src/components/AppointmentReceipt.tsx

import React from 'react';
import { Doctor } from '../types'; // Assuming you have this type defined

interface ReceiptProps {
  appointmentId: string;
  patientName: string;
  doctor: Doctor;
  date: string;
  time: string;
  symptoms: string[];
}

// Using React.forwardRef to allow the parent component (Chatbot) to get a DOM reference to this component
const AppointmentReceipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
  ({ appointmentId, patientName, doctor, date, time, symptoms }, ref) => {
    
    // Helper to format date for display
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Helper to format time for display
    const formattedTime = (timeStr: string) => {
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h, 10);
        return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
    };

    return (
      // This div is what will be converted to a PDF. We pass the ref to it.
      <div ref={ref} className="p-8 bg-white text-gray-800 font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
        <header className="flex justify-between items-center pb-4 border-b-2 border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-teal-600">Appointment Confirmed</h1>
            <p className="text-gray-500">Your Health, Our Priority</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Receipt #{appointmentId.slice(-8)}</p>
            <p className="text-sm text-gray-500">Issued: {new Date().toLocaleDateString()}</p>
          </div>
        </header>

        <main className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Appointment Details</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="font-semibold">Patient Name:</div>
            <div>{patientName}</div>
            
            <div className="font-semibold">Doctor:</div>
            <div>{doctor.name} ({doctor.specialty})</div>
            
            <div className="font-semibold">Date:</div>
            <div>{new Date().toLocaleDateString()}</div>
            
            <div className="font-semibold">Time:</div>
            <div>{formattedTime(time)}</div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Symptoms / Issues Discussed</h3>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
              {symptoms.length > 0 ? (
                <ul className="list-disc pl-5">
                  {symptoms.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              ) : (
                <p>No specific symptoms were logged.</p>
              )}
            </div>
          </div>
        </main>

        <footer className="mt-12 pt-6 border-t-2 border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Billing Summary</h2>
            <div className="flex justify-between items-center text-sm mb-4">
                <p>Consultation Fee:</p>
                <p>₹{doctor.consultationFee.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-teal-600 p-4 bg-teal-50 rounded-lg">
                <p>Total Amount Due:</p>
                <p>₹{doctor.consultationFee.toFixed(2)}</p>
            </div>
             <p className="text-xs text-gray-500 mt-8 text-center">
                This is a computer-generated receipt. Please bring this with you to your appointment.
                <br />
                Thank you for choosing our services.
            </p>
        </footer>
      </div>
    );
  }
);

export default AppointmentReceipt;
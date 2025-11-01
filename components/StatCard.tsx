
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      <p className="text-4xl font-bold text-neutral mt-2">{value}</p>
    </div>
  );
};


import React from 'react';

interface DnaDisplayProps {
  strand: string;
}

const DnaDisplay: React.FC<DnaDisplayProps> = ({ strand }) => {
  const getBaseColor = (base: string) => {
    switch (base.toUpperCase()) {
      case 'A': return 'bg-red-500 text-red-100';
      case 'T': return 'bg-blue-500 text-blue-100';
      case 'G': return 'bg-green-500 text-green-100';
      case 'C': return 'bg-yellow-500 text-yellow-100';
      case 'U': return 'bg-orange-500 text-orange-100';
      default: return 'bg-slate-600 text-slate-100';
    }
  };

  return (
    <div className="flex justify-center gap-1 sm:gap-2 my-4 p-2 bg-slate-900/70 rounded-md">
      {strand.split('').map((base, index) => (
        <div key={index} className={`w-8 h-10 sm:w-10 sm:h-12 flex items-center justify-center font-bold text-lg sm:text-xl rounded-md transition-transform duration-300 hover:scale-110 ${getBaseColor(base)}`}>
          {base}
        </div>
      ))}
    </div>
  );
};

export default DnaDisplay;

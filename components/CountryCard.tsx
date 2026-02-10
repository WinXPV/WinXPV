
import React from 'react';
import { CountryBrief } from '../types';

interface Props {
  country: CountryBrief;
  onClick: (name: string) => void;
}

const CountryCard: React.FC<Props> = ({ country, onClick }) => {
  return (
    <div 
      onClick={() => onClick(country.name)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-slate-100 flex flex-col group"
    >
      <div className="h-40 bg-slate-50 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
        {country.flag}
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-slate-800 text-lg truncate">{country.name}</h3>
        <p className="text-slate-500 text-sm mt-1">{country.cca2}</p>
      </div>
    </div>
  );
};

export default CountryCard;

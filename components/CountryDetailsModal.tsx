
import React from 'react';
import { CountryDetails } from '../types';

interface Props {
  details: CountryDetails | null;
  loading: boolean;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="border-b border-slate-100 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="text-slate-800 font-semibold text-right">{value || 'N/A'}</span>
  </div>
);

const CountryDetailsModal: React.FC<Props> = ({ details, loading, onClose }) => {
  if (!details && !loading) return null;

  // We use the country name to generate a Google Maps embed URL
  const mapEmbedUrl = details?.name 
    ? `https://maps.google.com/maps?q=${encodeURIComponent(details.name)}&t=&z=5&ie=UTF8&iwloc=&output=embed`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-slate-800">
            {loading ? 'তথ্য লোড হচ্ছে...' : details?.name}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 font-medium">কৃত্রিম বুদ্ধিমত্তা তথ্য সংগ্রহ করছে...</p>
            </div>
          ) : details && (
            <div className="space-y-6">
              {/* Map Section */}
              <div className="w-full h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                 <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={mapEmbedUrl}
                    title={`${details.name} map`}
                 ></iframe>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <DetailItem label="মহাদেশ" value={details.continent} />
                <DetailItem label="রাজধানী" value={details.capital} />
                <DetailItem label="দাপ্তরিক ভাষা" value={details.language} />
                <DetailItem label="জনসংখ্যা (আনুমানিক)" value={details.population} />
                <DetailItem label="ধর্ম" value={details.religion} />
                <DetailItem label="আয়তন" value={details.area} />
                <DetailItem label="মুদ্রা" value={details.currency} />
                <DetailItem label="বিনিময় হার (BDT ও USD)" value={details.bdtExchangeRate} />
                <DetailItem label="দেশ কোড (ISO)" value={details.isoCode} />
                <DetailItem label="ডায়ালিং কোড" value={details.dialingCode} />
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-blue-500 pl-3">দেশের ইতিহাস</h4>
                <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line">
                  {details.history}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountryDetailsModal;


import React, { useState, useEffect, useMemo } from 'react';
import { CountryBrief, CountryDetails } from './types';
import CountryCard from './components/CountryCard';
import CountryDetailsModal from './components/CountryDetailsModal';
import { fetchCountryDetails } from './services/geminiService';

const App: React.FC = () => {
  const [countries, setCountries] = useState<CountryBrief[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetails, setSelectedDetails] = useState<CountryDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2,maps');
        const data = await response.json();
        const mapped: CountryBrief[] = data.map((c: any) => ({
          name: c.name.common,
          commonName: c.name.common,
          flag: c.flags.svg || '🌍',
          cca2: c.cca2,
          mapUrl: c.maps?.googleMaps || ''
        })).sort((a: CountryBrief, b: CountryBrief) => a.name.localeCompare(b.name));
        
        setCountries(mapped);
      } catch (error) {
        console.error("Error loading country list:", error);
      } finally {
        setIsLoadingList(false);
      }
    };
    loadCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cca2.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [countries, searchQuery]);

  const handleCountryClick = async (country: CountryBrief) => {
    setIsLoadingDetails(true);
    try {
      const details = await fetchCountryDetails(country.name);
      // Merge the official map URL from the brief into the AI generated details
      setSelectedDetails({
        ...details,
        mapUrl: country.mapUrl
      });
    } catch (error) {
      alert("দুঃখিত, তথ্য লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      console.error(error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 h-20 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 sm:py-0">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.65m2.475-1.27a11 11 0 01-1.45 1.754m-4.232-4.133a3 3 0 013.14-5.117" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              বিশ্বকোষ
            </h1>
          </div>

          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm text-slate-800 font-medium"
              placeholder="দেশের নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-transparent py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
            পৃথিবীর সব দেশ আপনার নখদর্পণে
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            মহাদেশ থেকে ইতিহাস, জনসংখ্যা থেকে মুদ্রা—একটি মাত্র ক্লিকেই জানুন বিশ্বের যেকোনো দেশের নির্ভরযোগ্য তথ্য।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        {isLoadingList ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">দেশের তালিকা তৈরি করা হচ্ছে...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {searchQuery ? `অনুসন্ধানের ফলাফল (${filteredCountries.length})` : `সব দেশ (${countries.length})`}
              </h3>
            </div>
            
            {filteredCountries.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
                {filteredCountries.map(country => (
                  <div key={country.cca2} className="flex">
                    <div className="w-full flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-slate-100 group" onClick={() => handleCountryClick(country)}>
                      <div className="h-28 bg-slate-100 overflow-hidden">
                        <img 
                          src={country.flag} 
                          alt={`${country.name} flag`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-center">
                        <p className="font-bold text-slate-800 text-sm leading-tight text-center">{country.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                <div className="text-5xl mb-4">🔍</div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">কোনো দেশ খুঁজে পাওয়া যায়নি</h4>
                <p className="text-slate-500">অনুগ্রহ করে সঠিক বানান দিয়ে আবার চেষ্টা করুন।</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <CountryDetailsModal 
        details={selectedDetails} 
        loading={isLoadingDetails} 
        onClose={() => {
          setSelectedDetails(null);
          setIsLoadingDetails(false);
        }} 
      />

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} বিশ্বকোষ - তথ্যের নির্ভুলতা নিশ্চিত করতে কৃত্রিম বুদ্ধিমত্তা ব্যবহৃত হয়েছে।
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <span className="text-slate-400 text-xs">ডাটা সোর্স: REST Countries API & Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

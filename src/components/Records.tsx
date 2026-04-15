import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle, Calendar, User, MapPin, Activity, ChevronRight, Search, Filter } from 'lucide-react';

interface AssessmentRecord {
  id: number;
  patient_name: string;
  patient_age: number;
  patient_phone: string;
  patient_region: string;
  patient_nation: string;
  risk_habits: any;
  risk_score: number;
  provisional_diagnosis: string;
  identified_lesions: string[];
  summary: string;
  created_at: string;
}

export function Records() {
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          throw new Error('The "assessments" table does not exist in your Supabase database. Please run the SQL schema provided in supabase_schema.sql in your Supabase SQL Editor.');
        }
        throw error;
      }
      setRecords(data || []);
    } catch (err: any) {
      console.error('Error fetching records:', err);
      setError(err.message || 'Failed to load records. Please check your Supabase connection and ensure the "assessments" table exists.');
    } finally {
      setLoading(false);
    }
  }

  const filteredRecords = records.filter(record => 
    record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.provisional_diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-zinc-500 font-medium">Loading clinical records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-red-900">Database Error</h3>
          <p className="text-red-700 text-sm max-w-md mx-auto">{error}</p>
        </div>
        <button 
          onClick={fetchRecords}
          className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight">Clinical Records</h2>
          <p className="text-zinc-500">History of all OPMD assessments performed.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchRecords}
            className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            title="Refresh records"
          >
            <Loader2 className={loading ? 'animate-spin' : ''} size={20} />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text"
              placeholder="Search patients or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="p-20 bg-white rounded-3xl border border-zinc-100 text-center space-y-4">
          <div className="w-16 h-16 bg-zinc-50 text-zinc-300 rounded-full flex items-center justify-center mx-auto">
            <Filter size={32} />
          </div>
          <p className="text-zinc-400 font-medium">No records found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRecords.map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:border-emerald-200 transition-all group cursor-pointer"
              onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    record.risk_score >= 7 ? 'bg-red-50 text-red-600' : 
                    record.risk_score >= 4 ? 'bg-orange-50 text-orange-600' : 
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    <Activity size={24} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{record.patient_name}</h3>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-zinc-100 rounded-full uppercase tracking-widest text-zinc-500">
                        Age: {record.patient_age}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {record.patient_region}, {record.patient_nation}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(record.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Risk Score</div>
                    <div className={`text-2xl font-black ${
                      record.risk_score >= 7 ? 'text-red-600' : 
                      record.risk_score >= 4 ? 'text-orange-600' : 
                      'text-emerald-600'
                    }`}>
                      {record.risk_score}/10
                    </div>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className={`text-zinc-300 transition-transform ${selectedRecord?.id === record.id ? 'rotate-90' : ''}`} 
                  />
                </div>
              </div>

              {selectedRecord?.id === record.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-6 pt-6 border-t border-zinc-50 space-y-6 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Provisional Diagnosis</h4>
                        <p className="text-sm font-bold text-zinc-900">{record.provisional_diagnosis}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Identified Lesions</h4>
                        <div className="flex flex-wrap gap-2">
                          {record.identified_lesions.map((lesion, idx) => (
                            <span key={idx} className="px-2 py-1 bg-zinc-100 rounded-lg text-[10px] font-bold text-zinc-600">
                              {lesion}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Summary</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">{record.summary}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Mail, Phone, Clock, ExternalLink } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 py-8"
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-black tracking-tight text-zinc-900">Contact Us</h2>
        <p className="text-zinc-500 text-lg leading-relaxed">
          Get in touch with the OPMD Hub for clinical inquiries, research collaborations, or technical support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm space-y-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900">Our Location</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  7th Floor, New OPD Building,<br />
                  Lady Hardinge Medical College and Associate Hospital,<br />
                  New Delhi - 110007, India
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900">Email Address</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  <a href="mailto:opmdhublhmc@gmail.com" className="hover:text-blue-600 transition-colors">opmdhublhmc@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900">Working Hours</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Monday - Friday: 9:00 AM - 5:00 PM<br />
                  Saturday: 9:00 AM - 1:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-zinc-900 rounded-3xl text-white space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">National Oral Health Program</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The OPMD Hub is a key component of the NOHP, working under the Ministry of Health and Family Welfare, Government of India.
            </p>
          </div>
          
          <div className="space-y-4">
            <a 
              href="https://main.mohfw.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
            >
              <span className="text-sm font-bold">MoHFW Website</span>
              <ExternalLink size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
            </a>
            <a 
              href="http://lhmc-hosp.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
            >
              <span className="text-sm font-bold">LHMC Website</span>
              <ExternalLink size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import React, { useRef } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ImageUpload: React.FC<Props> = ({ images, onChange, onNext, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange([...images, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="text-zinc-500 text-sm">
          Please upload clear, well-lit photos of the oral lesion or area of concern. 
          Multiple angles help for a better assessment.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 group">
            <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(idx)}
              className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400 hover:border-emerald-500 hover:text-emerald-500 transition-all bg-zinc-50/50"
        >
          <div className="p-3 rounded-full bg-white shadow-sm mb-2">
            <Camera size={24} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider">Add Photo</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-xl font-semibold bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={images.length === 0}
          className={`flex-[2] py-4 rounded-xl font-semibold transition-all ${
            images.length > 0
              ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg'
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Analyze Lesion
        </button>
      </div>
    </div>
  );
};

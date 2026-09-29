import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  RotateCcw, 
  Check, 
  Sliders,
  Loader2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { compressImage } from '../utils/imageCompressor';
import { CadImagesConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CadCustomizerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { cadImages, updateCadImages, resetCadImages } = useShop();
  const [compressingKey, setCompressingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpload = async (key: keyof CadImagesConfig, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressingKey(key);
      const res = await compressImage(file, 1200, 0.75);
      updateCadImages({ [key]: res.dataUrl });
      setNotice(`Updated "${key}" successfully!`);
      setTimeout(() => setNotice(null), 2500);
    } catch (err) {
      console.error('CAD Image upload error:', err);
      alert('Failed to process image file. Please use a PNG, JPG, or WEBP.');
    } finally {
      setCompressingKey(null);
      e.target.value = '';
    }
  };

  const handleUrlChange = (key: keyof CadImagesConfig, value: string) => {
    updateCadImages({ [key]: value });
  };

  const renderImageSlot = (
    label: string, 
    key: keyof CadImagesConfig, 
    description: string,
    defaultPath: string
  ) => {
    const currentUrl = cadImages[key] || defaultPath;
    const isUploading = compressingKey === key;

    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
        {/* Thumbnail Preview */}
        <div className="w-24 h-32 rounded-xl bg-black border border-zinc-750 overflow-hidden flex-shrink-0 relative group">
          <img src={currentUrl} alt={label} className="w-full h-full object-contain p-1" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[10px] font-mono text-zinc-300">Live Preview</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2 w-full">
          <div>
            <h4 className="font-heading font-bold text-sm text-white">{label}</h4>
            <p className="text-[11px] text-zinc-400 font-mono">{description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Upload from Computer */}
            <label className={`w-full sm:w-auto px-3.5 py-2 bg-white text-zinc-950 font-bold rounded-xl text-xs cursor-pointer hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 shadow ${
              isUploading ? 'opacity-60 cursor-not-allowed' : ''
            }`}>
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{isUploading ? 'Optimizing...' : 'Upload from PC'}</span>
              <input
                type="file"
                disabled={isUploading}
                accept="image/*"
                onChange={(e) => handleUpload(key, e)}
                className="hidden"
              />
            </label>

            {/* URL / Path input */}
            <div className="w-full sm:flex-1">
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => handleUrlChange(key, e.target.value)}
                placeholder={defaultPath}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 text-zinc-100 my-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                CAD VISUALIZER IMAGE MANAGER
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Inspect and customize the 4 CAD model angles
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {notice && (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-xl text-center text-xs font-mono flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>{notice}</span>
          </div>
        )}

        {/* 4 Image Slots */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {renderImageSlot(
            '01 Front View', 
            'front', 
            'Rendered when 01 Front angle is selected (Default: /images/cad/plain_front.png)',
            '/images/cad/plain_front.png'
          )}

          {renderImageSlot(
            '02 Back View', 
            'back', 
            'Rendered when 02 Back angle is selected (Default: /images/cad/plain_back.png)',
            '/images/cad/plain_back.png'
          )}

          {renderImageSlot(
            '03 Collar Stitching Macro', 
            'collar', 
            'Close-up macro of the reinforced rib collar (Default: /images/cad/collar_detail.png)',
            '/images/cad/collar_detail.png'
          )}

          {renderImageSlot(
            '04 Fabric Density Texture', 
            'texture', 
            'Close-up macro of the organic combed cotton knit (Default: /images/cad/texture_detail.png)',
            '/images/cad/texture_detail.png'
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-850 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Reset CAD visualizer images to default files in public/images/cad/?')) {
                resetCadImages();
                setNotice('Reset to default /images/cad/ files.');
                setTimeout(() => setNotice(null), 2500);
              }
            }}
            className="text-xs font-mono text-zinc-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase rounded-xl hover:bg-zinc-200 transition-colors shadow-lg"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, Upload, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { compressImage } from '../utils/imageCompressor';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  allowEdit?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md',
  allowEdit = true 
}) => {
  const { brandLogo, updateBrandLogo, resetBrandLogo } = useShop();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  // Reset imgError whenever brandLogo changes
  useEffect(() => {
    setImgError(false);
  }, [brandLogo]);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs rounded-md',
    md: 'w-9 h-9 text-sm rounded-lg',
    lg: 'w-12 h-12 text-base rounded-xl',
    xl: 'w-16 h-16 text-xl rounded-2xl',
  }[size];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUpdating(true);
      const res = await compressImage(file, 600, 0.85);
      updateBrandLogo(res.dataUrl);
      setImgError(false);
      setShowSuccessBadge(true);
      setTimeout(() => setShowSuccessBadge(false), 2500);
    } catch (err) {
      console.error('Error uploading logo:', err);
      alert('Could not process this image. Please select a PNG, SVG, or JPG.');
    } finally {
      setIsUpdating(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div 
      className={`relative inline-block group select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`${sizeClasses} bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-inner overflow-hidden relative group-hover:border-zinc-400 transition-all`}
        title={allowEdit ? 'Click to change brand logo' : 'BLACKFITS'}
        onClick={allowEdit ? (e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        } : undefined}
        style={{ cursor: allowEdit ? 'pointer' : 'default' }}
      >
        {/* If image exists and hasn't errored */}
        {!imgError && brandLogo ? (
          <img 
            src={brandLogo} 
            alt="BLACKFITS Logo" 
            className="w-full h-full object-contain p-1 filter drop-shadow transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Premium obsidian geometric luxury monogram fallback */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
            <span className="font-heading font-black text-white tracking-tighter filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              BF
            </span>
          </div>
        )}

        {/* Hover Upload Overlay for instant customization */}
        {allowEdit && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-400">
            {isUpdating ? (
              <span className="animate-spin text-xs">●</span>
            ) : showSuccessBadge ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-zinc-200 hover:text-white" />
            )}
          </div>
        )}
      </div>

      {/* Hidden file input for one-click logo replacement */}
      {allowEdit && (
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/png,image/jpeg,image/svg+xml,image/webp" 
          className="hidden" 
          onChange={handleFileChange}
        />
      )}

      {/* Quick tooltip hint on hover for the user */}
      {allowEdit && isHovered && (
        <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap bg-zinc-950 text-zinc-300 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-700/80 shadow-xl z-50 pointer-events-none animate-in fade-in">
          Click to upload logo / place in public/images/logo.png
        </div>
      )}
    </div>
  );
};

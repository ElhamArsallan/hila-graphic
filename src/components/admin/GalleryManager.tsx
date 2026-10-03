import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Upload, 
  FolderOpen, 
  Link as LinkIcon, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  RefreshCw, 
  X, 
  Check, 
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { MediaItem } from '../../types';
import { IMAGE_SPECS, formatImageSpec, getRatioWarning, readImageDimensions } from '../../utils/imageSpecs';

interface GalleryManagerProps {
  label: string;
  images: string[];
  onChange: (newImages: string[]) => void;
  mediaLibrary: MediaItem[];
  onUploadFile: (file: File) => Promise<string>;
  onAddMediaItem?: (item: Omit<MediaItem, 'id' | 'createdAt'>) => void;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  label,
  images = [],
  onChange,
  mediaLibrary,
  onUploadFile,
  onAddMediaItem,
}) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);

  const validateGalleryUpload = async (file: File) => {
    const spec = IMAGE_SPECS.gallery;
    if (!file.type.startsWith('image/')) return true;

    try {
      const dimensions = await readImageDimensions(file);
      const warning = getRatioWarning(spec, dimensions.width, dimensions.height);
      if (warning && !window.confirm(`${warning}\n\nContinue upload anyway?`)) {
        return false;
      }
    } catch {
      // Ignore dimension-read issues and continue with the upload.
    }

    return true;
  };

  // Convert Google Drive share link to direct embed link if needed
  const formatUrl = (input: string): string => {
    let raw = input.trim();
    if (raw.includes('drive.google.com')) {
      const match = raw.match(/\/d\/([a-zA-Z0-9_-]+)/) || raw.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    return raw;
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const formatted = formatUrl(urlInput);
    if (replaceIndex !== null) {
      const updated = [...images];
      updated[replaceIndex] = formatted;
      onChange(updated);
      setReplaceIndex(null);
    } else {
      onChange([...images, formatted]);
    }
    setUrlInput('');
    setShowUrlModal(false);
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const shouldContinue = await validateGalleryUpload(file);
        if (!shouldContinue) {
          continue;
        }
        const uploadedUrl = await onUploadFile(file);
        newUrls.push(uploadedUrl);
        onAddMediaItem?.({
          name: file.name,
          url: uploadedUrl,
          type: file.type.startsWith('video') ? 'video' : 'image',
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        });
      }

      if (replaceIndex !== null) {
        const updated = [...images];
        updated[replaceIndex] = newUrls[0];
        onChange(updated);
        setReplaceIndex(null);
      } else {
        onChange([...images, ...newUrls]);
      }
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    if (replaceIndex !== null) {
      const updated = [...images];
      updated[replaceIndex] = url;
      onChange(updated);
      setReplaceIndex(null);
    } else {
      onChange([...images, url]);
    }
    setShowMediaPicker(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3 pt-3 border-t border-black/10 dark:border-white/10">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilesSelected}
        accept="image/*,video/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={handleFilesSelected}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Header bar with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="font-bold text-xs text-zinc-900 dark:text-white">
            {label} ({images.length})
          </label>
          {isUploading && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#FF5E1E] font-medium">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Uploading...</span>
            </span>
          )}
        </div>

        {/* 3 Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setReplaceIndex(null);
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF5E1E]/10 hover:bg-[#FF5E1E]/20 text-[#FF5E1E] text-[11px] font-bold transition-colors cursor-pointer"
            title="Upload from computer"
          >
            <Upload className="w-3 h-3" />
            <span>Upload</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setReplaceIndex(null);
              setShowMediaPicker(true);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-zinc-700 dark:text-zinc-200 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Choose from Media Library"
          >
            <FolderOpen className="w-3 h-3" />
            <span>Media Library</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setReplaceIndex(null);
              setUrlInput('');
              setShowUrlModal(true);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-zinc-700 dark:text-zinc-200 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Enter image URL or Google Drive link"
          >
            <LinkIcon className="w-3 h-3" />
            <span>Enter URL</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-black/10 bg-black/[0.02] px-2.5 py-2 text-[10px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-300">
        <div className="font-bold text-zinc-800 dark:text-zinc-100">Recommended: {formatImageSpec(IMAGE_SPECS.gallery)}</div>
        <div>Aspect ratio: {IMAGE_SPECS.gallery.aspectRatio}</div>
        <div>Minimum: {IMAGE_SPECS.gallery.minimumWidth} × {IMAGE_SPECS.gallery.minimumHeight}px</div>
        <div>Formats: {IMAGE_SPECS.gallery.formats.join(', ')}</div>
      </div>

      {/* Grid of gallery samples */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto p-1">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden aspect-video bg-zinc-900 border border-black/10 dark:border-white/10 shadow-sm"
            >
              <img
                src={imgUrl}
                alt={`Sample ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Sample index counter badge */}
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                #{String(idx + 1).padStart(2, '0')}
              </div>

              {/* Control overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveUp(idx)}
                  className="p-1 rounded bg-white/20 hover:bg-white/30 text-white disabled:opacity-20 cursor-pointer"
                  title="Move forward"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === images.length - 1}
                  onClick={() => handleMoveDown(idx)}
                  className="p-1 rounded bg-white/20 hover:bg-white/30 text-white disabled:opacity-20 cursor-pointer"
                  title="Move backward"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Replace Image */}
                <button
                  type="button"
                  onClick={() => {
                    setReplaceIndex(idx);
                    setShowMediaPicker(true);
                  }}
                  className="p-1 rounded bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                  title="Replace image"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="p-1 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-black/15 dark:border-white/15 p-4 text-center">
          <ImageIcon className="w-6 h-6 mx-auto text-zinc-400 mb-1" />
          <p className="text-xs text-zinc-500">
            No gallery samples added yet. Click Upload, Media Library, or Enter URL to add unlimited images.
          </p>
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white dark:bg-[#12131A] border border-black/10 dark:border-white/15 p-5 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-3">
              <div>
                <h4 className="font-display font-bold text-sm text-zinc-900 dark:text-white">
                  {replaceIndex !== null ? `Replace Sample #${replaceIndex + 1}` : 'Select Image from Media Library'}
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Click any asset to add it directly to this gallery
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media list */}
            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-1">
              {mediaLibrary.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectFromLibrary(item.url)}
                  className="relative group rounded-xl overflow-hidden aspect-video bg-zinc-900 border border-black/10 dark:border-white/10 cursor-pointer hover:border-[#FF5E1E] transition-all"
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-1 bg-black/60 backdrop-blur-xs text-[9px] text-white truncate">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 mt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-mono">
                {mediaLibrary.length} assets available
              </span>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="px-4 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL Input Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#12131A] border border-black/10 dark:border-white/15 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-3">
              <h4 className="font-display font-bold text-sm text-zinc-900 dark:text-white">
                Enter Image or Google Drive URL
              </h4>
              <button
                type="button"
                onClick={() => setShowUrlModal(false)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Image URL or Google Drive Sharing Link
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or drive.google.com/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddUrl();
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs font-mono"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!urlInput.trim()}
                  onClick={handleAddUrl}
                  className="px-4 py-1.5 rounded-xl bg-[#FF5E1E] disabled:opacity-50 text-white text-xs font-bold hover:bg-[#E84D0E] transition-colors"
                >
                  Add to Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { AlertTriangle, Camera, MapPin, X, Upload, CheckCircle2, Sparkles, Tag } from 'lucide-react';
import { UnsafeAreaReport } from '../types';

interface ReportUnsafeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLat: number;
  userLng: number;
  onAddReport: (report: UnsafeAreaReport) => void;
  initialLat?: number;
  initialLng?: number;
}

export const ReportUnsafeModal: React.FC<ReportUnsafeModalProps> = ({
  isOpen,
  onClose,
  userLat,
  userLng,
  onAddReport,
  initialLat,
  initialLng,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<UnsafeAreaReport['category']>('poor_lighting');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('5th Street Alley, Downtown');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(
    'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const reportLat = initialLat || userLat;
  const reportLng = initialLng || userLng;

  const handleAnalyzeAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/ai/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description,
          hasPhoto: !!photoUrl,
        }),
      });

      const aiRes = await res.json();
      setAiAnalysis(aiRes);

      const newReport: UnsafeAreaReport = {
        id: `rep-${Date.now()}`,
        title,
        category,
        description,
        lat: reportLat,
        lng: reportLng,
        address: address || `${reportLat.toFixed(4)}, ${reportLng.toFixed(4)}`,
        photoUrl,
        severity: aiRes.severity || 'medium',
        reportedAt: 'Just Now',
        reportedBy: 'You',
        upvotes: 1,
        verifiedByAI: aiRes.verifiedByAI !== undefined ? aiRes.verifiedByAI : true,
        aiSafetyTip: aiRes.aiSafetyTip || 'Safety warning broadcasted to community route maps.',
      };

      setTimeout(() => {
        onAddReport(newReport);
        setIsSubmitting(false);
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
      }, 1200);

    } catch (err) {
      console.error('Error analyzing report:', err);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-amber-900/50 rounded-3xl p-6 text-white shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
          <AlertTriangle className="w-4 h-4" /> Community Safety Guard
        </div>
        <h2 className="font-heading font-extrabold text-xl text-white">Report Unsafe Location</h2>
        <p className="text-slate-400 text-xs mt-1">
          Help protect other women by flagging hazards, broken lighting, or harassment spots.
        </p>

        <form onSubmit={handleAnalyzeAndSubmit} className="space-y-4 mt-5">
          
          {/* Category Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="poor_lighting">Poor / Broken Street Lighting</option>
              <option value="harassment">Catcalling or Harassment Spot</option>
              <option value="suspicious">Suspicious Activity / Loitering</option>
              <option value="deserted">Deserted / Unisolated Path</option>
              <option value="crime_history">Recent Mugging / Crime Spot</option>
              <option value="other">Other Safety Concern</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unlit alley near metro gate 2"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              required
            />
          </div>

          {/* Location Address */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Address / Coordinates
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context (e.g. Broken streetlight for 200 meters, group hanging out after 9 PM)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              required
            />
          </div>

          {/* Photo Evidence Simulation */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Photo Evidence (Optional)</label>
            <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1 text-xs">
                <span className="text-slate-300 font-medium block">Photo Attached</span>
                <span className="text-[10px] text-slate-500">Improves AI verification rating</span>
              </div>
              <button
                type="button"
                onClick={() => setPhotoUrl(photoUrl ? undefined : 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80')}
                className="text-[11px] font-bold text-amber-400 hover:underline"
              >
                {photoUrl ? 'Remove' : 'Add Sample'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-950/60 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>AI Categorizing Threat Level...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Submit & Alert Community</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

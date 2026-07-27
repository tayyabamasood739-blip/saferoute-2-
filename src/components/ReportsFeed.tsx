import React, { useState } from 'react';
import { AlertTriangle, ThumbsUp, MapPin, Sparkles, Filter, Plus, ShieldCheck, Eye } from 'lucide-react';
import { UnsafeAreaReport } from '../types';

interface ReportsFeedProps {
  reports: UnsafeAreaReport[];
  onUpvoteReport: (id: string) => void;
  onOpenReportModal: () => void;
  onViewOnMap: (report: UnsafeAreaReport) => void;
}

export const ReportsFeed: React.FC<ReportsFeedProps> = ({
  reports,
  onUpvoteReport,
  onOpenReportModal,
  onViewOnMap,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredReports = reports.filter((r) => {
    if (filterCategory === 'all') return true;
    return r.category === filterCategory;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner & Trigger */}
      <div className="bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-slate-900 border border-amber-900/40 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" /> Community Safety Watch
          </div>
          <h2 className="font-heading font-extrabold text-xl text-white">Reported Unsafe Areas</h2>
          <p className="text-slate-300 text-xs mt-1">
            Crowdsourced safety hazards verified by AI algorithms & women commuters.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-950/80 shrink-0 flex items-center gap-1 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Report Spot</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-slate-400 text-xs font-semibold shrink-0">Filter:</span>
        {[
          { id: 'all', label: 'All Hazards' },
          { id: 'poor_lighting', label: 'Broken Lighting' },
          { id: 'harassment', label: 'Harassment' },
          { id: 'suspicious', label: 'Suspicious' },
          { id: 'deserted', label: 'Deserted' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
              filterCategory === tab.id
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const isHigh = report.severity === 'high';
          const isMedium = report.severity === 'medium';

          return (
            <div
              key={report.id}
              className="bg-slate-900 border border-purple-900/30 hover:border-purple-800/60 rounded-3xl p-5 shadow-xl transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isHigh
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : isMedium
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-yellow-950 text-yellow-300 border-yellow-800'
                    }`}>
                      {report.category.replace('_', ' ')}
                    </span>

                    {report.verifiedByAI && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> AI Verified
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400">{report.reportedAt}</span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-white mt-1">
                    {report.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{report.address}</span>
                  </div>
                </div>

                <button
                  onClick={() => onViewOnMap(report)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl border border-slate-700 transition shrink-0"
                  title="Locate on Map"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {report.description}
              </p>

              {/* Photo Preview if available */}
              {report.photoUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800 max-h-44">
                  <img src={report.photoUrl} alt="Report evidence" className="w-full h-full object-cover" />
                </div>
              )}

              {/* AI Safety Tip Box */}
              {report.aiSafetyTip && (
                <div className="mt-3 bg-purple-950/40 border border-purple-800/40 rounded-2xl p-3 text-xs text-purple-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-purple-300">AI Safety Advisory:</strong> {report.aiSafetyTip}
                  </div>
                </div>
              )}

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Reported by <strong className="text-slate-200">{report.reportedBy}</strong></span>

                <button
                  onClick={() => onUpvoteReport(report.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl border border-slate-700/80 transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Confirm ({report.upvotes})</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

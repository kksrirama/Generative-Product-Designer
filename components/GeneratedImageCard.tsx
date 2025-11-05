
import React from 'react';

interface AnalysisResult {
  pros: string[];
  cons: string[];
}

interface GeneratedImageCardProps {
  imageUrl?: string;
  analysis?: AnalysisResult;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="bg-slate-700 h-48 w-full rounded-lg"></div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-700 rounded w-1/4"></div>
      <div className="h-3 bg-slate-700 rounded w-full"></div>
      <div className="h-3 bg-slate-700 rounded w-5/6"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-700 rounded w-1/4"></div>
      <div className="h-3 bg-slate-700 rounded w-full"></div>
      <div className="h-3 bg-slate-700 rounded w-4/6"></div>
    </div>
  </div>
);

export const GeneratedImageCard: React.FC<GeneratedImageCardProps> = ({ imageUrl, analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-4">
      <div className="aspect-square w-full bg-slate-700 rounded-lg overflow-hidden">
        {imageUrl && <img src={imageUrl} alt="Generated design" className="w-full h-full object-cover" />}
      </div>
      {analysis && (
        <div className="space-y-3 text-sm">
          <div>
            <h3 className="font-semibold text-green-400 mb-1">Pros</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {analysis.pros?.map((pro, i) => <li key={`pro-${i}`}>{pro}</li>) ?? <li>Analysis not available.</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-400 mb-1">Cons</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {analysis.cons?.map((con, i) => <li key={`con-${i}`}>{con}</li>) ?? <li>Analysis not available.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

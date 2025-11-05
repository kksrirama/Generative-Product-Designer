
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { GeneratedImageCard } from './components/GeneratedImageCard';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateEditedImage, analyzeDesign } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

interface AnalysisResult {
  pros: string[];
  cons: string[];
}

export default function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback((file: File | null) => {
    setOriginalImage(file);
    setGeneratedImages([]);
    setAnalysisResults([]);
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and provide a design prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setAnalysisResults([]);

    try {
      const base64Image = await fileToBase64(originalImage);
      const mimeType = originalImage.type;

      // Generate 4 image variations
      const imageGenerationPromises = Array(4).fill(0).map(() => 
        generateEditedImage(base64Image, mimeType, prompt)
      );
      const newImages = await Promise.all(imageGenerationPromises);
      setGeneratedImages(newImages);

      // Analyze each generated image
      const analysisPromises = newImages.map(img => analyzeDesign(img, prompt));
      const newAnalyses = await Promise.all(analysisPromises);
      setAnalysisResults(newAnalyses);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Generative Product Designer
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Upload a product image, describe your needs, and let AI generate and analyze new design concepts for you.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 sticky top-8 self-start">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-cyan-300">1. Upload Product Image</h2>
              <ImageUploader onImageSelected={handleImageSelected} />
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-cyan-300">2. Describe Your Needs</h2>
              <PromptInput value={prompt} onChange={e => setPrompt(e.target.value)} />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !originalImage || !prompt}
              className="w-full flex items-center justify-center gap-2 text-lg font-bold bg-purple-600 text-white py-3 px-6 rounded-xl hover:bg-purple-700 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              <SparklesIcon />
              {isLoading ? 'Generating...' : 'Generate Designs'}
            </button>
            {error && <p className="text-red-400 text-center mt-2">{error}</p>}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 min-h-[300px]">
              <h2 className="text-2xl font-semibold mb-6 text-cyan-300">Generated Concepts</h2>
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array(4).fill(0).map((_, i) => <GeneratedImageCard key={i} isLoading={true} />)}
                </div>
              )}
              {!isLoading && generatedImages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-16">
                  <p className="text-xl">Your new designs will appear here.</p>
                  <p>Upload an image and provide a prompt to get started.</p>
                </div>
              )}
              {!isLoading && generatedImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedImages.map((img, i) => (
                    <GeneratedImageCard 
                      key={i} 
                      imageUrl={`data:image/png;base64,${img}`} 
                      analysis={analysisResults[i]} 
                      isLoading={false} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

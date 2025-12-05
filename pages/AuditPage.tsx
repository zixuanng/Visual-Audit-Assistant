import React, { useState, useRef } from 'react';
import { Upload, Camera, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { BoundingBoxOverlay } from '../components/BoundingBoxOverlay';
import { analyzeAuditImage, fileToGenerativePart } from '../services/geminiService';
import { AuditResponse } from '../types';

export const AuditPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null); // Clear previous results
      setError(null);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !prompt.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Data = await fileToGenerativePart(selectedFile);
      const analysisResult = await analyzeAuditImage(
        base64Data,
        selectedFile.type,
        prompt
      );
      setResult(analysisResult);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Visual Audit</h1>
          <p className="text-gray-500">Upload an image of a shelf, aisle, or site to begin inspection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Column: Image Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`bg-white rounded-xl shadow-sm border-2 border-dashed ${!previewUrl ? 'border-gray-300' : 'border-blue-200'} p-4 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden transition-colors`}>
            
            {!previewUrl ? (
              <div className="text-center space-y-4 p-8">
                <div className="mx-auto h-16 w-16 text-gray-400 flex items-center justify-center bg-gray-50 rounded-full">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">Drop an image here or click to upload</p>
                  <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG (Max 10MB)</p>
                </div>
                <div className="flex justify-center gap-3">
                  <Button onClick={() => fileInputRef.current?.click()} variant="secondary" icon={<Upload size={18}/>}>
                    Select File
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="secondary" icon={<Camera size={18}/>}>
                    Use Camera
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-black/5 rounded-lg overflow-hidden">
                {result && result.items.length > 0 ? (
                  <BoundingBoxOverlay imageUrl={previewUrl} items={result.items} />
                ) : (
                  <img src={previewUrl} alt="Preview" className="max-h-[600px] w-auto h-auto object-contain rounded-lg shadow-sm" />
                )}
                
                <button 
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setResult(null);
                  }}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white text-gray-600 transition-all"
                  title="Remove image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
        </div>

        {/* Right Column: Controls & Results */}
        <div className="flex flex-col h-full space-y-4">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Inspection Query</h2>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What should I look for?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Count the number of brown boxes', 'Are there any workers without helmets?', 'Is the aisle clear of debris?'"
                  className="w-full rounded-md border-gray-300 border p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                  rows={4}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!selectedFile || !prompt.trim()} 
                isLoading={isAnalyzing}
                icon={<Send size={16} />}
              >
                {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
              </Button>
            </form>
          </div>

          {/* Results Section */}
          {(result || error) && (
            <div className={`flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Analysis Result</h2>
              
              {error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={18} className="text-green-500" />
                      <span className="font-medium text-gray-900">Summary</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                      {result.answer}
                    </p>
                  </div>

                  {result.items.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Detected Items ({result.items.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.items.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {item.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
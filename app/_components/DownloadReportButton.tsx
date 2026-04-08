"use client";

import React from "react";
import { Download } from "lucide-react";

interface DownloadReportButtonProps {
  fileName?: string;
  targetId?: string;
}

/**
 * A client-side button that uses html2pdf.js to generate a PDF of a specific element.
 * Adheres to Vercel's serverless limits by offloading heavy PDF generation to the client.
 */
export default function DownloadReportButton({ 
  fileName = "Capital-Architect-Report.pdf",
  targetId
}: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const handleDownload = async () => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') return;

    setIsGenerating(true);
    try {
      // Dynamically import html2pdf.js to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = targetId ? document.getElementById(targetId) : document.body;
      
      if (!element) {
        throw new Error(`Target element with id "${targetId}" not found.`);
      }
      
      const options: Record<string, unknown> = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          backgroundColor: "#060A14", // Match the dark theme background
          logging: false,
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Execute PDF generation
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating your PDF report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-12 flex justify-center pb-8 print:hidden">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#C8A84B]/30 bg-[#C8A84B]/5 px-6 py-3 text-sm font-semibold text-[#C8A84B] transition-all hover:bg-[#C8A84B]/10 hover:border-[#C8A84B]/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className={`h-4 w-4 ${isGenerating ? 'animate-bounce' : ''}`} />
        {isGenerating ? 'Generating Report...' : 'Download Your Full Report (PDF)'}
      </button>
    </div>
  );
}
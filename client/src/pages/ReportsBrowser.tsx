import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface ReportFile {
  name: string;
  nameWithoutExt: string;
  size: number;
  date: string;
}

interface ReportsData {
  reports: ReportFile[];
  total: number;
}

export default function ReportsBrowser() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data, isLoading, error } = useQuery<ReportsData>({
    queryKey: ["/api/reports-list"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
        <div className="text-white text-xl">Error loading reports</div>
      </div>
    );
  }

  const reports = data?.reports || [];
  
  const filteredReports = reports.filter((report: ReportFile) => {
    if (selectedType === "all") return true;
    if (selectedType === "key") {
      return report.nameWithoutExt.includes('sentinel-6') || 
             report.nameWithoutExt.includes('verification') || 
             report.nameWithoutExt.includes('challenger-demo') ||
             report.nameWithoutExt.includes('final-test');
    }
    return report.nameWithoutExt.includes(selectedType);
  });

  const isKeyReport = (filename: string) => {
    return filename.includes('sentinel-6') || 
           filename.includes('verification') || 
           filename.includes('challenger-demo') ||
           filename.includes('final-test');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Generated Reports Browser
          </h1>
          <p className="text-blue-200 text-lg">
            View all {reports.length} transformation reports
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { key: "all", label: "All Reports" },
            { key: "key", label: "Key Reports" },
            { key: "sentinel", label: "Sentinel" },
            { key: "challenger", label: "Challenger" },
            { key: "helper", label: "Helper" },
            { key: "reformer", label: "Reformer" }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedType(filter.key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedType === filter.key
                  ? "bg-yellow-400 text-gray-900 shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report: ReportFile) => (
            <div
              key={report.name}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border transition-all hover:scale-105 hover:bg-white/15 ${
                isKeyReport(report.nameWithoutExt)
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-white/20"
              }`}
            >
              <div className="mb-4">
                <h3 className="text-white font-semibold text-lg mb-2 break-words">
                  {report.name}
                </h3>
                <div className="flex justify-between text-sm text-blue-200">
                  <span>{report.size}KB</span>
                  <span>{report.date}</span>
                </div>
              </div>
              
              <a
                href={`/view-report/${report.nameWithoutExt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                View Report
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-xl">
              No reports found for "{selectedType}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
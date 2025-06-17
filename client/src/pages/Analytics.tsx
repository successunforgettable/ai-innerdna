import React, { useState, useEffect } from 'react';
import { getStoredAssessments } from '@/lib/assessmentStorage';
import DataExport from '@/components/DataExport';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsStats {
  totalCompletions: number;
  typeDistribution: Record<string, number>;
  recentCompletions: number;
}

const Analytics = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);

  const handleLogout = () => {
    logout();
    // Will automatically redirect to login due to ProtectedRoute
  };

  useEffect(() => {
    const assessments = getStoredAssessments();
    setAssessments(assessments);
    
    // Calculate statistics per Section 9.3
    const totalCompletions = assessments.length;
    
    // Type distribution calculation with multiple fallback strategies
    const typeDistribution: Record<string, number> = {};
    assessments.forEach((assessment: any) => {
      // Try multiple ways to extract personality type
      const type = assessment.primaryType || 
                   assessment.result?.primaryType || 
                   assessment.personalityType ||
                   assessment.assessmentData?.result?.primaryType ||
                   null;
      
      if (type) {
        typeDistribution[type] = (typeDistribution[type] || 0) + 1;
      }
    });

    // Recent completions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCompletions = assessments.filter(
      (assessment: any) => new Date(assessment.completedAt) > sevenDaysAgo
    ).length;

    setStats({
      totalCompletions,
      typeDistribution,
      recentCompletions
    });
  }, []);

  if (!stats) return <div>Loading analytics...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-yellow-400">
              Assessment Analytics
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Data Export */}
          <DataExport />

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Total Completions</h3>
              <p className="text-3xl font-bold text-green-400">{stats.totalCompletions}</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Recent (7 days)</h3>
              <p className="text-3xl font-bold text-blue-400">{stats.recentCompletions}</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Most Common Type</h3>
              <p className="text-3xl font-bold text-purple-400">
                {Object.keys(stats.typeDistribution).length > 0 
                  ? Object.entries(stats.typeDistribution).reduce((a, b) => stats.typeDistribution[a[0]] > stats.typeDistribution[b[0]] ? a : b)[0]
                  : 'N/A'
                }
              </p>
            </div>
          </div>

          {/* Type Distribution */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Type Distribution</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {[1,2,3,4,5,6,7,8,9].map(type => (
                <div key={type} className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-lg font-bold text-white">Type {type}</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {stats.typeDistribution[type] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Assessments */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Recent Assessments</h3>
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-white font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-white font-semibold">Email</th>
                      <th className="px-4 py-3 text-left text-white font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-white font-semibold">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.slice(0, 10).map((assessment, index) => (
                      <tr key={assessment.id} className={index % 2 === 0 ? 'bg-white/5' : ''}>
                        <td className="px-4 py-3 text-white/90">
                          {assessment.firstName} {assessment.lastName}
                        </td>
                        <td className="px-4 py-3 text-white/90">
                          {assessment.email}
                        </td>
                        <td className="px-4 py-3 text-white/90">
                          {(() => {
                            // Multiple fallback strategies for personality type extraction
                            const type = assessment.primaryType || 
                                       assessment.result?.primaryType || 
                                       assessment.personalityType ||
                                       assessment.assessmentData?.result?.primaryType;
                            
                            const typeName = assessment.typeName || 
                                           assessment.result?.typeName || 
                                           assessment.personalityName ||
                                           assessment.assessmentData?.result?.typeName;
                            
                            if (type) {
                              return `Type ${type}${typeName ? ` - ${typeName}` : ''}`;
                            } else {
                              return 'Type - (Data Missing)';
                            }
                          })()}
                        </td>
                        <td className="px-4 py-3 text-white/90">
                          {new Date(assessment.completedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;
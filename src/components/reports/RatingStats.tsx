import React from 'react';
import { Star } from 'lucide-react';
import type { Action } from '../../types/action';

interface RatingStatsProps {
  actions: Action[];
}

const RatingStats: React.FC<RatingStatsProps> = ({ actions }) => {
  // Calculate rating distribution
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = i + 1;
    const count = actions.filter(action => action.rating === rating).length;
    return {
      rating,
      count,
      percentage: (count / actions.length) * 100,
    };
  });

  // Calculate average rating
  const averageRating = actions.reduce((sum, action) => sum + action.rating, 0) / actions.length;

  return (
    <div>
      <h6 className="text-sm font-medium text-gray-700 mb-2">Valoraciones</h6>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Valoración Media</span>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">{rating}</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{count}</span>
                <span className="text-sm text-gray-500">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingStats;
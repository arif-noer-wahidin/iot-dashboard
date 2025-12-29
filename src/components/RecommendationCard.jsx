import React from 'react'

const RecommendationCard = ({ fuzzyRecommendation }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-gray-200 font-semibold mb-3">💡 Rekomendasi</h3>
      <p className={`text-sm leading-relaxed ${!fuzzyRecommendation ? 'text-gray-500' : 'text-gray-300'}`}>
        {fuzzyRecommendation || 'Menunggu data...'}
      </p>
    </div>
  )
}

export default React.memo(RecommendationCard)

const renderStep = (step) => {
  const parts = step.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function RecipeDisplay({ recipes }) {

  return (
    <div className="space-y-6">
      {recipes.map((recipe, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            🍽️ {recipe.title}
          </h3>
          
          <div className="mb-3">
            <p className="text-sm text-gray-300 flex items-center gap-1">
              ⏱️ <strong className="text-white">Time to make:</strong> {recipe.time} minutes
            </p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-200 mb-2">🛒 Ingredients Checklist:</p>
            <div className="space-y-1">
              {recipe.ingredients.ready.length > 0 && (
                <div>
                  <p className="text-green-400 text-sm">✅ Ready to use:</p>
                  <ul className="list-disc list-inside text-sm text-gray-300 ml-4">
                    {recipe.ingredients.ready.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}
              {recipe.ingredients.missing.length > 0 && (
                <div>
                  <p className="text-orange-400 text-sm">🟧 Missing:</p>
                  <ul className="list-disc list-inside text-sm text-gray-300 ml-4">
                    {recipe.ingredients.missing.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-200 mb-2">👩‍🍳 Step-by-Step Instructions:</p>
            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{renderStep(step)}</li>
              ))}
            </ol>
          </div>
          
          {recipe.tags.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-200 mb-2">🏷️ Tags:</p>
              <div className="flex flex-wrap gap-1">
                {recipe.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs border border-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
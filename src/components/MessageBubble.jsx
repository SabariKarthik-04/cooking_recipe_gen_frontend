import RecipeDisplay from './RecipeDisplay.jsx';
import { parseRecipes } from '../utils/recipeParser.js';

export default function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const isRecipe = msg.text && msg.text.includes('### 🍽️');
  const recipes = isRecipe ? parseRecipes(msg.text) : [];

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} items-start`}>
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-base shadow-sm
          ${isUser ? "bg-amber-400" : "bg-stone-800"}`}
      >
        {isUser ? "👤" : "👨‍🍳"}
      </div>
      <div className={`max-w-[78%] flex flex-col gap-2`}>
        {msg.image && (
          <img
            src={msg.image}
            alt="Uploaded"
            className="rounded-lg max-h-64 object-cover shadow-sm border border-gray-600"
          />
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
            ${isUser
              ? "bg-amber-400 text-amber-950 rounded-tr-sm font-medium"
              : "bg-gray-700 text-gray-100 rounded-tl-sm border border-gray-600"
            }`}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {msg.text ? (
            isRecipe ? (
              <RecipeDisplay recipes={recipes} />
            ) : (
              msg.text
            )
          ) : (
            <span className="flex gap-1 items-center text-stone-400 italic text-xs">
              <span>Crafting your recipe</span>
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1 h-1 rounded-full bg-amber-400 animate-bounce inline-block"
                  style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </span>
          )}
          {msg.streaming && msg.text && (
            <span className="inline-flex ml-1 gap-0.5 translate-y-0.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1 h-1 rounded-full bg-amber-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
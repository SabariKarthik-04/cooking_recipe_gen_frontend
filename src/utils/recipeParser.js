export function parseRecipes(text) {
  const recipes = [];
  const sections = text.split(/(?=### 🍽️)/).filter(s => s.trim());

  for (const section of sections) {
    const lines = section.split('\n').map(l => l.trim()).filter(l => l);
    let title = '';
    let time = '';
    let ingredients = { ready: [], missing: [] };
    let instructions = [];
    let tags = [];

    for (const line of lines) {
      if (line.startsWith('### 🍽️')) {
        title = line.replace('### 🍽️', '').trim();
      } else if (line.startsWith('⏱️ **Time to make:**')) {
        time = line.replace('⏱️ **Time to make:**', '').trim();
      } else if (line.startsWith('- ✅ **Ready to use:**')) {
        const ingText = line.replace('- ✅ **Ready to use:**', '').trim();
        ingredients.ready = ingText.split(',').map(i => i.trim()).filter(i => i);
      } else if (line.startsWith('- 🟧 **Missing:**')) {
        const ingText = line.replace('- 🟧 **Missing:**', '').trim();
        ingredients.missing = ingText.split(',').map(i => i.trim()).filter(i => i);
      } else if (/^\d+\./.test(line)) {
        instructions.push(line.replace(/^\d+\.\s*/, '').trim());
      } else if (line.startsWith('🏷️ *Tags:')) {
        const tagLine = line.replace('🏷️ *Tags:', '').replace('*', '').trim();
        tags = tagLine.split('#').filter(t => t.trim()).map(t => '#' + t.trim());
      }
    }

    recipes.push({ title, time, ingredients, instructions, tags });
  }

  return recipes;
}
import dsaPatternsData from './dsaPatterns.json';

// Re-sort by difficulty just in case
const difficultyOrder = {
  'theory': 0,
  'easy': 1,
  'medium': 2,
  'hard': 3
};

export const dsaPatterns = dsaPatternsData.map(pattern => ({
  ...pattern,
  items: [...pattern.items].sort((a, b) => {
    const diffA = difficultyOrder[a.difficulty?.toLowerCase()] ?? 4;
    const diffB = difficultyOrder[b.difficulty?.toLowerCase()] ?? 4;
    return diffA - diffB;
  })
}));

export default dsaPatterns;

export const calculateProgress = (completedIds = []) => {
  let total = 0;
  let solved = 0;
  dsaPatterns.forEach(pattern => {
    if (pattern.items) {
      pattern.items.forEach(item => {
        if (!item.isTheory) {
          total++;
          if (completedIds.includes(item.id)) solved++;
        }
      });
    }
  });
  return {
    total,
    solved,
    percentage: total > 0 ? Math.round((solved / total) * 100) : 0
  };
};

export const getAllItems = () => {
  const items = [];
  dsaPatterns.forEach(pattern => {
    if (pattern.items) {
      pattern.items.forEach(item => {
        if (!item.isTheory) {
          items.push({
            ...item,
            patternSlug: pattern.slug
          });
        }
      });
    }
  });
  return items;
};

export const getItemBySlug = (patternSlug, itemSlug) => {
  const pattern = dsaPatterns.find(p => p.slug === patternSlug);
  if (!pattern || !pattern.items) return null;
  return pattern.items.find(item => item.slug === itemSlug);
};

export const getPatternBySlug = (slug) => {
  return dsaPatterns.find(p => p.slug === slug);
};

export const getProblemBySlug = (patternSlug, problemSlug) => {
  const pattern = getPatternBySlug(patternSlug);
  if (!pattern) return null;
  return pattern.items.find(p => p.slug === problemSlug);
};

export const getAllPatterns = () => dsaPatterns;

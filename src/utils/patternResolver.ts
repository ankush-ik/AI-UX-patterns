import { patterns } from "../lib/patterns";

/**
 * Fetch a pattern by its ID
 * @param patternId The ID of the pattern to fetch
 * @returns The full pattern object or undefined if not found
 */
export function getPatternById(patternId: string) {
  return patterns.find((pattern) => pattern.id === patternId);
}

/**
 * Fetch multiple patterns by their IDs
 * @param patternIds Array of pattern IDs
 * @returns Array of full pattern objects (skips missing ones)
 */
export function getPatternsByIds(patternIds: string[]) {
  return patternIds
    .map((id) => getPatternById(id))
    .filter((pattern) => pattern !== undefined);
}

/**
 * Get related patterns for a given pattern
 * Resolves pattern IDs to full pattern objects
 * @param patternId The ID of the pattern whose related patterns we want
 * @returns Array of related pattern objects
 */
export function getRelatedPatterns(patternId: string) {
  const pattern = getPatternById(patternId);
  if (!pattern || !pattern.content.relatedPatterns) {
    return [];
  }

  // Handle both old format (objects) and new format (IDs)
  const relPatterns = pattern.content.relatedPatterns;
  const isNewFormat = relPatterns.length === 0 || typeof relPatterns[0] === "string";

  if (isNewFormat) {
    // New format: array of IDs
     return getPatternsByIds(relPatterns as unknown as string[]);
  } else {
    // Old format: array of objects - just return as-is for backward compatibility
    return (relPatterns as unknown as Array<{
      id: string;
      title: string;
      description: string;
    }>);
  }
}

/**
 * Check if two patterns are related
 * @param patternId1 First pattern ID
 * @param patternId2 Second pattern ID
 * @returns true if pattern2 is listed as related to pattern1
 */
export function arePatternRelated(
  patternId1: string,
  patternId2: string
): boolean {
  const relatedPatterns = getRelatedPatterns(patternId1);
  return relatedPatterns.some((p) => p.id === patternId2);
}

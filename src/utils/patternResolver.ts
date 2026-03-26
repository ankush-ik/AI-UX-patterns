import {
  getPatternById as getPatternByIdFromRepository,
  getPatterns,
  getRelatedPatterns as getRelatedPatternsFromRepository,
} from "@/lib/patternRepository";

/**
 * Fetch a pattern by its ID
 * @param patternId The ID of the pattern to fetch
 * @returns The full pattern object or undefined if not found
 */
export function getPatternById(patternId: string) {
  return getPatternByIdFromRepository(patternId);
}

/**
 * Fetch multiple patterns by their IDs
 * @param patternIds Array of pattern IDs
 * @returns Array of full pattern objects (skips missing ones)
 */
export async function getPatternsByIds(patternIds: string[]) {
  const patterns = await getPatterns();

  return patternIds
    .map((id) => patterns.find((pattern) => pattern.id === id))
    .filter((pattern) => pattern !== undefined);
}

/**
 * Get related patterns for a given pattern
 * Resolves pattern IDs to full pattern objects
 * @param patternId The ID of the pattern whose related patterns we want
 * @returns Array of related pattern objects
 */
export function getRelatedPatterns(patternId: string) {
  return getRelatedPatternsFromRepository(patternId);
}

/**
 * Check if two patterns are related
 * @param patternId1 First pattern ID
 * @param patternId2 Second pattern ID
 * @returns true if pattern2 is listed as related to pattern1
 */
export async function arePatternRelated(
  patternId1: string,
  patternId2: string
): Promise<boolean> {
  const relatedPatterns = await getRelatedPatterns(patternId1);
  return relatedPatterns.some((p) => p.id === patternId2);
}

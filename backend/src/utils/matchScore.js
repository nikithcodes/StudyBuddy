/**
 * Compute a compatibility score between two users based on shared attributes.
 * Returned score is between 0-100 with a small breakdown for UI hints.
 */
const normalize = (value = "") => value.toString().trim().toLowerCase();

const intersection = (left = [], right = []) => {
  const rightSet = new Set(right.map(normalize));
  return left
    .map(normalize)
    .filter((item, idx, arr) => rightSet.has(item) && arr.indexOf(item) === idx);
};

export const calculateMatchScore = (currentUser, candidate) => {
  const subjects = intersection(currentUser.subjects || [], candidate.subjects || []);
  const availability = intersection(currentUser.availability || [], candidate.availability || []);

  const currentSkills = (currentUser.skills || []).map((skill) => normalize(skill.name || ""));
  const candidateSkills = (candidate.skills || []).map((skill) => normalize(skill.name || ""));
  const skillOverlap = intersection(currentSkills, candidateSkills).filter(Boolean);

  const branchScore = normalize(currentUser.branch) === normalize(candidate.branch) ? 8 : 0;
  const yearGap = Math.abs((currentUser.year || 0) - (candidate.year || 0));
  const yearScore = yearGap ? Math.max(0, 10 - yearGap * 2) : 10;

  const preferenceScore =
    normalize(currentUser.studyPreference) === normalize(candidate.studyPreference)
      ? 12
      : 4;

  const subjectScore = subjects.length
    ? Math.min(40, (subjects.length / Math.max(currentUser.subjects?.length || 1, 1)) * 40)
    : 0;

  const availabilityScore = availability.length
    ? Math.min(
        20,
        (availability.length /
          Math.max(
            Math.max(currentUser.availability?.length || 1, candidate.availability?.length || 1),
            1
          )) * 20
      )
    : 0;

  const skillScore = skillOverlap.length ? Math.min(10, skillOverlap.length * 3) : 0;

  const rawScore = branchScore + yearScore + preferenceScore + subjectScore + availabilityScore + skillScore;
  const score = Math.min(100, Math.round(rawScore));

  return {
    score,
    breakdown: {
      commonSubjects: subjects,
      commonAvailability: availability,
      skillOverlap,
      branchMatch: branchScore > 0,
      yearGap,
      studyPreferenceMatch: preferenceScore > 8,
    },
  };
};

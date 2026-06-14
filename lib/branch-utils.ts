export function getPublicBranchSlug(branch: { city: string; slug: string }) {
  const citySlug = branch.city.trim().toLowerCase().replace(/\s+/g, "-");

  if (citySlug === "mutare" || citySlug === "chipinge") {
    return citySlug;
  }

  return branch.slug;
}

export function getPublicBranchPath(branch: { city: string; slug: string }) {
  return `/branches/${getPublicBranchSlug(branch)}`;
}

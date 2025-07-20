export const convertSlugToTitle = (slug: string): string => {
  // Convert slug to title by replacing hyphens with spaces and capitalizing each word
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
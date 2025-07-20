export const convertSlugToTitle = (slug: string): string => {
  // Convert slug to title by replacing hyphens with spaces and capitalizing each word
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const convertTitleToSlug = (title: string): string => {
  // Convert title to slug by replacing spaces with hyphens and converting to lowercase
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove non-alphanumeric characters except hyphens
};

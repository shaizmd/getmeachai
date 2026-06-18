export const categories = [
  'Technology',
  'Art & Design',
  'Music',
  'Gaming',
  'Education',
  'Health & Fitness',
  'Food & Cooking',
  'Travel',
  'Business',
  'Sports',
  'Photography',
  'Writing',
  'Other',
];

export const categoryMapping = {
  'Technology': 'tech',
  'Art & Design': 'art',
  Music: 'music',
  Gaming: 'gaming',
  Education: 'education',
  'Health & Fitness': 'health',
  'Food & Cooking': 'lifestyle',
  Travel: 'lifestyle',
  Business: 'business',
  Sports: 'lifestyle',
  Photography: 'art',
  Writing: 'writing',
  Other: 'other',
};

export const reverseCategoryMapping = Object.fromEntries(
  Object.entries(categoryMapping).map(([displayName, value]) => [value, displayName])
);

export const emptyLinks = {
  website: '',
  twitter: '',
  instagram: '',
  youtube: '',
  github: '',
  linkedin: '',
};

export function serializeLinks(links) {
  return Object.entries(links)
    .filter(([, value]) => value.trim() !== '')
    .map(([name, url]) => ({ name, url }));
}

export function deserializeLinks(links) {
  if (!Array.isArray(links)) {
    return { ...emptyLinks };
  }

  return links.reduce((acc, link) => {
    if (link?.name && Object.hasOwn(emptyLinks, link.name)) {
      acc[link.name] = link.url || '';
    }
    return acc;
  }, { ...emptyLinks });
}

export function parseLocationInput(locationInput) {
  const [city, country] = locationInput.split(',');

  return {
    city: city?.trim() || 'Unknown',
    country: country?.trim() || 'Unknown',
  };
}

export function formatLocationInput(location) {
  if (!location || typeof location !== 'object') {
    return '';
  }

  return [location.city, location.country].filter(Boolean).join(', ');
}

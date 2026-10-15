// Structured data (schema.org) so search engines and AI assistants can read
// the facts about Aikkya without guessing.
import { site, rupees } from './site';

const base = import.meta.env.SITE.replace(/\/$/, '');

export const lodging = (rooms: { name: string; line: string; sleeps: string }[] = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BedAndBreakfast',
  '@id': `${base}/#aikkya`,
  name: site.fullName,
  alternateName: [site.name, site.scripts.hindi, site.scripts.bangla],
  description: site.description,
  url: `${base}/`,
  image: `${base}/og.jpg`,
  telephone: site.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  hasMap: site.mapUrl,
  checkinTime: site.checkIn,
  checkoutTime: site.checkOut,
  ...(site.showPrices && {
    priceRange: `${rupees(site.prices.wabiSabi)}–${rupees(site.prices.kintsugi)} per night for two, breakfast included`,
  }),
  currenciesAccepted: 'INR',
  petsAllowed: true,
  numberOfRooms: 4,
  founder: site.hosts.map((name) => ({ '@type': 'Person', name })),
  sameAs: site.elsewhere,
  amenityFeature: [
    'Breakfast included',
    'Home-cooked lunch and dinner on request',
    'Wi-Fi',
    'Parking',
    'Electric blankets and hot water',
    'Wood-burning stove in the lounge',
    'Sun room',
    'Sunset deck',
    '7.5 acres of orchard and forest trails',
  ].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  containsPlace: rooms.map((r) => ({ '@type': 'HotelRoom', name: r.name, description: `${r.line} Sleeps ${r.sleeps.toLowerCase()}.` })),
});

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${base}/#website`,
  name: site.name,
  alternateName: [site.fullName, site.scripts.hindi, site.scripts.bangla],
  url: `${base}/`,
  inLanguage: 'en-IN',
  publisher: { '@id': `${base}/#aikkya` },
});

export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: `${base}${t.path}` })),
});

export const faq = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
});

export const post = (p: { title: string; date: Date; url: string; description: string; image?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: p.title,
  description: p.description,
  datePublished: p.date.toISOString().slice(0, 10),
  url: p.url,
  mainEntityOfPage: p.url,
  inLanguage: 'en-IN',
  image: p.image,
  isPartOf: { '@type': 'Blog', name: 'Life at Aikkya', url: `${base}/journal/` },
  author: site.hosts.map((name) => ({ '@type': 'Person', name })),
  publisher: { '@id': `${base}/#aikkya` },
});

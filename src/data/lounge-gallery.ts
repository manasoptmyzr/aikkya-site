import type { ImageMetadata } from 'astro';
const images = import.meta.glob<ImageMetadata>('../assets/photos/lounge-gallery/*.jpg', { eager: true, import: 'default' });
const descriptions: Record<number, string> = {
  3694: 'A view through the open doors into Aikkya lounge',
  3695: 'The lounge dining table, bookshelves and kitchen counter beneath the wooden roof',
  3696: 'A wide view across the lounge toward the windows and dining area',
  3697: 'A wooden table beneath the lounge windows and framed mountain artwork',
  3698: 'A cane chair and table beside the tall lounge windows',
  3699: 'The lounge seating corner beside open doors and a mountain view',
  3700: 'Vintage cameras and books on the lounge shelves',
  3701: 'Books and an open newspaper on a lounge shelf',
  3702: 'Books, objects and a vintage typewriter on the lounge shelves',
  3703: 'A close view of the vintage typewriter in the lounge',
  3704: 'A framed mountain drawing beneath a picture light in the lounge',
  3705: 'Mountain artwork on the whitewashed lounge wall between two windows',
  3706: 'The bookshelves and kitchen counter beside a warm woven pendant light',
  3707: 'A framed mushroom drawing beside the lounge window',
  3708: 'Hanging wooden lights above the lounge sofa',
  3709: 'Open lounge doors framing a hammock and greenery outside',
  3710: 'A collection of animal figures on the wooden lounge windowsill',
  3711: 'Wooden mushroom ornaments and a globe on the lounge windowsill',
  3712: 'The lounge sofa and low table beside open doors facing the hillside',
  3713: 'The dining table beneath a woven pendant beside the lounge windows',
  3714: 'A sofa and wooden coffee table in the lounge window corner',
};
function row(format: 'landscape' | 'portrait', ids: number[]) {
 return { format, photos: ids.map(id => {
  const src = images[`../assets/photos/lounge-gallery/img_${id}-enhanced.jpg`];
  if (!src || !descriptions[id]) throw new Error(`Missing lounge photo ${id}`);
  return { src, alt: descriptions[id] };
 }) };
}
export const loungeGroups = [
  { label: 'Lounge and kitchen', rows: [
    row('landscape', [3695]),
    row('landscape', [3694, 3696]),
    row('landscape', [3697, 3699]),
    row('portrait', [3698, 3713]),
    row('landscape', [3712]),
    row('portrait', [3714, 3709, 3708]),
  ] },
  { label: 'Books and collected objects', rows: [
    row('landscape', [3706]),
    row('portrait', [3702, 3700]),
    row('portrait', [3701, 3703]),
    row('landscape', [3710]),
    row('portrait', [3711]),
  ] },
  { label: 'Artwork and details', rows: [
    row('portrait', [3704, 3705]),
    row('landscape', [3707]),
  ] },
];

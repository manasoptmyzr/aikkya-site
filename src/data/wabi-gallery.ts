import type { ImageMetadata } from 'astro';
const images = import.meta.glob<ImageMetadata>('../assets/photos/wabi-gallery/*.jpg', { eager: true, import: 'default' });
const descriptions: Record<number, string> = {
  9631: 'Wabi study with a white door, woven wall hangings and the painted floor',
  9632: 'Wabi day bed beside an orange rug, a small fireplace and a wooden door',
  9633: 'The day bed and mountain artwork on the textured wall in Wabi study',
  9634: 'Striped cushions on the Wabi day bed beside an open door and window',
  9635: 'A mountain relief artwork framed above the Wabi day bed',
  9637: 'A doorway between Wabi study and bedroom beside a mountain relief artwork',
  9638: 'The day bed, woven hanging and small fireplace beneath Wabi exposed roof beams',
  9639: 'Wabi bedroom with a blue bedcover, white timber beams and warm bedside lamps',
  9640: 'Wabi bedroom sitting area with two white chairs, a fireplace and a blue mosaic plate',
  9641: 'The mirror and decorated whitewashed fireplace mantel in Wabi',
  9642: 'Dried flowers, small objects and an oval mirror on the Wabi fireplace mantel',
  9643: 'A framed picture and curtained doorway beside a bedside lamp in Wabi',
  9644: 'The Wabi bed beneath white beams, with lit stone niches and a picture above the headboard',
  9645: 'A view of the Wabi bed, bedside lamps and framed branch artwork',
  9646: 'A framed branch artwork above Wabi bed, illuminated by a picture light',
  9647: 'A ceramic jug displayed in a small whitewashed stone niche in Wabi',
  9648: 'An oval mirror above the Wabi fireplace mantel and small decorative objects',
  9649: 'A wooden chest, white chair and woven hanging beneath the Wabi window',
  9650: 'Wabi wooden window and a small woven bin beside the painted floor',
  9651: 'A view across Wabi bed toward the wooden chest, window and doorway',
  9652: 'Two white chairs beside Wabi fireplace with a blue mosaic plate above',
  9653: 'A woven bedside lamp, a small tray and the blue bedcover in Wabi',
  9654: 'A white chair beneath the blue mosaic plate and a view of Wabi painted floor',
  9655: 'White chairs, a wooden chest and a window beside the patterned floor in Wabi',
  9657: 'Wabi bathroom with a white basin, toilet and wood ceiling',
  9658: 'A wide view into Wabi bathroom with its wooden ceiling, basin and window',
  9659: 'Wabi bathroom beneath a ceiling skylight, with a basin and toilet',
  9661: 'The basin and mirror beside the shower area in Wabi bathroom',
  9662: 'The white basin, wooden counter and mirror in Wabi bathroom',
  9663: 'Wabi bathroom mirror and basin beneath the wooden ceiling',
  9665: 'The skylight, white basin and shower area at the far end of Wabi bathroom',
};
function row(format: 'landscape' | 'portrait', ids: number[]) {
  return { format, photos: ids.map(id => {
    const src = images[`../assets/photos/wabi-gallery/img_${id}.jpg`];
    if (!src || !descriptions[id]) throw new Error(`Missing Wabi photo ${id}`);
    return { src, alt: descriptions[id] };
  }) };
}
export const wabiGroups = [
  { label: 'Wabi bed and bedroom', rows: [
    row('landscape', [9644]),
    row('landscape', [9645, 9639]),
    row('landscape', [9651]),
    row('landscape', [9646]),
  ] },
  { label: 'Wabi furniture and sitting areas', rows: [
    row('landscape', [9632]),
    row('landscape', [9633, 9634]),
    row('landscape', [9638, 9652]),
    row('landscape', [9649, 9655]),
  ] },
  { label: 'Wabi artwork and room details', rows: [
    row('landscape', [9635]),
    row('landscape', [9647, 9641]),
  ] },
  { label: 'Wabi bathroom', rows: [
    row('landscape', [9658, 9665]),
    row('portrait', [9663]),
  ] },
];
export const wabiCover = images['../assets/photos/wabi-gallery/img_9635.jpg'];

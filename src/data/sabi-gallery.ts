import type { ImageMetadata } from 'astro';
const images = import.meta.glob<ImageMetadata>('../assets/photos/sabi-gallery/*.jpg', { eager: true, import: 'default' });
const descriptions: Record<number, string> = {
  9670: 'The Sabi sitting room with its fireplace, round mirror and day bed',
  9671: 'A cane rocking chair with cushions beside the Sabi doorway',
  9672: 'The fireplace and day bed beneath Sabi exposed roof beams',
  9673: 'The round mirror above Sabi fireplace beside the wooden door',
  9674: 'A wide view of Sabi day bed, fireplace and curtained window',
  9675: 'The striped day bed and woven wall hanging beneath a Sabi window',
  9676: 'A rocking chair beside the circular forest artwork in Sabi',
  9677: 'The round wooden mirror and small objects on Sabi fireplace mantel',
  9678: 'A view through the wooden doorway into Sabi bedroom',
  9680: 'Sabi bedroom seen through the open wooden door',
  9681: 'The Sabi bed with its blue cover, white timber post and warm bedside lamps',
  9682: 'Sabi bedroom fireplace and bed beside the painted stone floor',
  9683: 'The Sabi bedroom window, chair and drinks tray',
  9684: 'A bedside lamp and chair beside Sabi bed and window',
  9685: 'Abstract artwork and dried flowers above the whitewashed fireplace in Sabi',
  9686: 'Dried flowers and a ceramic jug in a stone niche beside Sabi artwork',
  9687: 'The Sabi bed between two warmly lit bedside niches',
  9688: 'A bedside lamp in a stone niche beside Sabi blue bedcover',
  9689: 'Sabi chairs and table beside the doorway and painted floor',
  9690: 'Sabi wooden door beside the chairs and white timber post',
  9691: 'The Sabi bed, bedside lamp and shuttered window',
  9692: 'Sabi blue bedcover and bedside lamp beneath the exposed roof beams',
  9693: 'White wooden shutters and a bedside lamp in Sabi bedroom',
  9694: 'A rocking chair seen through the Sabi doorway',
  9695: 'A close view through the wooden door into Sabi bedroom',
  9697: 'Two Sabi chairs and a small table beneath framed artwork',
  9698: 'A close view of Sabi abstract artwork and a vase of dried flowers',
  9699: 'Sabi bathroom with a white basin, toilet and wooden ceiling',
  9700: 'The basin and curtained window in Sabi bathroom',
  9701: 'A skylight above the white basin in Sabi bathroom',
  9703: 'The white basin, mirror and shower area in Sabi bathroom',
  9705: 'The shower curtain and basin beneath Sabi bathroom wooden ceiling',
  9706: 'The rocking chair and circular forest artwork beside Sabi day bed',
  9707: 'A view through the doorway toward Sabi bathroom basin and mirror',
  9708: 'Two Sabi chairs and a table beneath illuminated artwork',
};
function row(format: 'landscape' | 'portrait', ids: number[]) {
  return { format, photos: ids.map(id => {
    const src = images[`../assets/photos/sabi-gallery/img_${id}.jpg`];
    if (!src || !descriptions[id]) throw new Error(`Missing Sabi photo ${id}`);
    return { src, alt: descriptions[id] };
  }) };
}
export const sabiGroups = [
  { label: 'Sabi bed and bedroom', rows: [
    row('landscape', [9687]),
    row('landscape', [9681]),
    row('landscape', [9691, 9684]),
    row('portrait', [9678, 9692]),
    row('portrait', [9695, 9683]),
  ] },
  { label: 'Sabi furniture and sitting areas', rows: [
    row('landscape', [9676]),
    row('landscape', [9672, 9706]),
    row('landscape', [9689]),
    row('portrait', [9690, 9694]),
  ] },
  { label: 'Sabi artwork and room details', rows: [
    row('landscape', [9685, 9698]),
  ] },
  { label: 'Sabi bathroom', rows: [
    row('landscape', [9700]),
    row('landscape', [9705, 9707]),
  ] },
];
export const sabiCover = images['../assets/photos/sabi-gallery/img_9676.jpg'];

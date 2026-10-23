import type { ImageMetadata } from 'astro';
const images = import.meta.glob<ImageMetadata>('../assets/photos/aframe-gallery/*.jpg', { eager: true, import: 'default' });
const descriptions: Record<string, string> = {
  '4804': 'The A-frame cottage and its stone patio beneath flowering branches',
  '4842': 'The A-frame roof among trees beside garden steps',
  '4846': 'Golden sunlight through the A-frame entrance screens toward the stone path',
  '4845': 'The open A-frame entrance looking out to a tree and stone path',
  '4847': 'Patterned sunlight on the A-frame wooden cupboard and bench',
  '4848': 'A garden tree and stone path framed by the A-frame entrance screen',
  '4809': 'A view through the wooden entrance doors toward the A-frame sofa',
  '4805': 'The A-frame sofa and loft stairs framed by open cane-panelled doors',
  '4806': 'The A-frame sofa beneath a woven wall hanging beside the loft stairs',
  '4810': 'The grey sofa, woven hanging and stairs in the A-frame living room',
  '4811': 'A wooden chair beside the A-frame glass wall and loft staircase',
  '4812': 'A wooden armchair and patterned rug beside the A-frame stairs and windows',
  '4827': 'The A-frame stairs, wooden chest and armchair beside tall windows',
  '4813': 'The A-frame mirror, grey cupboards and drinks shelf',
  '4814': 'A small desk and chair beneath the A-frame loft stairs',
  '4815': 'The curtained storage area and mirror above the A-frame cupboards',
  '4830': 'The A-frame loft bed beneath the triangular timber roof and bedside lamps',
  '4832': 'The loft bed and small window on the A-frame timber wall',
  '4833': 'Sunlight on the A-frame loft bed beside a sloping timber wall and window',
  '4834': 'A bedside lamp and grey headboard against the A-frame timber wall',
  '4835': 'A close view of the A-frame bedside lamp and quilted bedcover',
  '4841': 'The hill view through the A-frame triangular windows from the loft bed',
  '4840': 'A view from the A-frame loft across the glass gable toward the green hillside',
  '4838': 'The A-frame glass gable, curtains and valley view above the loft bed',
  '4836': 'The loft side window and timber ceiling beside the A-frame glass gable',
  '4839': 'Sunlit hills framed by the A-frame triangular window and curtains',
  'sunset': 'Sunset through the A-frame loft windows, seen from the bed',
  '4787': 'Two dogs resting on the A-frame loft bed beside the triangular window',
  '4825': 'The A-frame bathroom shower, white curtain and round basin',
  '4824': 'The A-frame bathroom window, toilet and grey shower walls',
  '4826': 'The round bathroom basin and mirror beneath wooden shelves in the A-frame',
};
function row(format: 'landscape' | 'portrait', ids: string[]) {
 return { format, photos: ids.map(id => {
  const src = images[`../assets/photos/aframe-gallery/aframe-${id}-enhanced.jpg`];
  if (!src || !descriptions[id]) throw new Error(`Missing A-frame photo ${id}`);
  return { src, alt: descriptions[id] };
 }) };
}
export const aframeGroups = [
  { label: 'A-frame sunset view', rows: [
    row('portrait', ['sunset']),
  ] },
  { label: 'A-frame outside', rows: [
    row('landscape', ['4804']),
    row('landscape', ['4842']),
  ] },
  { label: 'A-frame living room and furniture', rows: [
    row('landscape', ['4806', '4811']),
    row('landscape', ['4813']),
  ] },
  { label: 'A-frame loft and bedroom', rows: [
    row('landscape', ['4830']),
    row('portrait', ['4838']),
    row('landscape', ['4840']),
  ] },
  { label: 'A-frame entrance and garden details', rows: [
    row('portrait', ['4845', '4847', '4848']),
  ] },
  { label: 'A-frame bathroom', rows: [
    row('landscape', ['4825', '4824']),
  ] },
];

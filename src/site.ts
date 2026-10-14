// The facts about Aikkya, kept in one place.
// Change a phone number, a price or a link here and every page picks it up.

export const site = {
  name: 'Aikkya',
  fullName: 'Aikkya Farms',
  scripts: { hindi: 'ऐक्य', bangla: 'ঐক্য' },
  hosts: ['Shivani', 'Avijeet'],
  description:
    'A farm stay on a quiet hillside in Seetla, near Mukteshwar in Kumaon, Uttarakhand. Restored stone houses, an A-frame, home-cooked food, sunsets, cows and dogs. Run by Shivani and Avijeet, who host a few guests at a time.',

  phone: '+91 96500 30634',
  whatsapp: '919650030634',
  instagram: 'https://www.instagram.com/aikkyafarms/',
  instagramHandle: '@aikkyafarms',

  address: {
    street: 'Seetla Road',
    locality: 'Seetla, Mukteshwar',
    district: 'Nainital',
    region: 'Uttarakhand',
    postalCode: '263158',
    country: 'IN',
  },
  geo: { lat: 29.4869169, lng: 79.6277117 },
  mapUrl: 'https://www.google.com/maps?cid=2357384637216832053',

  checkIn: '14:00',
  checkOut: '11:00',

  // Prices per night, for two people, breakfast included.
  prices: {
    wabiSabi: 8500,
    kintsugi: 9500,
    aFrame: 9500,
    extraGuest: 1000,
  },

  // Other places Aikkya is listed. Used for search engines and AI tools, not shown as buttons.
  elsewhere: [
    'https://www.instagram.com/aikkyafarms/',
    'https://www.airbnb.co.in/rooms/53898656',
    'https://www.airbnb.co.uk/rooms/616983435239203416',
    'https://www.tripadvisor.in/Hotel_Review-g27106063-d27170536-Reviews-Aikkya_Farms-Baret_Nainital_District_Uttarakhand.html',
    'https://www.raahghar.com/hs/aikkya-farms',
  ],
};

export const rupees = (n: number) => '₹' + n.toLocaleString('en-IN');

const hello = `Hello Shivani and Avijeet,

We are:
We'd like to come around (dates):
How many of us:
What brings us to Aikkya:
`;

export const whatsappLink = (text = hello) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

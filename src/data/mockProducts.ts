import { Product, LookbookPost, Order, UserProfile } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'bf-01',
    name: 'ONYX HEAVYWEIGHT OVERSIZED TEE',
    subtitle: '280 GSM Combed French Terry Cotton',
    price: 1299,
    originalPrice: 1999,
    fit: 'Oversized',
    gsm: 280,
    material: '100% Organic Heavyweight Combed Cotton',
    description: 'Engineered for the ultimate dropped silhouette. Crafted from custom-milled 280 GSM cotton with high-density reactive black dye that resists fading through 100+ washes. Reinforced 1.25" rib collar and blind-stitched hem.',
    features: [
      '280 GSM Custom Heavyweight Jersey',
      'Pre-shrunk to 0% shrinkage guarantee',
      'Signature dropped shoulder drape',
      'Dense 1.25" crew neckband that retains structure',
      'Minimalist tonal obsidian embroidery at nape'
    ],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 15 },
      { size: 'M', stock: 24 },
      { size: 'L', stock: 19 },
      { size: 'XL', stock: 12 },
      { size: 'XXL', stock: 5 },
      { size: '3XL', stock: 3 }
    ],
    isNewDrop: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 142,
    tag: 'SIGNATURE DROP 01'
  },
  {
    id: 'bf-02',
    name: 'OBSIDIAN BOXYFIT ESSENTIAL TEE',
    subtitle: '260 GSM Structured Box Silhouette',
    price: 1099,
    originalPrice: 1599,
    fit: 'BoxyFit',
    gsm: 260,
    material: '100% Pima Heavyweight Compact Cotton',
    description: 'A cropped, ultra-wide boxy silhouette inspired by 90s architectural minimalism. Sits precisely at the waistline with elongated sleeve openings for an effortless layered aesthetic.',
    features: [
      '260 GSM Compact Interlock Cotton',
      'High boxy ratio: widened torso with cropped length',
      'Thickened double-needle neckline',
      'Matte pitch-black finish',
      'Zero side-seam tubular construction'
    ],
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 14 },
      { size: 'XL', stock: 7 },
      { size: 'XXL', stock: 2 }
    ],
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 98,
    tag: 'CORE BOXYFIT'
  },
  {
    id: 'bf-03',
    name: 'ACID FADE PHANTOM STANDARD TEE',
    subtitle: '300 GSM Heavy Mineral Standard Cotton',
    price: 1499,
    originalPrice: 2199,
    fit: 'Standard',
    gsm: 300,
    material: '100% Heavy Distressed Cotton',
    description: 'Each piece undergoes a proprietary 6-stage charcoal mineral acid wash, resulting in unique shadowy grey-black undertones with subtle distressing on hem and collar.',
    features: [
      '300 GSM Ultra-Heavyweight Terry Cotton',
      'Individual stone and acid washed nuance',
      'Subtle distress detailing around neckline',
      'Softened hand-feel with indestructible weight',
      'Classic standard balanced drape'
    ],
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'XS', stock: 4 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 16 },
      { size: 'L', stock: 8 },
      { size: 'XL', stock: 4 },
      { size: 'XXL', stock: 1 }
    ],
    isNewDrop: true,
    rating: 4.95,
    reviewsCount: 86,
    tag: 'STANDARD EDITION'
  },
  {
    id: 'bf-04',
    name: 'SHADOW DROP-SHOULDER LUXURY TEE',
    subtitle: '240 GSM Mercerized Egyptian Giza Cotton',
    price: 1399,
    originalPrice: 1999,
    fit: 'Oversized',
    gsm: 240,
    material: '100% Long-Staple Mercerized Cotton',
    description: 'Tailored with subtle luster and silky drape. Designed for formal streetwear dressing, featuring laser-cut edges and ultra-clean seamless hems.',
    features: [
      '240 GSM Mercerized Cotton with deep obsidian luster',
      'Anti-pilling enzyme treated',
      'Tailored dropped shoulder line',
      'Hidden silicone care-label',
      'Temperature regulating natural breathability'
    ],
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'S', stock: 9 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 11 },
      { size: 'XXL', stock: 6 }
    ],
    rating: 4.7,
    reviewsCount: 64,
    tag: 'LUXURY TIER'
  },
  {
    id: 'bf-05',
    name: 'ECLIPSE BOXYFIT MOCKNECK TEE',
    subtitle: '270 GSM High-Rib Architectural Neck',
    price: 1249,
    originalPrice: 1799,
    fit: 'BoxyFit',
    gsm: 270,
    material: '95% Compact Cotton, 5% Elastane Collar Stay',
    description: 'Features a 1.75" raised mockneck collar engineered never to sag or stretch out. Imparts an elevated, sculptural presence under blazers or worn solo.',
    features: [
      '270 GSM Dense Interlock Knit',
      'Reinforced 1.75" architectural mock collar',
      'Structured relaxed drape through torso',
      'Durable color-lock pitch black yarn',
      'Double stitch reinforced cuffs'
    ],
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'M', stock: 14 },
      { size: 'L', stock: 19 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 4 }
    ],
    isNewDrop: true,
    rating: 4.88,
    reviewsCount: 52,
    tag: 'BOXYFIT CUT'
  },
  {
    id: 'bf-06',
    name: 'CARBON STANDARD EVERYDAY HEAVY TEE',
    subtitle: '240 GSM Classic Standard Combed Cotton',
    price: 999,
    originalPrice: 1499,
    fit: 'Standard',
    gsm: 240,
    material: '100% Ringspun Combed Standard Cotton',
    description: 'The definitive daily standard uniform. Clean unbranded finish, balanced classic regular drape with adequate room through chest and arms.',
    features: [
      '240 GSM Classic Heavy Standard Cotton',
      'Clean unbranded minimalist aesthetic',
      'Tagless neck label for frictionless comfort',
      'Garment washed for immediate broken-in softness',
      'Reinforced shoulder-to-shoulder taped seams'
    ],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'XS', stock: 10 },
      { size: 'S', stock: 22 },
      { size: 'M', stock: 35 },
      { size: 'L', stock: 28 },
      { size: 'XL', stock: 16 },
      { size: 'XXL', stock: 8 },
      { size: '3XL', stock: 5 }
    ],
    isBestSeller: true,
    rating: 4.85,
    reviewsCount: 215,
    tag: 'ESSENTIAL STANDARD'
  },
  {
    id: 'bf-07',
    name: 'MONOLITH GYM T-SHIRT SCULPTED ATHLETIC',
    subtitle: '230 GSM Stretch Gym T-Shirt Performance Blend',
    price: 1199,
    originalPrice: 1699,
    fit: 'Gym T-shirt',
    gsm: 230,
    material: '92% Supima Cotton, 8% Spandex Performance Blend',
    description: 'Engineered specifically for bodybuilding, weightlifting, and athletic training. Fitted across shoulders, chest, and arms with a tapered waist for zero bulk during motion.',
    features: [
      '230 GSM 4-Way Micro-Stretch Gym Weave',
      'Sculpted athletic taper across biceps and chest',
      'Sweat-wicking interior yarn structure',
      'Anti-odor carbon coating',
      'Reinforced seams withstand heavy bench & squat sessions'
    ],
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 18 },
      { size: 'XL', stock: 9 }
    ],
    rating: 4.89,
    reviewsCount: 114,
    tag: 'GYM T-SHIRT'
  },
  {
    id: 'bf-08',
    name: 'GRAPHITE NOIR ARCHIVAL BACK-PRINT TEE',
    subtitle: '290 GSM High-Density Screenprint Statement',
    price: 1599,
    originalPrice: 2299,
    fit: 'Oversized',
    gsm: 290,
    material: '100% Raw Heavyweight Cotton',
    description: 'Features a tone-on-tone high-density gloss typographic graphic on back reciting the BLACKFITS manifesto: "BORN IN OBSIDIAN. SHAPED IN DISCIPLINE." Front chest features minimal matte coordinates.',
    features: [
      '290 GSM Ultra-Heavy Combed Cotton',
      'High-gloss tactile puff print on reverse',
      'Precision geo-coordinates on front left chest',
      'Custom serialized woven hem label',
      'Oversized drop-sleeve silhouette'
    ],
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 5 },
      { size: 'XXL', stock: 2 }
    ],
    isNewDrop: true,
    rating: 4.92,
    reviewsCount: 79,
    tag: 'ARCHIVAL STATEMENT'
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Alex Vance',
  email: 'alex.vance@blackfits.com',
  phone: '+1 (555) 382-9012',
  preferredFit: 'Oversized',
  preferredSize: 'L',
  addresses: [
    {
      id: 'addr-1',
      name: 'Alex Vance (Studio)',
      street: '742 Evergreen Onyx District, Apt 4B',
      city: 'Brooklyn',
      state: 'New York',
      postalCode: '11201',
      country: 'United States',
      phone: '+1 (555) 382-9012',
      isDefault: true
    },
    {
      id: 'addr-2',
      name: 'Alex Vance (Office)',
      street: '100 Obsidian Avenue, Floor 12',
      city: 'Manhattan',
      state: 'New York',
      postalCode: '10013',
      country: 'United States',
      phone: '+1 (555) 382-9012',
      isDefault: false
    }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'BF-88421',
    date: '2026-09-26',
    items: [
      {
        productId: 'bf-01',
        name: 'ONYX HEAVYWEIGHT OVERSIZED TEE',
        size: 'L',
        fit: 'Oversized',
        price: 1299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'bf-03',
        name: 'ACID FADE PHANTOM STANDARD TEE',
        size: 'L',
        fit: 'Standard',
        price: 1499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 2798,
    shipping: 0,
    discount: 419,
    total: 2379,
    status: 'Out for Delivery',
    shippingAddress: INITIAL_USER.addresses[0],
    paymentMethod: 'Credit / Debit Card',
    paymentStatus: 'Paid',
    trackingNumber: 'BFX-99482103US',
    carrier: 'Black Express Courier',
    estimatedDelivery: 'Today, by 7:00 PM',
    trackingSteps: [
      { status: 'Order Placed', date: 'Sep 26, 09:30 AM', location: 'Website Checkout', completed: true },
      { status: 'Quality Check & Packing', date: 'Sep 26, 02:15 PM', location: 'BlackFits Central Vault, NY', completed: true },
      { status: 'Dispatched', date: 'Sep 27, 07:00 AM', location: 'Logistics Hub, Queens', completed: true },
      { status: 'Out for Delivery', date: 'Sep 28, 08:45 AM', location: 'Local Delivery Van (Driver: Marco)', completed: true, current: true },
      { status: 'Delivered', date: 'Estimated 7:00 PM', location: 'Front Door / Studio', completed: false }
    ]
  },
  {
    id: 'BF-81204',
    date: '2026-09-12',
    items: [
      {
        productId: 'bf-02',
        name: 'OBSIDIAN BOXYFIT ESSENTIAL TEE',
        size: 'L',
        fit: 'BoxyFit',
        price: 1099,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 2198,
    shipping: 0,
    discount: 0,
    total: 2198,
    status: 'Delivered',
    shippingAddress: INITIAL_USER.addresses[0],
    paymentMethod: 'Apple Pay / Google Pay',
    paymentStatus: 'Paid',
    trackingNumber: 'BFX-72100492US',
    carrier: 'Black Express Courier',
    estimatedDelivery: 'Delivered on Sep 14',
    trackingSteps: [
      { status: 'Order Placed', date: 'Sep 12, 11:20 AM', location: 'Website Checkout', completed: true },
      { status: 'Quality Check & Packing', date: 'Sep 12, 04:00 PM', location: 'BlackFits Central Vault, NY', completed: true },
      { status: 'Dispatched', date: 'Sep 13, 08:30 AM', location: 'Logistics Hub, Queens', completed: true },
      { status: 'Out for Delivery', date: 'Sep 14, 09:15 AM', location: 'Local Courier', completed: true },
      { status: 'Delivered', date: 'Sep 14, 02:40 PM', location: 'Delivered to recipient', completed: true, current: true }
    ]
  }
];

export const LOOKBOOK_POSTS: LookbookPost[] = [
  {
    id: 'lb-1',
    image: '/images/lookbook/oversized_model.png',
    caption: 'Tokyo night walk in the 280 GSM Onyx Oversized. Architectural drape that never loses shape.',
    likes: 1240,
    productName: 'ONYX HEAVYWEIGHT OVERSIZED TEE',
    productId: 'bf-01',
    fitTag: 'Oversized'
  },
  {
    id: 'lb-2',
    image: '/images/lookbook/boxyfit_model.png',
    caption: 'Clean proportions. BoxyFit with wide sleeves layered over heavy cargos.',
    likes: 890,
    productName: 'OBSIDIAN BOXYFIT ESSENTIAL TEE',
    productId: 'bf-02',
    fitTag: 'BoxyFit'
  },
  {
    id: 'lb-3',
    image: '/images/lookbook/standard_model.png',
    caption: 'Subtle mineral wash nuances. The Acid Fade Phantom in direct daylight.',
    likes: 2150,
    productName: 'ACID FADE PHANTOM STANDARD TEE',
    productId: 'bf-03',
    fitTag: 'Standard'
  },
  {
    id: 'lb-4',
    image: '/images/lookbook/oversized_model1.png',
    caption: 'Elevated mockneck. Designed for blazers and raw denim pairing.',
    likes: 1530,
    productName: 'STEALTH TECHNICAL GYM TEE',
    productId: 'bf-04',
    fitTag: 'Gym T-shirt'
  }
];

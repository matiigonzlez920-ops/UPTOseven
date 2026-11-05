export interface CapsulaMerchItem {
  id: string;
  name: string;
  category: 'Ropa' | 'Accesorios' | 'Colección';
  tagline: string;
  description: string;
  image: string;
  badge: string;
  sizes?: string[];
  rarity: 'Común' | 'Rara' | 'Ultra Rara' | 'Edición Especial';
}

export interface DispenserSpot {
  id: string;
  name: string;
  subname: string;
  zone: string;
  address: string;
  description: string;
  hours: string;
  status: 'Activo' | 'Últimas Cápsulas' | 'Alta Demanda';
  stockPercent: number;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  dispenserModel: string;
}

export const ROSARIO_DISPENSER_SPOTS: DispenserSpot[] = [
  {
    id: 'parque-espana',
    name: 'Parque España',
    subname: 'Dispenser 01 • "Escalinatas del Paraná"',
    zone: 'Costanera Centro',
    address: 'Sarmiento y el Río Paraná (Playón Superior)',
    description:
      'Sobre la icónica terraza de adoquines mirando las islas del Paraná y el Centro Cultural Parque de España. Terminal interactiva táctil con salida presurizada de cápsulas.',
    hours: 'Todos los días • 09:00 a 21:30 hs',
    status: 'Activo',
    stockPercent: 92,
    latitude: -32.937667,
    longitude: -60.637667,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-32.937667,-60.637667',
    dispenserModel: '7UP Eco-Chilled Capsule Unit',
  },
  {
    id: 'monumento',
    name: 'Monumento a la Bandera',
    subname: 'Dispenser 02 • "El Mirador del Río"',
    zone: 'Costanera Histórica',
    address: 'Av. Belgrano 500 (Parque Nacional a la Bandera)',
    description:
      'Instalado junto a la explanada fluvial con vista al Río Paraná y la torre de la Cripta. Dispenser vintage retroiluminado en verde esmeralda con salida presurizada.',
    hours: 'Lunes a Domingo • 10:00 a 20:30 hs',
    status: 'Activo',
    stockPercent: 95,
    latitude: -32.9477,
    longitude: -60.6305,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-32.9477,-60.6305',
    dispenserModel: '7UP Vending-Matic 1982 Series',
  },
  {
    id: 'plaza-san-martin',
    name: 'Plaza San Martín',
    subname: 'Dispenser 03 • "Paseo del Siglo"',
    zone: 'Paseo del Siglo',
    address: 'Córdoba & Moreno (Frente a Casa de Gobierno)',
    description:
      'En el corazón cívico y patrimonial del Paseo del Siglo, frente a los jardines de Plaza San Martín y la Ex Jefatura. Reposición diaria garantizada.',
    hours: 'Lunes a Sábado • 09:00 a 21:00 hs',
    status: 'Alta Demanda',
    stockPercent: 78,
    latitude: -32.9431,
    longitude: -60.6489,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-32.9431,-60.6489',
    dispenserModel: '7UP Downtown Vending Tower',
  },
  {
    id: 'centro-astronomico',
    name: 'Centro Astronómico Municipal',
    subname: 'Dispenser 04 • "Planetario & Parque Urquiza"',
    zone: 'Parque Urquiza',
    address: 'Av. Diario La Capital 1602 (Parque Urquiza)',
    description:
      'Ubicado en el predio del Planetario y Observatorio de Rosario, en las barrancas del Parque Urquiza con vista panorámica al río y cielo abierto.',
    hours: 'Martes a Domingo • 14:00 a 22:00 hs',
    status: 'Activo',
    stockPercent: 88,
    latitude: -32.959722,
    longitude: -60.623778,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-32.959722,-60.623778',
    dispenserModel: '7UP Orbit Capsule Station',
  },
];

export const CAPSULA_MERCH_ITEMS: CapsulaMerchItem[] = [
  {
    id: 'tshirt-vintage',
    name: 'Remera Boxy Cherry 7UP',
    category: 'Ropa',
    tagline: '100% Algodón Pesado 24/1 • Edición Cápsula Limitada',
    description:
      'Corte relajado de hombros caídos con serigrafía al agua en pecho y espalda. Incluye etiqueta conmemorativa de la cápsula 7UP.',
    image: '/remera-boxy-cherry-7up.png',
    badge: 'MÁS BUSCADA',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rarity: 'Edición Especial',
  },
  {
    id: 'pant-cargo',
    name: 'Pantalón Cargo 7UP Streetwear',
    category: 'Ropa',
    tagline: 'Corte relaxed fit con bolsillos utilitarios y detalles 7UP',
    description:
      'Pantalón técnico urbano con cintura elástica regulable, puños ajustables y parche conmemorativo de la cápsula 7UP.',
    image: '/pant.png',
    badge: 'DROP LIMITADO',
    sizes: ['S', 'M', 'L', 'XL'],
    rarity: 'Ultra Rara',
  },
  {
    id: 'cap-fido',
    name: 'Gorra 7UP "Up to Seven"',
    category: 'Accesorios',
    tagline: 'Corona de algodón marfil • Visera verde esmeralda con bordado 3D',
    description:
      'Gorra de 5 paneles con bordado en relieve "Up to seven" en el frente, detalle bordado "7up" en el lateral y visera contrastada en verde bosque.',
    image: '/gorra.png',
    badge: 'DROP LIMITADO',
    sizes: ['Talle Único Regulable'],
    rarity: 'Rara',
  },
  {
    id: 'tumbler-steel',
    name: 'Vaso Térmico Efervescente 500ml',
    category: 'Colección',
    tagline: 'Doble pared de acero quirúrgico 304 con aislación al vacío',
    description:
      'Mantiene tu 7UP con hielo durante 18 horas sin transpirar el exterior. Tapa hermética con boquilla ergonómica y pintura electrostática verde mate.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    badge: 'ACERO 304',
    sizes: ['500 ml'],
    rarity: 'Rara',
  },
];

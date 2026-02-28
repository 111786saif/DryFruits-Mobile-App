// Mock data for the DryFruits application

export const MOCK_USER = {
  id: '1',
  name: 'John Doe',
  email: 'test@example.com',
  token: 'mock-jwt-token-12345',
  avatar: 'https://i.pravatar.cc/150?u=john',
};

export const MOCK_CATEGORIES = [
  { id: '1', name: 'Nuts', icon: 'nut', image: 'https://images.unsplash.com/photo-1536622432212-cd121741bc48?q=80&w=400&auto=format&fit=crop' },
  { id: '2', name: 'Dried Fruits', icon: 'fruit-cherries', image: 'https://images.unsplash.com/photo-1595000000000-000000000000?q=80&w=400&auto=format&fit=crop' },
  { id: '3', name: 'Seeds', icon: 'seed', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop' },
  { id: '4', name: 'Exotic Sweets', icon: 'candy', image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=400&auto=format&fit=crop' },
  { id: '5', name: 'Gift Boxes', icon: 'gift', image: 'https://images.unsplash.com/photo-1549465220-1d8c9d9c6703?q=80&w=400&auto=format&fit=crop' },
];

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Almonds',
    price: 25.0,
    old_price: 30.0,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d96?q=80&w=400&auto=format&fit=crop',
    categoryId: '1',
    category: { name: 'Nuts' },
    description: 'Crunchy and nutritious premium almonds. Perfect for a healthy snack or as an ingredient in your favorite recipes.',
    rating: 4.8,
    reviews: 124,
    stock: 50,
  },
  {
    id: '2',
    name: 'Walnut Kernels',
    price: 40.0,
    image: 'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?q=80&w=400&auto=format&fit=crop',
    categoryId: '1',
    category: { name: 'Nuts' },
    description: 'High-quality walnut kernels, rich in Omega-3 fatty acids. Great for brain health and heart health.',
    rating: 4.6,
    reviews: 89,
    stock: 35,
  },
  {
    id: '3',
    name: 'Dried Apricots',
    price: 15.0,
    old_price: 18.0,
    image: 'https://images.unsplash.com/photo-1595000000000-000000000000?q=80&w=400&auto=format&fit=crop',
    categoryId: '2',
    category: { name: 'Dried Fruits' },
    description: 'Sweet and chewy dried apricots. Naturally sun-dried to preserve their delicious flavor and nutrients.',
    rating: 4.5,
    reviews: 56,
    stock: 100,
  },
  {
    id: '4',
    name: 'Pistachios Roasted',
    price: 35.0,
    image: 'https://images.unsplash.com/photo-1543157145-f78c636d023d?q=80&w=400&auto=format&fit=crop',
    categoryId: '1',
    category: { name: 'Nuts' },
    description: 'Lightly salted and perfectly roasted pistachios. A crowd favorite for any gathering.',
    rating: 4.9,
    reviews: 210,
    stock: 20,
  },
  {
    id: '5',
    name: 'Cashew Nuts',
    price: 22.0,
    image: 'https://images.unsplash.com/photo-1536622432212-cd121741bc48?q=80&w=400&auto=format&fit=crop',
    categoryId: '1',
    category: { name: 'Nuts' },
    description: 'Large, creamy cashew nuts. Ideal for snacking or adding a rich texture to your curries.',
    rating: 4.7,
    reviews: 145,
    stock: 60,
  },
  {
    id: '6',
    name: 'Dates Medjool',
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=400&auto=format&fit=crop',
    categoryId: '2',
    category: { name: 'Dried Fruits' },
    description: 'King of dates - Medjool. Large, soft, and incredibly sweet. A natural energy booster.',
    rating: 4.9,
    reviews: 320,
    stock: 15,
  },
  {
    id: '7',
    name: 'Pumpkin Seeds',
    price: 10.0,
    image: 'https://images.unsplash.com/photo-1590543690616-77884102d53a?q=80&w=400&auto=format&fit=crop',
    categoryId: '3',
    category: { name: 'Seeds' },
    description: 'Raw pumpkin seeds, packed with magnesium and zinc. Perfect for salads or a quick snack.',
    rating: 4.4,
    reviews: 42,
    stock: 80,
  },
  {
    id: '8',
    name: 'Mixed Berries',
    price: 28.0,
    old_price: 32.0,
    image: 'https://images.unsplash.com/photo-1534002133490-63941237ed36?q=80&w=400&auto=format&fit=crop',
    categoryId: '2',
    category: { name: 'Dried Fruits' },
    description: 'A delightful mix of dried cranberries, blueberries, and goji berries. High in antioxidants.',
    rating: 4.7,
    reviews: 95,
    stock: 45,
  },
];

export const MOCK_BANNERS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=1000&auto=format&fit=crop',
    title: 'Supreme Mixed Nuts',
    subtitle: 'A handful of health every day. Save 25%',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1000&auto=format&fit=crop',
    title: 'Premium Cashews',
    subtitle: 'Creamy, crunchy & delicious. New Arrivals.',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=1000&auto=format&fit=crop',
    title: 'Medjool Dates',
    subtitle: 'Nature\'s candy for instant energy booster.',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=1000&auto=format&fit=crop',
    title: 'Dried Exotic Berries',
    subtitle: 'Antioxidant rich snack for your cravings.',
  },
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-1024',
    date: '2026-02-15',
    status: 'Delivered',
    total: 85.50,
    items: [
      { id: '1', name: 'Premium Almonds', quantity: 2, price: 25.0 },
      { id: '2', name: 'Walnut Kernels', quantity: 1, price: 40.0 },
    ],
  },
  {
    id: 'ORD-0988',
    date: '2026-01-20',
    status: 'Processing',
    total: 42.00,
    items: [
      { id: '5', name: 'Cashew Nuts', quantity: 2, price: 22.0 },
    ],
  },
];

export const MOCK_ADDRESSES = [
  {
    id: '1',
    type: 'Home',
    address: '123 Pine Street, Apartment 4B',
    city: 'Himalayan City',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Office',
    address: '456 Business Hub, Sector 12',
    city: 'Everest Valley',
    isDefault: false,
  },
];

export const MOCK_WISHLIST = [
  {
    id: '4',
    name: 'Pistachios Roasted',
    price: 35.0,
    image: 'https://images.unsplash.com/photo-1543157145-f78c636d023d?q=80&w=400&auto=format&fit=crop',
    category: { name: 'Nuts' },
  },
  {
    id: '6',
    name: 'Dates Medjool',
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=400&auto=format&fit=crop',
    category: { name: 'Dried Fruits' },
  },
];

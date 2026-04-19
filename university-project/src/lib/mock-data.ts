export const MOCK_CATEGORIES = [

  {
    id: "cat_2",
    name: "Fashion",
    slug: "fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    _count: { products: 86 }
  },


];

export const MOCK_PRODUCTS = [

  
  {
    id: "5",
    name: "Organic Linen Shirt",
    slug: "organic-linen-shirt",
    description: "Breathable, sustainable, and perfect for summer days. Crafted from 100% certified organic linen.",
    price: 89.00,
    discountPrice: 65.00,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c"],
    category: { name: "Fashion", slug: "fashion" },
    rating: 4.6,
    isNew: true,
    stock: 150,
  },

];

export const MOCK_ORDERS = [
  {
    id: "ORD-98125",
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    status: "DELIVERED",
    total: 1314.99,
    items: [
      {
        id: "item-1",
        quantity: 1,
        price: 1299.99,
        product: {
          name: "Ultra HD Pro Laptop 16\"",
          images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"]
        }
      },
      {
        id: "item-2",
        quantity: 1,
        price: 15.00,
        product: {
          name: "Priority Shipping",
          images: []
        }
      }
    ]
  },
  {
    id: "ORD-98124",
    createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    status: "PROCESSING",
    total: 449.00,
    items: [
      {
        id: "item-3",
        quantity: 1,
        price: 449.00,
        product: {
          name: "Smart Series 8 Watch",
          images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"]
        }
      }
    ]
  }
];

export const initialProducts = [
  {
    id: 1,
    sku: "PRD-1001",
    name: "Farm Fresh Whole Milk",
    category: "Dairy & Eggs",
    price: 64.00,
    quantity: 45,
    unit: "Litre",
    minStock: 20,
    supplier: "Amul Dairy Corp",
    status: "In Stock",
    lastUpdated: "2026-09-01 10:30 AM",
    description: "Pasteurized homogenized fortified whole cow milk"
  },
  {
    id: 2,
    sku: "PRD-1002",
    name: "100% Whole Wheat Bread",
    category: "Bakery",
    price: 45.00,
    quantity: 8,
    unit: "Pcs",
    minStock: 15,
    supplier: "Britannia Industries",
    status: "Low Stock",
    lastUpdated: "2026-09-01 09:15 AM",
    description: "Zero maida high-fiber whole grain sliced loaf (400g)"
  },
  {
    id: 3,
    sku: "PRD-1003",
    name: "Organic Cavendish Bananas",
    category: "Fresh Produce",
    price: 55.00,
    quantity: 85,
    unit: "Kg",
    minStock: 25,
    supplier: "Greenfield Organic Farms",
    status: "In Stock",
    lastUpdated: "2026-09-01 08:00 AM",
    description: "Naturally ripened premium sweet table bananas"
  },
  {
    id: 4,
    sku: "PRD-1004",
    name: "Royal Basmati Rice (Premium)",
    category: "Grains & Staples",
    price: 180.00,
    quantity: 120,
    unit: "Kg",
    minStock: 30,
    supplier: "India Gate Mills",
    status: "In Stock",
    lastUpdated: "2026-08-31 04:45 PM",
    description: "Aged long-grain aromatic basmati rice for festive meals"
  },
  {
    id: 5,
    sku: "PRD-1005",
    name: "Cold-Pressed Extra Virgin Olive Oil",
    category: "Grains & Staples",
    price: 850.00,
    quantity: 14,
    unit: "Litre",
    minStock: 10,
    supplier: "Borges Mediterranean",
    status: "In Stock",
    lastUpdated: "2026-08-30 02:20 PM",
    description: "First cold-extracted pure Spanish olive oil (1L glass bottle)"
  },
  {
    id: 6,
    sku: "PRD-1006",
    name: "Greek Style Natural Yogurt",
    category: "Dairy & Eggs",
    price: 95.00,
    quantity: 0,
    unit: "Pcs",
    minStock: 12,
    supplier: "Epigamia Foods",
    status: "Out of Stock",
    lastUpdated: "2026-09-01 11:00 AM",
    description: "High protein, thick strained unsweetened probiotic curd (400g)"
  },
  {
    id: 7,
    sku: "PRD-1007",
    name: "Shimla Crisp Red Apples",
    category: "Fresh Produce",
    price: 140.00,
    quantity: 32,
    unit: "Kg",
    minStock: 20,
    supplier: "Himalayan Orchards",
    status: "In Stock",
    lastUpdated: "2026-09-01 08:30 AM",
    description: "Handpicked sweet juicy mountain apples"
  },
  {
    id: 8,
    sku: "PRD-1008",
    name: "Pure Tender Coconut Water",
    category: "Beverages",
    price: 50.00,
    quantity: 6,
    unit: "Pcs",
    minStock: 20,
    supplier: "Raw Pressery",
    status: "Low Stock",
    lastUpdated: "2026-09-01 12:10 PM",
    description: "100% natural isotonic hydration with no added sugar (200ml)"
  },
  {
    id: 9,
    sku: "PRD-1009",
    name: "Roasted Salted California Almonds",
    category: "Snacks",
    price: 320.00,
    quantity: 50,
    unit: "Packet",
    minStock: 15,
    supplier: "Nutty Gritties",
    status: "In Stock",
    lastUpdated: "2026-08-29 06:15 PM",
    description: "Slow-roasted jumbo crunchy almonds (250g vacuum sealed pack)"
  },
  {
    id: 10,
    sku: "PRD-1010",
    name: "Artisan Dark Chocolate 70%",
    category: "Snacks",
    price: 165.00,
    quantity: 0,
    unit: "Pcs",
    minStock: 10,
    supplier: "Ambriona Cacao",
    status: "Out of Stock",
    lastUpdated: "2026-08-31 01:10 PM",
    description: "Single-origin vegan dark cocoa bar (80g)"
  },
  {
    id: 11,
    sku: "PRD-1011",
    name: "Fresh Farm Eggs (Pack of 12)",
    category: "Dairy & Eggs",
    price: 90.00,
    quantity: 40,
    unit: "Packet",
    minStock: 15,
    supplier: "Eggoz Nutrition",
    status: "In Stock",
    lastUpdated: "2026-09-01 07:45 AM",
    description: "UV sanitized, antibiotic-free brown farm eggs"
  },
  {
    id: 12,
    sku: "PRD-1012",
    name: "Sparkling Green Tea Lemon",
    category: "Beverages",
    price: 60.00,
    quantity: 9,
    unit: "Pcs",
    minStock: 18,
    supplier: "Lipton Beverages",
    status: "Low Stock",
    lastUpdated: "2026-09-01 11:40 AM",
    description: "Refreshing zero calorie brewed green tea beverage (330ml can)"
  }
];

export const initialSales = [
  {
    id: "TXN-8801",
    invoiceNo: "INV-2026-001",
    product: "Farm Fresh Whole Milk",
    category: "Dairy & Eggs",
    quantity: 4,
    price: 64.00,
    totalAmount: 256.00,
    date: "2026-09-01 02:45 PM",
    paymentMethod: "UPI / QR",
    customer: "Rahul Sharma"
  },
  {
    id: "TXN-8802",
    invoiceNo: "INV-2026-002",
    product: "Organic Cavendish Bananas",
    category: "Fresh Produce",
    quantity: 3,
    price: 55.00,
    totalAmount: 165.00,
    date: "2026-09-01 02:15 PM",
    paymentMethod: "Card",
    customer: "Priya Patel"
  },
  {
    id: "TXN-8803",
    invoiceNo: "INV-2026-003",
    product: "Royal Basmati Rice (Premium)",
    category: "Grains & Staples",
    quantity: 5,
    price: 180.00,
    totalAmount: 900.00,
    date: "2026-09-01 01:50 PM",
    paymentMethod: "Cash",
    customer: "Amit Verma"
  },
  {
    id: "TXN-8804",
    invoiceNo: "INV-2026-004",
    product: "100% Whole Wheat Bread",
    category: "Bakery",
    quantity: 2,
    price: 45.00,
    totalAmount: 90.00,
    date: "2026-09-01 01:10 PM",
    paymentMethod: "UPI / QR",
    customer: "Sneha Reddy"
  },
  {
    id: "TXN-8805",
    invoiceNo: "INV-2026-005",
    product: "Cold-Pressed Extra Virgin Olive Oil",
    category: "Grains & Staples",
    quantity: 1,
    price: 850.00,
    totalAmount: 850.00,
    date: "2026-09-01 12:30 PM",
    paymentMethod: "Card",
    customer: "Dr. Vikram Singh"
  },
  {
    id: "TXN-8806",
    invoiceNo: "INV-2026-006",
    product: "Shimla Crisp Red Apples",
    category: "Fresh Produce",
    quantity: 2,
    price: 140.00,
    totalAmount: 280.00,
    date: "2026-09-01 11:45 AM",
    paymentMethod: "UPI / QR",
    customer: "Ananya Roy"
  },
  {
    id: "TXN-8807",
    invoiceNo: "INV-2026-007",
    product: "Roasted Salted California Almonds",
    category: "Snacks",
    quantity: 2,
    price: 320.00,
    totalAmount: 640.00,
    date: "2026-08-31 06:10 PM",
    paymentMethod: "UPI / QR",
    customer: "Karan Johar"
  },
  {
    id: "TXN-8808",
    invoiceNo: "INV-2026-008",
    product: "Fresh Farm Eggs (Pack of 12)",
    category: "Dairy & Eggs",
    quantity: 3,
    price: 90.00,
    totalAmount: 270.00,
    date: "2026-08-31 04:30 PM",
    paymentMethod: "Cash",
    customer: "Deepak Mehra"
  }
];

export const salesOverviewData = [
  { day: "Mon", sales: 18400, orders: 42, units: 148 },
  { day: "Tue", sales: 22100, orders: 55, units: 182 },
  { day: "Wed", sales: 19800, orders: 49, units: 160 },
  { day: "Thu", sales: 26500, orders: 68, units: 215 },
  { day: "Fri", sales: 31200, orders: 84, units: 290 },
  { day: "Sat", sales: 44800, orders: 112, units: 420 },
  { day: "Sun", sales: 38900, orders: 96, units: 365 },
];

export const inventoryStatusData = [
  { name: "In Stock", value: 72, color: "#10b981" },
  { name: "Low Stock", value: 18, color: "#f59e0b" },
  { name: "Out of Stock", value: 10, color: "#ef4444" },
];

export const categoryDistributionData = [
  { category: "Produce", items: 34, stock: 1240, color: "#059669" },
  { category: "Dairy", items: 22, stock: 890, color: "#0284c7" },
  { category: "Bakery", items: 18, stock: 450, color: "#d97706" },
  { category: "Staples", items: 28, stock: 1680, color: "#7c3aed" },
  { category: "Beverages", items: 16, stock: 320, color: "#06b6d4" },
  { category: "Snacks", items: 24, stock: 560, color: "#ec4899" },
];

export const categoriesList = [
  "All Categories",
  "Dairy & Eggs",
  "Bakery",
  "Fresh Produce",
  "Grains & Staples",
  "Beverages",
  "Snacks"
];

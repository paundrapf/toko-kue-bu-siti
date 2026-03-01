import type { Product, Category, BlogPost, BlogCategory, SiteSettings } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Brownies',
    slug: 'brownies',
    description: 'Brownies lembut dan nyoklat dengan berbagai varian rasa',
    image: '/images/categories/brownies.jpg',
    productCount: 4
  },
  {
    id: 'cat-2',
    name: 'Lapis Legit',
    slug: 'lapis-legit',
    description: 'Kue lapis legit tradisional dengan cita rasa premium',
    image: '/images/categories/lapis-legit.jpg',
    productCount: 3
  },
  {
    id: 'cat-3',
    name: 'Kue Kering',
    slug: 'kue-kering',
    description: 'Aneka kue kering renyah untuk berbagai acara',
    image: '/images/categories/kue-kering.jpg',
    productCount: 5
  },
  {
    id: 'cat-4',
    name: 'Cake',
    slug: 'cake',
    description: 'Cake spesial untuk ulang tahun dan perayaan',
    image: '/images/categories/cake.jpg',
    productCount: 4
  },
  {
    id: 'cat-5',
    name: 'Puding',
    slug: 'puding',
    description: 'Puding segar dengan berbagai varian rasa',
    image: '/images/categories/puding.jpg',
    productCount: 3
  },
  {
    id: 'cat-6',
    name: 'Donat',
    slug: 'donat',
    description: 'Donat lembut dengan berbagai topping menarik',
    image: '/images/categories/donat.jpg',
    productCount: 3
  }
];

export const products: Product[] = [
  // Brownies
  {
    id: 'prod-1',
    name: 'Brownies Cokelat',
    slug: 'brownies-cokelat',
    description: 'Brownies cokelat premium dengan tekstur lembut dan rasa nyoklat yang intens. Dibuat dengan cokelat berkualitas tinggi dan bahan-bahan pilihan. Cocok untuk acara spesial atau hadiah untuk orang tersayang.',
    shortDescription: 'Brownies nyoklat lembut dengan rasa premium',
    images: ['/images/products/brownies-cokelat-1.jpg', '/images/products/brownies-cokelat-2.jpg'],
    category: 'cat-1',
    categoryName: 'Brownies',
    variants: [
      { id: 'var-1-1', name: 'Original', size: 'Small', price: 75000, stock: 20 },
      { id: 'var-1-2', name: 'Original', size: 'Medium', price: 140000, stock: 15 },
      { id: 'var-1-3', name: 'Original', size: 'Large', price: 250000, stock: 10 }
    ],
    status: 'Available',
    featured: true,
    totalSold: 156,
    metaTitle: 'Brownies Cokelat Premium | Toko Kue Bu Siti',
    metaDescription: 'Brownies cokelat lembut dan nyoklat, cocok untuk hadiah atau acara spesial'
  },
  {
    id: 'prod-2',
    name: 'Brownies Keju',
    slug: 'brownies-keju',
    description: 'Perpaduan sempurna antara brownies cokelat dan keju creamy. Lapisan keju di atas brownies menciptakan rasa yang unik dan lezat. Favorit banyak pelanggan!',
    shortDescription: 'Brownies dengan lapisan keju creamy',
    images: ['/images/products/brownies-keju-1.jpg', '/images/products/brownies-keju-2.jpg'],
    category: 'cat-1',
    categoryName: 'Brownies',
    variants: [
      { id: 'var-2-1', name: 'Keju', size: 'Small', price: 85000, stock: 18 },
      { id: 'var-2-2', name: 'Keju', size: 'Medium', price: 160000, stock: 12 },
      { id: 'var-2-3', name: 'Keju', size: 'Large', price: 280000, stock: 8 }
    ],
    status: 'Available',
    featured: true,
    totalSold: 132
  },
  {
    id: 'prod-3',
    name: 'Brownies Matcha',
    slug: 'brownies-matcha',
    description: 'Brownies dengan rasa matcha autentik dari Jepang. Rasa green tea yang khas dengan tekstur brownies yang lembut. Pilihan sempurna untuk pecinta matcha.',
    shortDescription: 'Brownies rasa matcha autentik',
    images: ['/images/products/brownies-matcha-1.jpg'],
    category: 'cat-1',
    categoryName: 'Brownies',
    variants: [
      { id: 'var-3-1', name: 'Matcha', size: 'Small', price: 90000, stock: 15 },
      { id: 'var-3-2', name: 'Matcha', size: 'Medium', price: 170000, stock: 10 },
      { id: 'var-3-3', name: 'Matcha', size: 'Large', price: 300000, stock: 5 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 89
  },
  {
    id: 'prod-4',
    name: 'Brownies Red Velvet',
    slug: 'brownies-red-velvet',
    description: 'Brownies red velvet yang cantik dengan warna merah cerah dan rasa yang unik. Dilengkapi dengan cream cheese frosting yang lembut.',
    shortDescription: 'Brownies red velvet dengan cream cheese',
    images: ['/images/products/brownies-redvelvet-1.jpg'],
    category: 'cat-1',
    categoryName: 'Brownies',
    variants: [
      { id: 'var-4-1', name: 'Red Velvet', size: 'Small', price: 95000, stock: 12 },
      { id: 'var-4-2', name: 'Red Velvet', size: 'Medium', price: 180000, stock: 8 },
      { id: 'var-4-3', name: 'Red Velvet', size: 'Large', price: 320000, stock: 4 }
    ],
    status: 'Available',
    featured: true,
    totalSold: 67
  },
  // Lapis Legit
  {
    id: 'prod-5',
    name: 'Lapis Legit Original',
    slug: 'lapis-legit-original',
    description: 'Kue lapis legit tradisional dengan lapisan yang tebal dan rasa spesial yang khas. Dibuat dengan resep turun-temurun dan bahan-bahan premium.',
    shortDescription: 'Lapis legit tradisional premium',
    images: ['/images/products/lapis-original-1.jpg', '/images/products/lapis-original-2.jpg'],
    category: 'cat-2',
    categoryName: 'Lapis Legit',
    variants: [
      { id: 'var-5-1', name: 'Original', size: 'Small', price: 150000, stock: 10 },
      { id: 'var-5-2', name: 'Original', size: 'Medium', price: 280000, stock: 8 },
      { id: 'var-5-3', name: 'Original', size: 'Large', price: 500000, stock: 5 }
    ],
    status: 'Available',
    featured: true,
    totalSold: 98
  },
  {
    id: 'prod-6',
    name: 'Lapis Legit Prunes',
    slug: 'lapis-legit-prunes',
    description: 'Lapis legit dengan taburan prunes yang memberikan rasa manis dan tekstur yang unik. Kombinasi sempurna antara tradisional dan modern.',
    shortDescription: 'Lapis legit dengan prunes',
    images: ['/images/products/lapis-prunes-1.jpg'],
    category: 'cat-2',
    categoryName: 'Lapis Legit',
    variants: [
      { id: 'var-6-1', name: 'Prunes', size: 'Small', price: 175000, stock: 8 },
      { id: 'var-6-2', name: 'Prunes', size: 'Medium', price: 320000, stock: 6 },
      { id: 'var-6-3', name: 'Prunes', size: 'Large', price: 580000, stock: 4 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 54
  },
  {
    id: 'prod-7',
    name: 'Lapis Legit Keju',
    slug: 'lapis-legit-keju',
    description: 'Lapis legit dengan sentuhan keju yang gurih. Perpaduan rasa manis dan gurih yang sempurna.',
    shortDescription: 'Lapis legit rasa keju gurih',
    images: ['/images/products/lapis-keju-1.jpg'],
    category: 'cat-2',
    categoryName: 'Lapis Legit',
    variants: [
      { id: 'var-7-1', name: 'Keju', size: 'Small', price: 165000, stock: 10 },
      { id: 'var-7-2', name: 'Keju', size: 'Medium', price: 300000, stock: 7 },
      { id: 'var-7-3', name: 'Keju', size: 'Large', price: 550000, stock: 4 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 43
  },
  // Kue Kering
  {
    id: 'prod-8',
    name: 'Nastar Premium',
    slug: 'nastar-premium',
    description: 'Kue nastar dengan selai nanas homemade dan tekstur yang lumer di mulut. Dibuat dengan mentega berkualitas tinggi.',
    shortDescription: 'Nastar lumer dengan selai nanas homemade',
    images: ['/images/products/nastar-1.jpg', '/images/products/nastar-2.jpg'],
    category: 'cat-3',
    categoryName: 'Kue Kering',
    variants: [
      { id: 'var-8-1', name: 'Premium', size: 'Small', price: 85000, stock: 25 },
      { id: 'var-8-2', name: 'Premium', size: 'Medium', price: 150000, stock: 20 },
      { id: 'var-8-3', name: 'Premium', size: 'Large', price: 280000, stock: 15 }
    ],
    status: 'Available',
    featured: true,
    totalSold: 234
  },
  {
    id: 'prod-9',
    name: 'Kastengel',
    slug: 'kastengel',
    description: 'Kue kastengel gurih dengan keju edam premium. Renyah dan gurih, cocok untuk sajian lebaran atau hampers.',
    shortDescription: 'Kastengel gurih dengan keju edam',
    images: ['/images/products/kastengel-1.jpg'],
    category: 'cat-3',
    categoryName: 'Kue Kering',
    variants: [
      { id: 'var-9-1', name: 'Original', size: 'Small', price: 90000, stock: 20 },
      { id: 'var-9-2', name: 'Original', size: 'Medium', price: 160000, stock: 15 },
      { id: 'var-9-3', name: 'Original', size: 'Large', price: 300000, stock: 10 }
    ],
    status: 'Available',
    featured: true,
    totalSold: 189
  },
  {
    id: 'prod-10',
    name: 'Putri Salju',
    slug: 'putri-salju',
    description: 'Kue putri salju lumer dengan taburan gula halus. Klasik dan timeless, disukai semua kalangan.',
    shortDescription: 'Putri salju lumer klasik',
    images: ['/images/products/putri-salju-1.jpg'],
    category: 'cat-3',
    categoryName: 'Kue Kering',
    variants: [
      { id: 'var-10-1', name: 'Original', size: 'Small', price: 75000, stock: 22 },
      { id: 'var-10-2', name: 'Original', size: 'Medium', price: 135000, stock: 18 },
      { id: 'var-10-3', name: 'Original', size: 'Large', price: 250000, stock: 12 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 167
  },
  {
    id: 'prod-11',
    name: 'Lidah Kucing',
    slug: 'lidah-kucing',
    description: 'Kue lidah kucing yang renyah dan tipis. Dibuat dengan mentega premium untuk rasa yang istimewa.',
    shortDescription: 'Lidah kucing renyah premium',
    images: ['/images/products/lidah-kucing-1.jpg'],
    category: 'cat-3',
    categoryName: 'Kue Kering',
    variants: [
      { id: 'var-11-1', name: 'Original', size: 'Small', price: 80000, stock: 18 },
      { id: 'var-11-2', name: 'Original', size: 'Medium', price: 145000, stock: 14 },
      { id: 'var-11-3', name: 'Original', size: 'Large', price: 270000, stock: 9 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 145
  },
  {
    id: 'prod-12',
    name: 'Sagu Keju',
    slug: 'sagu-keju',
    description: 'Kue sagu dengan rasa keju yang gurih. Lumer di mulut dan sangat cocok untuk teman minum teh.',
    shortDescription: 'Sagu keju lumer gurih',
    images: ['/images/products/sagu-keju-1.jpg'],
    category: 'cat-3',
    categoryName: 'Kue Kering',
    variants: [
      { id: 'var-12-1', name: 'Keju', size: 'Small', price: 70000, stock: 20 },
      { id: 'var-12-2', name: 'Keju', size: 'Medium', price: 125000, stock: 16 },
      { id: 'var-12-3', name: 'Keju', size: 'Large', price: 230000, stock: 11 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 123
  },
  // Cake
  {
    id: 'prod-13',
    name: 'Black Forest',
    slug: 'black-forest',
    description: 'Cake black forest klasik dengan lapisan cokelat, whipped cream, dan cherry. Sempurna untuk perayaan ulang tahun.',
    shortDescription: 'Black forest klasik dengan cherry',
    images: ['/images/products/black-forest-1.jpg', '/images/products/black-forest-2.jpg'],
    category: 'cat-4',
    categoryName: 'Cake',
    variants: [
      { id: 'var-13-1', name: 'Round 15cm', size: 'Small', price: 250000, stock: 8 },
      { id: 'var-13-2', name: 'Round 20cm', size: 'Medium', price: 350000, stock: 6 },
      { id: 'var-13-3', name: 'Round 25cm', size: 'Large', price: 480000, stock: 4 }
    ],
    status: 'Available',
    featured: true,
    totalSold: 87
  },
  {
    id: 'prod-14',
    name: 'Red Velvet Cake',
    slug: 'red-velvet-cake',
    description: 'Cake red velvet yang lembut dengan cream cheese frosting. Cantik dan lezat untuk momen spesial.',
    shortDescription: 'Red velvet dengan cream cheese',
    images: ['/images/products/red-velvet-cake-1.jpg'],
    category: 'cat-4',
    categoryName: 'Cake',
    variants: [
      { id: 'var-14-1', name: 'Round 15cm', size: 'Small', price: 280000, stock: 7 },
      { id: 'var-14-2', name: 'Round 20cm', size: 'Medium', price: 380000, stock: 5 },
      { id: 'var-14-3', name: 'Round 25cm', size: 'Large', price: 520000, stock: 3 }
    ],
    status: 'Available',
    featured: true,
    totalSold: 76
  },
  {
    id: 'prod-15',
    name: 'Cheesecake',
    slug: 'cheesecake',
    description: 'Cheesecake creamy dengan base biskuit yang renyah. Tersedia dalam varian original dan strawberry.',
    shortDescription: 'Cheesecake creamy lembut',
    images: ['/images/products/cheesecake-1.jpg'],
    category: 'cat-4',
    categoryName: 'Cake',
    variants: [
      { id: 'var-15-1', name: 'Original', size: 'Small', price: 220000, stock: 9 },
      { id: 'var-15-2', name: 'Original', size: 'Medium', price: 320000, stock: 7 },
      { id: 'var-15-3', name: 'Original', size: 'Large', price: 450000, stock: 4 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 65
  },
  {
    id: 'prod-16',
    name: 'Tiramisu',
    slug: 'tiramisu',
    description: 'Tiramisu autentik dengan lapisan mascarpone dan coffee soaked ladyfingers. Rasa Italia yang elegan.',
    shortDescription: 'Tiramisu autentik Italia',
    images: ['/images/products/tiramisu-1.jpg'],
    category: 'cat-4',
    categoryName: 'Cake',
    variants: [
      { id: 'var-16-1', name: 'Square 15cm', size: 'Small', price: 260000, stock: 6 },
      { id: 'var-16-2', name: 'Square 20cm', size: 'Medium', price: 380000, stock: 4 },
      { id: 'var-16-3', name: 'Square 25cm', size: 'Large', price: 520000, stock: 3 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 54
  },
  // Puding
  {
    id: 'prod-17',
    name: 'Puding Cokelat',
    slug: 'puding-cokelat',
    description: 'Puding cokelat yang silky smooth dengan rasa cokelat yang rich. Disajikan dengan vla vanila.',
    shortDescription: 'Puding cokelat silky smooth',
    images: ['/images/products/puding-cokelat-1.jpg'],
    category: 'cat-5',
    categoryName: 'Puding',
    variants: [
      { id: 'var-17-1', name: 'Cup', size: 'Small', price: 15000, stock: 50 },
      { id: 'var-17-2', name: 'Loyang Kecil', size: 'Medium', price: 80000, stock: 20 },
      { id: 'var-17-3', name: 'Loyang Besar', size: 'Large', price: 150000, stock: 12 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 198
  },
  {
    id: 'prod-18',
    name: 'Puding Buah',
    slug: 'puding-buah',
    description: 'Puding buah segar dengan aneka buah-buahan. Sehat, segar, dan cocok untuk dessert.',
    shortDescription: 'Puding buah segar sehat',
    images: ['/images/products/puding-buah-1.jpg'],
    category: 'cat-5',
    categoryName: 'Puding',
    variants: [
      { id: 'var-18-1', name: 'Cup', size: 'Small', price: 18000, stock: 45 },
      { id: 'var-18-2', name: 'Loyang Kecil', size: 'Medium', price: 95000, stock: 18 },
      { id: 'var-18-3', name: 'Loyang Besar', size: 'Large', price: 180000, stock: 10 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 156
  },
  {
    id: 'prod-19',
    name: 'Puding Susu',
    slug: 'puding-susu',
    description: 'Puding susu klasik yang lembut dengan rasa susu yang creamy. Disajikan dengan saus karamel.',
    shortDescription: 'Puding susu klasik creamy',
    images: ['/images/products/puding-susu-1.jpg'],
    category: 'cat-5',
    categoryName: 'Puding',
    variants: [
      { id: 'var-19-1', name: 'Cup', size: 'Small', price: 12000, stock: 60 },
      { id: 'var-19-2', name: 'Loyang Kecil', size: 'Medium', price: 70000, stock: 25 },
      { id: 'var-19-3', name: 'Loyang Besar', size: 'Large', price: 130000, stock: 15 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 234
  },
  // Donat
  {
    id: 'prod-20',
    name: 'Donat Glaze',
    slug: 'donat-glaze',
    description: 'Donat lembut dengan berbagai pilihan glaze: cokelat, strawberry, vanilla, dan matcha.',
    shortDescription: 'Donat lembut dengan glaze pilihan',
    images: ['/images/products/donat-glaze-1.jpg'],
    category: 'cat-6',
    categoryName: 'Donat',
    variants: [
      { id: 'var-20-1', name: 'Cokelat', size: 'Small', price: 8000, stock: 40 },
      { id: 'var-20-2', name: 'Strawberry', size: 'Small', price: 8000, stock: 35 },
      { id: 'var-20-3', name: 'Vanilla', size: 'Small', price: 8000, stock: 38 },
      { id: 'var-20-4', name: 'Matcha', size: 'Small', price: 9000, stock: 30 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 312
  },
  {
    id: 'prod-21',
    name: 'Donat Topping',
    slug: 'donat-topping',
    description: 'Donat dengan berbagai topping menarik: meses, sprinkle, oreo, dan almond slice.',
    shortDescription: 'Donat dengan topping menarik',
    images: ['/images/products/donat-topping-1.jpg'],
    category: 'cat-6',
    categoryName: 'Donat',
    variants: [
      { id: 'var-21-1', name: 'Meses', size: 'Small', price: 10000, stock: 35 },
      { id: 'var-21-2', name: 'Sprinkle', size: 'Small', price: 10000, stock: 32 },
      { id: 'var-21-3', name: 'Oreo', size: 'Small', price: 12000, stock: 28 },
      { id: 'var-21-4', name: 'Almond', size: 'Small', price: 15000, stock: 25 }
    ],
    status: 'Available',
    featured: false,
    totalSold: 278
  },
  {
    id: 'prod-22',
    name: 'Donat Bomboloni',
    slug: 'donat-bomboloni',
    description: 'Donat bomboloni isi yang lembut dengan berbagai pilihan isian: cokelat, strawberry, vanilla, dan matcha.',
    shortDescription: 'Bomboloni isi lembut',
    images: ['/images/products/donat-bomboloni-1.jpg'],
    category: 'cat-6',
    categoryName: 'Donat',
    variants: [
      { id: 'var-22-1', name: 'Cokelat', size: 'Small', price: 12000, stock: 30 },
      { id: 'var-22-2', name: 'Strawberry', size: 'Small', price: 12000, stock: 28 },
      { id: 'var-22-3', name: 'Vanilla', size: 'Small', price: 12000, stock: 32 },
      { id: 'var-22-4', name: 'Matcha', size: 'Small', price: 13000, stock: 25 }
    ],
    status: 'Available',
    featured: true,
    totalSold: 245
  }
];

export const blogCategories: BlogCategory[] = [
  {
    id: 'blog-cat-1',
    name: 'Resep',
    slug: 'resep',
    description: 'Berbagai resep kue dan dessert yang bisa Anda coba di rumah',
    postCount: 8
  },
  {
    id: 'blog-cat-2',
    name: 'Tips & Trik',
    slug: 'tips-trik',
    description: 'Tips dan trik seputar baking dan decorasi kue',
    postCount: 5
  },
  {
    id: 'blog-cat-3',
    name: 'Cerita',
    slug: 'cerita',
    description: 'Kisah dan pengalaman dari dapur Toko Kue Bu Siti',
    postCount: 4
  },
  {
    id: 'blog-cat-4',
    name: 'Promo',
    slug: 'promo',
    description: 'Informasi promo dan penawaran menarik',
    postCount: 3
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Rahasia Brownies Lembut ala Toko Kue Bu Siti',
    slug: 'rahasia-brownies-lembut',
    excerpt: 'Temukan rahasia membuat brownies yang lembut dan nyoklat seperti yang kami buat di toko. Tips dan trik yang sudah teruji puluhan tahun.',
    content: `
      <p>Brownies adalah salah satu kue favorit banyak orang. Teksturnya yang lembut dan rasa cokelat yang intens membuat brownies selalu dicari. Di Toko Kue Bu Siti, kami sudah membuat brownies selama lebih dari 20 tahun, dan kami ingin berbagi rahasia kelezatannya dengan Anda.</p>
      
      <h2>Bahan-Bahan Berkualitas</h2>
      <p>Rahasia pertama adalah penggunaan bahan-bahan berkualitas tinggi. Kami selalu menggunakan cokelat premium dengan kandungan kakao yang tinggi. Jangan ragu untuk menginvestasikan uang Anda pada cokelat yang bagus karena itu akan sangat berpengaruh pada rasa akhir.</p>
      
      <h2>Suhu yang Tepat</h2>
      <p>Suhu oven adalah kunci penting. Terlalu panas, brownies akan kering. Terlalu rendah, brownies tidak akan matang sempurna. Kami merekomendasikan suhu 170°C untuk brownies yang sempurna.</p>
      
      <h2>Jangan Overmix</h2>
      <p>Ketika mencampur adonan, jangan overmix. Campur just until combined untuk menghasilkan brownies yang fudgy dan tidak bantat.</p>
      
      <h2>Kesimpulan</h2>
      <p>Dengan tips-tips di atas, Anda bisa membuat brownies yang lezat di rumah. Tapi kalau malas repot, Anda selalu bisa memesan di Toko Kue Bu Siti!</p>
    `,
    featuredImage: '/images/blog/brownies-recipe.jpg',
    category: 'blog-cat-1',
    categoryName: 'Resep',
    tags: ['brownies', 'resep', 'cokelat', 'baking'],
    author: 'Bu Siti',
    status: 'Published',
    featured: true,
    views: 1256,
    createdAt: '2024-02-15',
    publishedAt: '2024-02-15'
  },
  {
    id: 'blog-2',
    title: '5 Tips Memilih Kue untuk Acara Ulang Tahun',
    slug: 'tips-memilih-kue-ulang-tahun',
    excerpt: 'Bingung memilih kue ulang tahun yang tepat? Berikut 5 tips dari kami untuk memilih kue yang sempurna untuk perayaan spesial Anda.',
    content: `
      <p>Memilih kue ulang tahun bisa menjadi tugas yang membingungkan. Dengan begitu banyak pilihan yang tersedia, bagaimana Anda tahu mana yang tepat? Berikut adalah 5 tips dari kami:</p>
      
      <h2>1. Pertimbangkan Jumlah Tamu</h2>
      <p>Pastikan Anda memesan kue dengan ukuran yang cukup untuk semua tamu. Sebagai panduan, kue 20cm bisa disajikan untuk 10-12 orang.</p>
      
      <h2>2. Ketahui Preferensi Rasa</h2>
      <p>Pikirkan tentang siapa yang akan hadir. Apakah mereka menyukai cokelat? Atau lebih suka rasa buah? Pilih rasa yang akan disukai mayoritas tamu.</p>
      
      <h2>3. Pesan dengan Waktu yang Cukup</h2>
      <p>Jangan memesan kue di menit terakhir. Kami merekomendasikan pemesanan minimal 2-3 hari sebelum acara untuk memastikan kualitas terbaik.</p>
      
      <h2>4. Pertimbangkan Tema Acara</h2>
      <p>Jika Anda mengadakan pesta bertema, pilih kue yang sesuai dengan tema tersebut. Kami bisa membantu dengan custom decoration.</p>
      
      <h2>5. Jangan Lupakan Budget</h2>
      <p>Tetapkan budget Anda sebelumnya dan komunikasikan dengan kami. Kami punya berbagai pilihan untuk setiap budget.</p>
    `,
    featuredImage: '/images/blog/birthday-cake-tips.jpg',
    category: 'blog-cat-2',
    categoryName: 'Tips & Trik',
    tags: ['ulang tahun', 'tips', 'cake', 'perayaan'],
    author: 'Bu Siti',
    status: 'Published',
    featured: true,
    views: 987,
    createdAt: '2024-02-10',
    publishedAt: '2024-02-10'
  },
  {
    id: 'blog-3',
    title: 'Sejarah Lapis Legit: Kue Warisan Indonesia',
    slug: 'sejarah-lapis-legit',
    excerpt: 'Mengenal lebih dekat kue lapis legit, kue tradisional Indonesia yang telah menjadi warisan kuliner turun-temurun.',
    content: `
      <p>Lapis legit adalah salah satu kue tradisional Indonesia yang paling terkenal. Kue ini memiliki sejarah panjang dan merupakan warisan kuliner yang berharga.</p>
      
      <h2>Asal Usul</h2>
      <p>Lapis legit berasal dari pengaruh budaya Belanda selama masa kolonial. Kue ini terinspirasi dari kue lapis Eropa, namun dikembangkan dengan cita rasa lokal Indonesia.</p>
      
      <h2>Makna di Balik Lapisan</h2>
      <p>Setiap lapisan dalam lapis legit melambangkan perjuangan dan kesabaran. Proses membuatnya yang memakan waktu dan memerlukan ketelitian mencerminkan nilai-nilai kekeluargaan Indonesia.</p>
      
      <h2>Lapis Legit Modern</h2>
      <p>Saat ini, lapis legit telah berevolusi dengan berbagai varian rasa seperti keju, prunes, dan pandan. Namun, resep tradisional tetap menjadi favorit banyak orang.</p>
    `,
    featuredImage: '/images/blog/lapis-legit-history.jpg',
    category: 'blog-cat-3',
    categoryName: 'Cerita',
    tags: ['lapis legit', 'sejarah', 'tradisi', 'kuliner'],
    author: 'Bu Siti',
    status: 'Published',
    featured: false,
    views: 756,
    createdAt: '2024-02-05',
    publishedAt: '2024-02-05'
  },
  {
    id: 'blog-4',
    title: 'Promo Spesial Bulan Februari: Diskon 20%',
    slug: 'promo-spesial-februari',
    excerpt: 'Dapatkan diskon 20% untuk semua produk cake dan brownies selama bulan Februari. Jangan lewatkan kesempatan ini!',
    content: `
      <p>Bulan Februari adalah bulan penuh cinta, dan kami ingin berbagi kebahagiaan dengan Anda! Nikmati promo spesial dari Toko Kue Bu Siti.</p>
      
      <h2>Detail Promo</h2>
      <ul>
        <li>Diskon 20% untuk semua produk cake</li>
        <li>Diskon 15% untuk brownies</li>
        <li>Gratis ongkir untuk pembelian di atas Rp 500.000</li>
      </ul>
      
      <h2>Syarat dan Ketentuan</h2>
      <ul>
        <li>Periode promo: 1-28 Februari 2024</li>
        <li>Tidak berlaku kelipatan</li>
        <li>Kuota terbatas</li>
      </ul>
      
      <p>Pesan sekarang dan nikmati kelezatan kue kami dengan harga spesial!</p>
    `,
    featuredImage: '/images/blog/promo-februari.jpg',
    category: 'blog-cat-4',
    categoryName: 'Promo',
    tags: ['promo', 'diskon', 'februari', 'spesial'],
    author: 'Tim Marketing',
    status: 'Published',
    featured: true,
    views: 1543,
    createdAt: '2024-02-01',
    publishedAt: '2024-02-01'
  },
  {
    id: 'blog-5',
    title: 'Cara Menyimpan Kue Kering Agar Tetap Renyah',
    slug: 'cara-menyimpan-kue-kering',
    excerpt: 'Tips penting untuk menyimpan kue kering agar tetap renyah dan lezat dalam waktu yang lama.',
    content: `
      <p>Kue kering adalah camilan favorit banyak orang, terutama saat lebaran. Namun, seringkali kue kering menjadi lembek jika tidak disimpan dengan benar. Berikut tips dari kami:</p>
      
      <h2>1. Gunakan Wadah Kedap Udara</h2>
      <p>Simpan kue kering dalam wadah kedap udara untuk mencegah kelembaban masuk. Pastikan tutup wadah tertutup rapat.</p>
      
      <h2>2. Tambahkan Silica Gel</h2>
      <p>Masukkan silica gel pack ke dalam wadah kue untuk menyerap kelembaban. Pastikan silica gel tidak bersentuhan langsung dengan kue.</p>
      
      <h2>3. Hindari Sinar Matahari Langsung</h2>
      <p>Simpan kue di tempat yang sejuk dan kering, jauh dari sinar matahari langsung yang bisa membuat kue menjadi lembek.</p>
      
      <h2>4. Jangan Campur Kue dengan Rasa Berbeda</h2>
      <p>Simpan kue dengan rasa berbeda dalam wadah terpisah untuk mencegah tercampurnya aroma.</p>
    `,
    featuredImage: '/images/blog/simpan-kue-kering.jpg',
    category: 'blog-cat-2',
    categoryName: 'Tips & Trik',
    tags: ['kue kering', 'tips', 'penyimpanan', 'renyah'],
    author: 'Bu Siti',
    status: 'Published',
    featured: false,
    views: 1123,
    createdAt: '2024-01-28',
    publishedAt: '2024-01-28'
  },
  {
    id: 'blog-6',
    title: 'Perjalanan 20 Tahun Toko Kue Bu Siti',
    slug: 'perjalanan-20-tahun',
    excerpt: 'Mengenang perjalanan 20 tahun Toko Kue Bu Siti dari sebuah dapur kecil hingga menjadi toko kue yang dicintai banyak orang.',
    content: `
      <p>20 tahun lalu, semuanya dimulai dari sebuah dapur kecil di rumah kami. Dengan tekad dan cinta untuk baking, Toko Kue Bu Siti lahir.</p>
      
      <h2>Awal Mula</h2>
      <p>Saya memulai dengan membuat kue untuk keluarga dan tetangga. Kue-kue buatan saya mulai dikenal dan permintaan pun semakin banyak.</p>
      
      <h2>Berkembang</h2>
      <p>Tahun demi tahun, kami terus berkembang. Dari dapur rumah, kami pindah ke toko kecil, lalu ke lokasi yang lebih besar.</p>
      
      <h2>Tim yang Hebat</h2>
      <p>Kami bersyukur memiliki tim yang hebat. Mereka adalah keluarga besar kami yang berdedikasi untuk menghasilkan kue terbaik.</p>
      
      <h2>Terima Kasih</h2>
      <p>Kami mengucapkan terima kasih kepada semua pelanggan yang telah mendukung kami. Tanpa Anda, kami tidak akan sampai di sini.</p>
    `,
    featuredImage: '/images/blog/journey-20-years.jpg',
    category: 'blog-cat-3',
    categoryName: 'Cerita',
    tags: ['sejarah', 'toko', 'perjalanan', '20 tahun'],
    author: 'Bu Siti',
    status: 'Published',
    featured: true,
    views: 2341,
    createdAt: '2024-01-20',
    publishedAt: '2024-01-20'
  }
];

export const siteSettings: SiteSettings = {
  siteName: 'Toko Kue Bu Siti',
  tagline: 'Kue Homemade dengan Cinta',
  description: 'Toko kue homemade dengan resep turun-temurun. Menyediakan berbagai macam kue, brownies, cake, dan kue kering berkualitas premium.',
  logo: '/images/logo.png',
  favicon: '/images/favicon.ico',
  email: 'hello@tokokuebusiti.com',
  phone: '0812-3456-7890',
  whatsapp: '6281234567890',
  address: 'Jl. Mawar No. 123, Jakarta Selatan, 12345',
  instagram: 'tokokuebusiti',
  facebook: 'tokokuebusiti',
  tiktok: 'tokokuebusiti',
  shippingCost: 20000,
  minOrderAmount: 50000,
  leadTime: 2,
  bankAccounts: [
    {
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: 'Siti Aminah'
    },
    {
      bankName: 'Mandiri',
      accountNumber: '0987654321',
      accountHolder: 'Siti Aminah'
    }
  ]
};

export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getProductsByCategory = (categorySlug: string) => 
  products.filter(p => p.category === categories.find(c => c.slug === categorySlug)?.id);
export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
export const getRelatedProducts = (productId: string, limit: number = 4) => {
  const product = products.find(p => p.id === productId);
  if (!product) return [];
  return products
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, limit);
};
export const getFeaturedBlogPosts = () => blogPosts.filter(b => b.featured);
export const getBlogPostBySlug = (slug: string) => blogPosts.find(b => b.slug === slug);
export const getRelatedBlogPosts = (postId: string, limit: number = 3) => {
  const post = blogPosts.find(b => b.id === postId);
  if (!post) return [];
  return blogPosts
    .filter(b => b.category === post.category && b.id !== postId)
    .slice(0, limit);
};

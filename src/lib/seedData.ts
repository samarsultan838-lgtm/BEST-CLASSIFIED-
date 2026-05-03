import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const SAMPLE_ADS = [
  {
    title: "iPhone 15 Pro Max - Natural Titanium - 256GB",
    description: "Selling my like-new iPhone 15 Pro Max. Only used for 2 months. Includes original box, cable, and a premium case. No scratches, 100% battery health.",
    category: "mobiles",
    price: 1099,
    condition: "new",
    location: "Gulberg III, Lahore",
    userName: "Ahmed Ali",
    userEmail: "ahmed@example.com",
    images: ["https://picsum.photos/seed/iphone15/800/600"],
    status: "approved"
  },
  {
    title: "Honda Civic RS 2024 - Full Option",
    description: "Brand new condition Honda Civic RS. 5000km driven. Ceramic coated. First owner, all documents complete. Looking for serious buyers.",
    category: "vehicles",
    price: 32000,
    condition: "new",
    location: "DHA Phase 6, Karachi",
    userName: "Sara Khan",
    userEmail: "sara@example.com",
    images: ["https://picsum.photos/seed/civic/800/600"],
    status: "approved"
  },
  {
    title: "Modern 3-Bedroom Apartment in E-11",
    description: "Spacious 3-bedroom apartment with mountain view. Fully furnished, modern kitchen, 24/7 security, and dedicated parking space.",
    category: "property",
    price: 85000,
    condition: "new",
    location: "E-11, Islamabad",
    userName: "Zeeshan Ahmed",
    userEmail: "zeeshan@example.com",
    images: ["https://picsum.photos/seed/apartment/800/600"],
    status: "approved"
  },
  {
    title: "MacBook Pro M3 Max - 14-inch - 32GB RAM",
    description: "Ultimate beast for developers and creators. M3 Max chip, 1TB SSD. International warranty remaining. Used with extreme care.",
    category: "electronics",
    price: 3500,
    condition: "like new",
    location: "Bahria Town, Rawalpindi",
    userName: "Usman Dev",
    userEmail: "usman@example.com",
    images: ["https://picsum.photos/seed/macbook/800/600"],
    status: "approved"
  },
  {
    title: "Senior UI/UX Designer - Remote Opportunity",
    description: "Trazot is looking for a Senior UI/UX Designer to join our product team. Must have 5+ years of experience in high-growth startups.",
    category: "jobs",
    price: 5000,
    condition: "new",
    location: "Remote, Pakistan",
    userName: "Trazot HR",
    userEmail: "hr@trazot.com",
    images: ["https://picsum.photos/seed/job/800/600"],
    status: "approved"
  },
  {
    title: "Sony Alpha A7 IV - Body Only",
    description: "Professional mirrorless camera. 33MP sensor, 4K 60p video. Including 2 extra batteries and charger. Shutter count is only 5k.",
    category: "electronics",
    price: 2400,
    condition: "used",
    location: "Johar Town, Lahore",
    userName: "Photography Store",
    userEmail: "cam@example.com",
    images: ["https://picsum.photos/seed/sony/800/600"],
    status: "pending"
  },
  {
    title: "Rolex Submariner Date - 2023 Card",
    description: "Original Rolex Submariner. Full set with box and papers. Local purchase. Serious inquiries only.",
    category: "fashion",
    price: 15500,
    condition: "new",
    location: "DHA, Lahore",
    userName: "Hamza Malik",
    userEmail: "hamza@example.com",
    images: ["https://picsum.photos/seed/rolex/800/600"],
    status: "approved"
  }
];

export const SAMPLE_ARTICLES = [
  {
    title: "How to spot and avoid online marketplace scams in 2025",
    slug: "avoid-online-market-scams-2025",
    excerpt: "Learn the latest tactics used by scammers and how to protect your money and identity when trading online.",
    content: "## Safety First...",
    featuredImage: "https://picsum.photos/seed/article1/800/500",
    authorId: "admin",
    category: "Safety & Scam Alerts",
    status: "published",
    isFeatured: true
  },
  {
    title: "Top 5 Vehicles for Fuel Efficiency in 2024",
    slug: "top-5-fuel-efficient-vehicles-2024",
    excerpt: "With rising gas prices, these cars will help you save big on your daily commute without sacrificing performance.",
    content: "## Fuel economy guide...",
    featuredImage: "https://picsum.photos/seed/article2/800/500",
    authorId: "admin",
    category: "Product Reviews",
    status: "published"
  },
  {
    title: "Real Estate Trends: Why E-11 is the next big hub",
    slug: "real-estate-trends-e11-housing",
    excerpt: "An in-depth look at the infrastructure development and investment potential in Islamabad's growing sector.",
    content: "## Investment Guide...",
    featuredImage: "https://picsum.photos/seed/article3/800/500",
    authorId: "admin",
    category: "Market News & Trends",
    status: "published"
  }
];

export const seedDatabase = async () => {
  for (const ad of SAMPLE_ADS) {
    await addDoc(collection(db, "ads"), {
      ...ad,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  for (const article of SAMPLE_ARTICLES) {
    await addDoc(collection(db, "articles"), {
      ...article,
      createdAt: serverTimestamp(),
    });
  }
};

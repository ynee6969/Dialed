import { createPhoneCatalogKey } from "@/lib/utils/phone-presentation";

export type SeedPhoneSegment =
  | "entry"
  | "budget"
  | "entry_mid"
  | "midrange"
  | "upper_mid"
  | "flagship"
  | "ultra_flagship";

export interface SeedPhone {
  brand: string;
  model: string;
  price: number;
  performance_score: number;
  camera_score: number;
  battery: number;
  segment: SeedPhoneSegment;
}

const baseSeedPhones: SeedPhone[] = [
  { brand: "Samsung", model: "Galaxy A05", price: 6500, performance_score: 60, camera_score: 62, battery: 5000, segment: "entry" },
  { brand: "Samsung", model: "Galaxy A06", price: 7000, performance_score: 62, camera_score: 64, battery: 5000, segment: "entry" },
  { brand: "Xiaomi", model: "Redmi A3", price: 5000, performance_score: 55, camera_score: 60, battery: 5000, segment: "entry" },
  { brand: "Xiaomi", model: "Redmi A4", price: 6000, performance_score: 58, camera_score: 63, battery: 5000, segment: "entry" },
  { brand: "Realme", model: "Realme C51", price: 6000, performance_score: 59, camera_score: 61, battery: 5000, segment: "entry" },
  { brand: "Realme", model: "Realme C53", price: 6500, performance_score: 60, camera_score: 64, battery: 5000, segment: "entry" },
  { brand: "Infinix", model: "Smart 8 Pro", price: 5500, performance_score: 57, camera_score: 62, battery: 5000, segment: "entry" },
  { brand: "Infinix", model: "Hot 40i", price: 6500, performance_score: 61, camera_score: 65, battery: 5000, segment: "entry" },
  { brand: "Tecno", model: "Spark 20", price: 6000, performance_score: 58, camera_score: 63, battery: 5000, segment: "entry" },
  { brand: "Tecno", model: "Spark Go 2024", price: 5000, performance_score: 55, camera_score: 60, battery: 5000, segment: "entry" },

  { brand: "Samsung", model: "Galaxy A15 5G", price: 11000, performance_score: 70, camera_score: 72, battery: 5000, segment: "budget" },
  { brand: "Samsung", model: "Galaxy A16 5G", price: 12000, performance_score: 72, camera_score: 74, battery: 5000, segment: "budget" },
  { brand: "Xiaomi", model: "Redmi Note 13 4G", price: 10000, performance_score: 73, camera_score: 75, battery: 5000, segment: "budget" },
  { brand: "Xiaomi", model: "Redmi Note 13 5G", price: 13000, performance_score: 78, camera_score: 78, battery: 5000, segment: "budget" },
  { brand: "Xiaomi", model: "Poco M6 Pro", price: 12000, performance_score: 80, camera_score: 72, battery: 5000, segment: "budget" },
  { brand: "Realme", model: "Realme Narzo 70", price: 10000, performance_score: 72, camera_score: 68, battery: 5000, segment: "budget" },
  { brand: "Realme", model: "Realme 11", price: 13000, performance_score: 78, camera_score: 80, battery: 5000, segment: "budget" },
  { brand: "Infinix", model: "Note 40", price: 12000, performance_score: 79, camera_score: 75, battery: 5000, segment: "budget" },
  { brand: "Tecno", model: "Pova 6", price: 11000, performance_score: 82, camera_score: 70, battery: 6000, segment: "budget" },
  { brand: "Honor", model: "X7b", price: 11000, performance_score: 70, camera_score: 76, battery: 6000, segment: "budget" },

  { brand: "Samsung", model: "Galaxy A25 5G", price: 16000, performance_score: 78, camera_score: 75, battery: 5000, segment: "entry_mid" },
  { brand: "Samsung", model: "Galaxy A26 5G", price: 18000, performance_score: 80, camera_score: 77, battery: 5000, segment: "entry_mid" },
  { brand: "Xiaomi", model: "Redmi Note 13 Pro 4G", price: 17000, performance_score: 82, camera_score: 85, battery: 5000, segment: "entry_mid" },
  { brand: "Xiaomi", model: "Redmi Note 14 5G", price: 18000, performance_score: 83, camera_score: 80, battery: 5000, segment: "entry_mid" },
  { brand: "Realme", model: "Realme 11 Pro", price: 18000, performance_score: 81, camera_score: 86, battery: 5000, segment: "entry_mid" },
  { brand: "Realme", model: "Realme 12", price: 17000, performance_score: 80, camera_score: 82, battery: 5000, segment: "entry_mid" },
  { brand: "Infinix", model: "Zero 30 5G", price: 17000, performance_score: 84, camera_score: 88, battery: 5000, segment: "entry_mid" },
  { brand: "Tecno", model: "Camon 30", price: 16000, performance_score: 82, camera_score: 87, battery: 5000, segment: "entry_mid" },
  { brand: "Honor", model: "X9b", price: 18000, performance_score: 80, camera_score: 78, battery: 5800, segment: "entry_mid" },
  { brand: "Vivo", model: "V29e", price: 19000, performance_score: 79, camera_score: 85, battery: 4800, segment: "entry_mid" },

  { brand: "Samsung", model: "Galaxy A35 5G", price: 23000, performance_score: 85, camera_score: 82, battery: 5000, segment: "midrange" },
  { brand: "Samsung", model: "Galaxy A36 5G", price: 25000, performance_score: 87, camera_score: 84, battery: 5000, segment: "midrange" },
  { brand: "Xiaomi", model: "Redmi Note 13 Pro+ 5G", price: 26000, performance_score: 88, camera_score: 90, battery: 5000, segment: "midrange" },
  { brand: "Xiaomi", model: "Redmi Note 14 Pro+", price: 28000, performance_score: 89, camera_score: 91, battery: 5000, segment: "midrange" },
  { brand: "Nothing", model: "Phone (2a)", price: 25000, performance_score: 84, camera_score: 80, battery: 5000, segment: "midrange" },
  { brand: "Realme", model: "Realme 12 Pro+", price: 26000, performance_score: 85, camera_score: 92, battery: 5000, segment: "midrange" },
  { brand: "Vivo", model: "V30", price: 27000, performance_score: 83, camera_score: 90, battery: 5000, segment: "midrange" },
  { brand: "Honor", model: "90", price: 27000, performance_score: 86, camera_score: 91, battery: 5000, segment: "midrange" },
  { brand: "OnePlus", model: "Nord CE4", price: 25000, performance_score: 88, camera_score: 82, battery: 5500, segment: "midrange" },
  { brand: "Google", model: "Pixel 8a", price: 30000, performance_score: 90, camera_score: 94, battery: 4500, segment: "midrange" },

  { brand: "Xiaomi", model: "Poco F6", price: 30000, performance_score: 93, camera_score: 85, battery: 5000, segment: "upper_mid" },
  { brand: "Xiaomi", model: "Poco F6 Pro", price: 33000, performance_score: 95, camera_score: 87, battery: 5000, segment: "upper_mid" },
  { brand: "OnePlus", model: "OnePlus 12R", price: 35000, performance_score: 94, camera_score: 86, battery: 5500, segment: "upper_mid" },
  { brand: "OnePlus", model: "OnePlus 13R", price: 38000, performance_score: 96, camera_score: 88, battery: 5500, segment: "upper_mid" },
  { brand: "Samsung", model: "Galaxy S23 FE", price: 38000, performance_score: 90, camera_score: 88, battery: 4500, segment: "upper_mid" },
  { brand: "Samsung", model: "Galaxy S24 FE", price: 42000, performance_score: 92, camera_score: 89, battery: 4600, segment: "upper_mid" },
  { brand: "Google", model: "Pixel 8", price: 40000, performance_score: 92, camera_score: 95, battery: 4600, segment: "upper_mid" },
  { brand: "iQOO", model: "Neo 9 Pro", price: 35000, performance_score: 95, camera_score: 86, battery: 5160, segment: "upper_mid" },
  { brand: "Realme", model: "GT 6", price: 32000, performance_score: 94, camera_score: 85, battery: 5500, segment: "upper_mid" },
  { brand: "Honor", model: "200 Pro", price: 40000, performance_score: 93, camera_score: 92, battery: 5200, segment: "upper_mid" },

  { brand: "Apple", model: "iPhone 15", price: 55000, performance_score: 95, camera_score: 90, battery: 3300, segment: "flagship" },
  { brand: "Apple", model: "iPhone 16", price: 60000, performance_score: 97, camera_score: 92, battery: 3500, segment: "flagship" },
  { brand: "Samsung", model: "Galaxy S24", price: 60000, performance_score: 96, camera_score: 91, battery: 4000, segment: "flagship" },
  { brand: "Samsung", model: "Galaxy S25", price: 65000, performance_score: 97, camera_score: 93, battery: 4200, segment: "flagship" },
  { brand: "Google", model: "Pixel 9", price: 50000, performance_score: 94, camera_score: 96, battery: 4700, segment: "flagship" },
  { brand: "Xiaomi", model: "Xiaomi 14", price: 50000, performance_score: 96, camera_score: 94, battery: 4600, segment: "flagship" },
  { brand: "OnePlus", model: "OnePlus 12", price: 55000, performance_score: 97, camera_score: 92, battery: 5400, segment: "flagship" },
  { brand: "Honor", model: "Magic6", price: 60000, performance_score: 96, camera_score: 94, battery: 5600, segment: "flagship" },
  { brand: "Vivo", model: "X100", price: 65000, performance_score: 96, camera_score: 96, battery: 5000, segment: "flagship" },
  { brand: "Oppo", model: "Find X7", price: 65000, performance_score: 96, camera_score: 95, battery: 5000, segment: "flagship" },

  { brand: "Samsung", model: "Galaxy S24 Ultra", price: 85000, performance_score: 98, camera_score: 97, battery: 5000, segment: "ultra_flagship" },
  { brand: "Samsung", model: "Galaxy S25 Ultra", price: 90000, performance_score: 99, camera_score: 98, battery: 5000, segment: "ultra_flagship" },
  { brand: "Apple", model: "iPhone 15 Pro Max", price: 90000, performance_score: 98, camera_score: 97, battery: 4400, segment: "ultra_flagship" },
  { brand: "Apple", model: "iPhone 16 Pro Max", price: 95000, performance_score: 99, camera_score: 98, battery: 4600, segment: "ultra_flagship" },
  { brand: "Google", model: "Pixel 9 Pro XL", price: 80000, performance_score: 96, camera_score: 99, battery: 5000, segment: "ultra_flagship" },
  { brand: "Xiaomi", model: "Xiaomi 14 Ultra", price: 80000, performance_score: 98, camera_score: 99, battery: 5300, segment: "ultra_flagship" },
  { brand: "Xiaomi", model: "Xiaomi 15 Ultra", price: 90000, performance_score: 99, camera_score: 100, battery: 5500, segment: "ultra_flagship" },
  { brand: "Oppo", model: "Find X7 Ultra", price: 85000, performance_score: 98, camera_score: 99, battery: 5000, segment: "ultra_flagship" },
  { brand: "Vivo", model: "X100 Pro+", price: 85000, performance_score: 98, camera_score: 99, battery: 5400, segment: "ultra_flagship" },
  { brand: "Honor", model: "Magic6 Pro", price: 80000, performance_score: 97, camera_score: 98, battery: 5600, segment: "ultra_flagship" }
];

const catalogUpdates: SeedPhone[] = [
  { brand: "Xiaomi", model: "POCO F7", price: 32000, performance_score: 93, camera_score: 84, battery: 6500, segment: "upper_mid" },
  { brand: "Xiaomi", model: "POCO F7 Pro", price: 36000, performance_score: 95, camera_score: 86, battery: 6000, segment: "upper_mid" },
  { brand: "Xiaomi", model: "POCO X7 Pro", price: 26000, performance_score: 88, camera_score: 82, battery: 6000, segment: "midrange" },
  { brand: "OnePlus", model: "OnePlus 13R", price: 38000, performance_score: 96, camera_score: 88, battery: 5500, segment: "upper_mid" },
  { brand: "OnePlus", model: "OnePlus 12", price: 55000, performance_score: 97, camera_score: 92, battery: 5400, segment: "flagship" },
  { brand: "Realme", model: "GT 7", price: 35000, performance_score: 94, camera_score: 85, battery: 7000, segment: "upper_mid" },
  { brand: "Realme", model: "GT 6", price: 32000, performance_score: 94, camera_score: 85, battery: 5500, segment: "upper_mid" },
  { brand: "Xiaomi", model: "Xiaomi 15", price: 50000, performance_score: 96, camera_score: 94, battery: 5240, segment: "flagship" },
  { brand: "Xiaomi", model: "Xiaomi 14 Ultra", price: 80000, performance_score: 98, camera_score: 99, battery: 5300, segment: "ultra_flagship" },
  { brand: "Samsung", model: "Galaxy A56 5G", price: 23000, performance_score: 85, camera_score: 82, battery: 5000, segment: "midrange" },
  { brand: "Samsung", model: "Galaxy S25", price: 65000, performance_score: 97, camera_score: 93, battery: 4000, segment: "flagship" },
  { brand: "Samsung", model: "Galaxy S25 Ultra", price: 90000, performance_score: 99, camera_score: 98, battery: 5000, segment: "ultra_flagship" },
  { brand: "Apple", model: "iPhone 15", price: 55000, performance_score: 95, camera_score: 90, battery: 3349, segment: "flagship" },
  { brand: "Apple", model: "iPhone 16 Pro Max", price: 95000, performance_score: 99, camera_score: 98, battery: 4600, segment: "ultra_flagship" },
  { brand: "Google", model: "Pixel 8a", price: 30000, performance_score: 90, camera_score: 94, battery: 4500, segment: "midrange" },
  { brand: "Google", model: "Pixel 9 Pro XL", price: 80000, performance_score: 96, camera_score: 99, battery: 5000, segment: "ultra_flagship" },
  { brand: "Honor", model: "Honor 200 Pro", price: 40000, performance_score: 93, camera_score: 92, battery: 5200, segment: "upper_mid" },
  { brand: "Honor", model: "Magic6 Pro", price: 80000, performance_score: 97, camera_score: 98, battery: 5600, segment: "ultra_flagship" },
  { brand: "Vivo", model: "X100", price: 65000, performance_score: 96, camera_score: 96, battery: 5000, segment: "flagship" },
  { brand: "Vivo", model: "X100 Pro+", price: 85000, performance_score: 98, camera_score: 99, battery: 5400, segment: "ultra_flagship" },
  { brand: "Oppo", model: "Find X7", price: 65000, performance_score: 96, camera_score: 95, battery: 5000, segment: "flagship" },
  { brand: "Oppo", model: "Find X7 Ultra", price: 85000, performance_score: 98, camera_score: 99, battery: 5000, segment: "ultra_flagship" },
  { brand: "Motorola", model: "Edge 60 Pro", price: 42000, performance_score: 92, camera_score: 85, battery: 6000, segment: "upper_mid" },
  { brand: "Motorola", model: "Moto G86 5G", price: 18000, performance_score: 80, camera_score: 75, battery: 5200, segment: "entry_mid" },
  { brand: "Xiaomi", model: "Redmi Note 14 5G", price: 15000, performance_score: 78, camera_score: 75, battery: 5110, segment: "entry_mid" },
  { brand: "Xiaomi", model: "Redmi Note 13 Pro 4G", price: 17000, performance_score: 82, camera_score: 85, battery: 5000, segment: "entry_mid" }
];

function mergeSeedCatalog(...catalogs: SeedPhone[][]) {
  const phoneOrder: string[] = [];
  const merged = new Map<string, SeedPhone>();

  for (const catalog of catalogs) {
    for (const phone of catalog) {
      const key = createPhoneCatalogKey(phone.brand, phone.model);
      const existing = merged.get(key);

      if (!existing) {
        phoneOrder.push(key);
        merged.set(key, phone);
        continue;
      }

      merged.set(key, {
        ...existing,
        ...phone,
        brand: existing.brand,
        model: existing.model
      });
    }
  }

  return phoneOrder
    .map((key) => merged.get(key))
    .filter((phone): phone is SeedPhone => Boolean(phone));
}

export const seedPhones: SeedPhone[] = mergeSeedCatalog(baseSeedPhones, catalogUpdates);

export const catalogStats = {
  total: seedPhones.length,
  segments: new Set(seedPhones.map((phone) => phone.segment)).size
};

export const curatedGallery = seedPhones.filter((phone) =>
  [
    "Galaxy S25 Ultra",
    "iPhone 16 Pro Max",
    "Pixel 9 Pro XL",
    "Xiaomi 15",
    "OnePlus 13R",
    "POCO F7 Pro"
  ].includes(phone.model)
);

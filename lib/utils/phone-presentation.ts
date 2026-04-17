interface PhoneIdentity {
  brand: string;
  model: string;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function stripBrandFromModel(brand: string, model: string) {
  const cleanBrand = normalizeWhitespace(brand);
  let cleanModel = normalizeWhitespace(model);

  if (!cleanBrand || !cleanModel) {
    return cleanModel;
  }

  const normalizedBrand = cleanBrand.toLowerCase();

  while (
    cleanModel.toLowerCase() === normalizedBrand ||
    cleanModel.toLowerCase().startsWith(`${normalizedBrand} `)
  ) {
    cleanModel = normalizeWhitespace(cleanModel.slice(cleanBrand.length));

    if (!cleanModel) {
      return "";
    }
  }

  return cleanModel;
}

export function getPhoneDisplayName(brand: string, model: string) {
  const cleanBrand = normalizeWhitespace(brand);
  const cleanModel = stripBrandFromModel(cleanBrand, model);

  if (cleanBrand && cleanModel) {
    return `${cleanBrand} ${cleanModel}`;
  }

  return cleanBrand || cleanModel;
}

export function createPhoneCatalogKey(brand: string, model: string) {
  const cleanBrand = normalizeWhitespace(brand).toLowerCase();
  const cleanModel = stripBrandFromModel(brand, model).toLowerCase();

  return `${cleanBrand}:${cleanModel || cleanBrand}`;
}

export function buildPhoneMarketplaceLinks(phone: PhoneIdentity) {
  const query = encodeURIComponent(getPhoneDisplayName(phone.brand, phone.model));

  return {
    lazada: `https://www.lazada.com.ph/catalog/?q=${query}`,
    shopee: `https://shopee.ph/search?keyword=${query}`
  };
}

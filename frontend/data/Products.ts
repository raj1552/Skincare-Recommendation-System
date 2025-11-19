export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
}

export interface ProductBySkinType {
  normal: Product[];
  dry: Product[];
  oily: Product[];
  combination: Product[];
  sensitive: Product[];
}

export const Products: ProductBySkinType = {
  normal: [
    {
      id: 1,
      name: "Minimalist Oat Extract 06% Gentle Cleanser",
      brand: "Minimalist",
      description:
        "A gentle oat-based cleanser that removes dirt and impurities without damaging the skin barrier. Suitable for all skin types, especially normal and sensitive skin.",
      imageUrl: "/normal/cleanser.jpg",
    },
    {
      id: 2,
      name: "Simple Hydrating Light Moisturiser",
      brand: "Simple",
      description:
        "A lightweight, non-greasy moisturizer enriched with glycerin and vitamin B5. Provides instant hydration and keeps skin soft, smooth, and refreshed.",
      imageUrl: "/normal/moisturiser.jpg",
    },
    {
      id: 3,
      name: "Uv Doux Silicone Sunscreen Gel SPF 50",
      brand: "Uv Doux",
      description:
        "A broad-spectrum sunscreen with SPF 50 PA+++. Its matte, non-sticky formula makes it comfortable for daily use while providing strong UV protection.",
      imageUrl: "/normal/sunscreen.jpg",
    },
    {
      id: 4,
      name: "The Ordinary Hyaluronic Acid 2% + B5",
      brand: "The Ordinary",
      description:
        "A hydrating serum with hyaluronic acid and vitamin B5 that helps retain skin moisture, leaving it plump and smooth.",
      imageUrl: "/normal/serum.jpg",
    },
  ],

  dry: [
    {
      id: 1,
      name: "CeraVe Hydrating Facial Cleanser",
      brand: "CeraVe",
      description:
        "A creamy, non-foaming cleanser with ceramides and hyaluronic acid that removes impurities without stripping moisture, ideal for dry skin.",
      imageUrl: "/dry/cleanser.jpg",
    },
    {
      id: 2,
      name: "CeraVe Moisturizing Cream",
      brand: "CeraVe",
      description:
        "Rich, nourishing cream with ceramides and hyaluronic acid that restores the skin barrier and provides deep hydration for dry skin.",
      imageUrl: "/dry/moisturiser.jpg",
    },
    {
      id: 3,
      name: "CeraVe Hydrating Mineral Sunscreen SPF 50",
      brand: "CeraVe",
      description:
        "A mineral-based sunscreen that offers broad-spectrum protection while hydrating and soothing dry skin.",
      imageUrl: "/dry/sunscreen.jpg",
    },
    {
      id: 4,
      name: "The Ordinary Hyaluronic Acid 2% + B5",
      brand: "The Ordinary",
      description:
        "A deeply hydrating serum that replenishes moisture and helps the skin maintain elasticity, perfect for dry skin types.",
      imageUrl: "/dry/serum.jpg",
    },
  ],

  oily: [
    {
      id: 1,
      name: "Cetaphil Oily Skin Cleanser",
      brand: "Cetaphil",
      description:
        "A gentle foaming face wash that removes excess oil and impurities without overdrying. Ideal for oily and acne-prone skin.",
      imageUrl: "/oily/cleanser.jpg",
    },
    {
      id: 2,
      name: "Cetaphil Oil-Free Moisturizer",
      brand: "Cetaphil",
      description:
        "Light, oil-free moisturizer that keeps oily skin hydrated without clogging pores. Provides a smooth, matte finish.",
      imageUrl: "/oily/moisturiser.jpg",
    },
    {
      id: 3,
      name: "Re'equil Ultra Matte Dry Touch Sunscreen Gel SPF 50 PA++++",
      brand: "Re'equil",
      description:
        "Oil-free, silicone-based sunscreen with SPF 50 PA++++ that gives a matte, non-greasy finish and protects from UVA/UVB rays.",
      imageUrl: "/oily/sunscreen.jpg",
    },
    {
      id: 4,
      name: "The Derma Co. 2% Salicylic BHA Hydrating Toner",
      brand: "The Derma Co.",
      description:
        "A BHA-based toner that unclogs pores, reduces oil buildup, and prevents breakouts while keeping skin hydrated.",
      imageUrl: "/oily/toner.jpg",
    },
  ],

  combination: [
    {
      id: 1,
      name: "Minimalist Gentle Cleanser Oat Extract",
      brand: "Minimalist",
      description:
        "A gentle, non-stripping cleanser with oat extract that balances oil and hydration levels, ideal for combination skin.",
      imageUrl: "/combination/cleanser.jpg",
    },
    {
      id: 2,
      name: "Minimalist 10% Vitamin B5 Gel Face Moisturizer",
      brand: "Minimalist",
      description:
        "A lightweight gel moisturizer enriched with vitamin B5 that hydrates dry areas while keeping oily zones balanced.",
      imageUrl: "/combination/moisturiser.jpg",
    },
    {
      id: 3,
      name: "Uv Doux Silicone Sunscreen Gel SPF 50+",
      brand: "Uv Doux",
      description:
        "Broad-spectrum sunscreen with a smooth matte finish that suits both dry and oily zones of combination skin.",
      imageUrl: "/combination/sunscreen.jpg",
    },
    {
      id: 4,
      name: "The Derma Co 5% Niacinamide Daily Face Serum",
      brand: "The Derma Co",
      description:
        "Serum with niacinamide, alpha arbutin, and multivitamins that help reduce spots and even out skin tone for combination skin.",
      imageUrl: "/combination/serum.jpg",
    },
  ],

  sensitive: [
    {
      id: 1,
      name: "Cetaphil Gentle Skin Cleanser",
      brand: "Cetaphil",
      description:
        "A fragrance-free, non-irritating cleanser that gently removes dirt without stripping moisture, perfect for sensitive skin.",
      imageUrl: "/sensitive/cleanser.jpg",
    },
    {
      id: 2,
      name: "Simple Hydrating Light Moisturiser",
      brand: "Simple",
      description:
        "Hydrating and lightweight moisturizer designed for sensitive skin. Keeps skin soft, smooth, and irritation-free.",
      imageUrl: "/sensitive/moisturiser.jpg",
    },
    {
      id: 3,
      name: "CeraVe Hydrating Mineral Sunscreen SPF 50",
      brand: "CeraVe",
      description:
        "Mineral sunscreen with ceramides and niacinamide that protects and calms sensitive skin without clogging pores.",
      imageUrl: "/sensitive/sunscreen.jpg",
    },
    {
      id: 4,
      name: "Aloe Vera Soothing Gel Moisturizer",
      brand: "Nature Republic",
      description:
        "Soothing aloe vera gel that hydrates and calms sensitive or irritated skin while providing a cooling effect.",
      imageUrl: "/sensitive/gel.jpg",
    },
  ],
};

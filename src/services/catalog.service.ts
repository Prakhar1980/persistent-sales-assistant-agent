import catalog from "../catalog.json" with { type: "json" };

export type Plan = {
  name: string;
  price: string;
  features: string[];
};

export type CatalogSearchResult = {
  name: string;
  price: string;
  matched_features: string[];
  all_features: string[];
};

export function getCatalog(): { plans: Plan[] } {
  return catalog;
}

export function searchCatalogService(query: string): CatalogSearchResult[] {
  const terms = query
    .toLowerCase()
    .replace(/[^\w\s$]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  return catalog.plans
    .map((plan) => {
      const haystack = [plan.name, plan.price, ...plan.features].join(" ").toLowerCase();
      const matchedFeatures = plan.features.filter((feature) =>
        terms.some((term) => feature.toLowerCase().includes(term))
      );

      return {
        plan,
        matched: terms.length === 0 || terms.some((term) => haystack.includes(term)),
        matchedFeatures
      };
    })
    .filter((item) => item.matched)
    .map((item) => ({
      name: item.plan.name,
      price: item.plan.price,
      matched_features: item.matchedFeatures,
      all_features: item.plan.features
    }));
}

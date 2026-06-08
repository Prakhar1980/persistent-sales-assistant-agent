import { CatalogSearchResult, searchCatalogService } from "../services/catalog.service.js";

export function searchCatalog(query: string): CatalogSearchResult[] {
  return searchCatalogService(query);
}


/**
 * Examples of using the Internal Router Service
 * 
 * The internalRouter service provides a centralized way to make API calls,
 * abstracting away the actual API endpoints and allowing for:
 * - Automatic authentication token injection
 * - Error handling and transformation
 * - Request/response logging
 * - Easy endpoint updates without changing application code
 */

import { router } from "./internalRouter";

// Example 1: Fetch catalogs
export async function fetchCatalogs() {
  // Internal: calls GET /api/catalogs
  // External API endpoint could change, application code doesn't need to
  const response = await router.get("/catalogs");

  if (response.error) {
    console.error("Failed to fetch catalogs:", response.error);
    return [];
  }

  return response.data as Array<{ id: string; name: string }>;
}

// Example 2: Create a new catalog
export async function createCatalog(name: string, description: string) {
  // Internal: calls POST /api/catalogs
  const response = await router.post("/catalogs", {
    name,
    description,
  });

  if (response.error) {
    throw new Error(`Failed to create catalog: ${response.error}`);
  }

  return response.data;
}

// Example 3: Update a catalog
export async function updateCatalog(id: string, updates: Record<string, unknown>) {
  // Internal: calls PUT /api/catalogs/{id}
  const response = await router.put(`/catalogs/${id}`, updates);

  if (response.error) {
    throw new Error(`Failed to update catalog: ${response.error}`);
  }

  return response.data;
}

// Example 4: Delete a catalog
export async function deleteCatalog(id: string) {
  // Internal: calls DELETE /api/catalogs/{id}
  const response = await router.delete(`/catalogs/${id}`);

  if (response.error) {
    throw new Error(`Failed to delete catalog: ${response.error}`);
  }

  return true;
}

// Example 5: Fetch parameters with nested structure
export async function fetchParameters() {
  // Internal: calls GET /api/parameters
  const response = await router.get("/parameters");

  if (response.error) {
    console.error("Failed to fetch parameters:", response.error);
    return [];
  }

  return response.data as Array<{ id: string; name: string; children?: unknown[] }>;
}

// Example 6: Search with query parameters (encoded in URL)
export async function searchCatalogs(query: string) {
  // Internal: calls GET /api/catalogs/search?q={query}
  const response = await router.get(`/catalogs/search?q=${encodeURIComponent(query)}`);

  if (response.error) {
    console.error("Failed to search catalogs:", response.error);
    return [];
  }

  return response.data;
}

// Example 7: Batch operations
export async function batchUpdateParameters(updates: Array<{ id: string; value: unknown }>) {
  // Internal: calls POST /api/parameters/batch
  const response = await router.post("/parameters/batch", { updates });

  if (response.error) {
    throw new Error(`Batch update failed: ${response.error}`);
  }

  return response.data;
}

// Example 8: With custom timeout
export async function fetchWithTimeout() {
  const response = await router.get("/long-running-operation", {
    timeout: 60000, // 60 seconds
  });

  if (response.error) {
    console.error("Operation timed out or failed:", response.error);
    return null;
  }

  return response.data;
}

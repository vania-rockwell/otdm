# Internal Router Service

The Internal Router Service provides a centralized, abstraction layer for all API calls in the Data Configuration Hub application.

## Purpose

- **Hide Implementation Details**: Abstraction of actual API endpoints from application code
- **Centralized Management**: Single point to manage all API interactions
- **Authentication**: Automatic token injection and management
- **Error Handling**: Consistent error responses across all API calls
- **Logging & Monitoring**: Easy to add logging, metrics, and monitoring
- **Easy Maintenance**: Update API endpoints without changing application code

## Usage

### Basic GET Request

```typescript
import { router } from "@/services/internalRouter";

const response = await router.get("/catalogs");

if (response.error) {
  console.error("Error:", response.error);
  return;
}

console.log(response.data);
```

### POST Request

```typescript
const response = await router.post("/catalogs", {
  name: "My Catalog",
  description: "A new catalog",
});

if (response.error) {
  throw new Error(response.error);
}

return response.data;
```

### PUT Request

```typescript
const response = await router.put("/catalogs/123", {
  name: "Updated Name",
});
```

### DELETE Request

```typescript
const response = await router.delete("/catalogs/123");
```

### PATCH Request

```typescript
const response = await router.patch("/catalogs/123", {
  status: "archived",
});
```

## API Response Format

All requests return an `ApiResponse<T>` object:

```typescript
interface ApiResponse<T> {
  data?: T;        // Response data (if successful)
  error?: string;  // Error message (if failed)
  status: number;  // HTTP status code (0 for network errors)
  message?: string; // Additional message from server
}
```

## Authentication

The router automatically injects the authentication token from `localStorage` into all requests as a Bearer token:

```
Authorization: Bearer {token}
```

### Setting/Clearing Tokens

```typescript
// Set token
router.setAuthToken("your-auth-token");

// Clear token
router.clearAuthToken();
```

## Advanced Options

You can pass additional options to any request:

```typescript
interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;        // Default: 30000ms
  signal?: AbortSignal;    // For request cancellation
}

// Example with custom timeout
const response = await router.get("/long-operation", {
  timeout: 60000, // 60 seconds
});

// Example with custom headers
const response = await router.post("/upload", data, {
  headers: {
    "X-Custom-Header": "value",
  },
});
```

## Real API Endpoint Mapping

The service builds URLs based on `VITE_API_URL` environment variable or defaults to `/api`:

| Internal Call | Real Endpoint |
|---|---|
| `router.get("/catalogs")` | `GET /api/catalogs` |
| `router.post("/catalogs", data)` | `POST /api/catalogs` |
| `router.put("/catalogs/123", data)` | `PUT /api/catalogs/123` |
| `router.delete("/catalogs/123")` | `DELETE /api/catalogs/123` |
| `router.get("/catalogs/search?q=test")` | `GET /api/catalogs/search?q=test` |

## Environment Variables

Create a `.env.local` file in the project root:

```
VITE_API_URL=http://localhost:3000/api
```

Or it defaults to `/api` (relative to the application root).

## Error Handling

The service returns consistent error responses:

```typescript
const response = await router.get("/catalogs");

if (response.error) {
  // Handle error
  console.error(`HTTP ${response.status}: ${response.error}`);
  console.error(`Message: ${response.message}`);
  return;
}

// Use response.data
```

## Extending the Service

To add custom methods or logic:

```typescript
import { InternalRouter } from "@/services/internalRouter";

class ExtendedRouter extends InternalRouter {
  async fetchWithRetry(endpoint: string, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      const response = await this.get(endpoint);
      if (!response.error) return response;
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
      }
    }
    throw new Error("Max retries exceeded");
  }
}

export const extendedRouter = new ExtendedRouter();
```

## Benefits

✅ **Decoupling**: Application code doesn't know about real API endpoints  
✅ **Flexibility**: Easy to change backend URLs without updating app code  
✅ **Consistency**: All API calls follow the same pattern  
✅ **Monitoring**: Single point to add logging, metrics, tracing  
✅ **Security**: Centralized auth token management  
✅ **Testing**: Easy to mock in tests  

## Example: Complete Implementation

```typescript
// Feature service
import { router } from "@/services/internalRouter";

export interface Catalog {
  id: string;
  name: string;
  description: string;
}

export async function getCatalogs(): Promise<Catalog[]> {
  const response = await router.get<Catalog[]>("/catalogs");
  
  if (response.error) {
    console.error("Failed to fetch catalogs:", response.error);
    return [];
  }
  
  return response.data || [];
}

export async function createCatalog(data: Omit<Catalog, "id">) {
  const response = await router.post<Catalog>("/catalogs", data);
  
  if (response.error) {
    throw new Error(`Failed to create catalog: ${response.error}`);
  }
  
  return response.data;
}

// In component
import { getCatalogs } from "@/services/catalogService";

export function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  
  useEffect(() => {
    getCatalogs().then(setCatalogs);
  }, []);
  
  return (
    <div>
      {catalogs.map(catalog => (
        <div key={catalog.id}>{catalog.name}</div>
      ))}
    </div>
  );
}
```

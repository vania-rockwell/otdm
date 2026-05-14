import sampleParametersTable from "../assets/data/parametersTable.sample.json";
// import { router } from "./internalRouter";

const MOCK_LATENCY_MS = 300;

type ParameterContextColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "neutral";

export type ParameterTableContext = {
  label: string;
  color: ParameterContextColor;
};

export type ParameterTableRow = {
  id: string;
  capabilityDomain: string;
  name: string;
  dataType: string;
  contexts: ParameterTableContext[];
};

// type ParameterTablePayload = ParameterTableRow[] | { items?: ParameterTableRow[] }; // Re-enable with API

function normalizeParameterRows(raw: unknown): ParameterTableRow[] {
  if (Array.isArray(raw)) {
    return raw as ParameterTableRow[];
  }

  if (
    raw !== null &&
    typeof raw === "object" &&
    "items" in raw &&
    Array.isArray((raw as { items?: unknown }).items)
  ) {
    return (raw as { items: ParameterTableRow[] }).items;
  }

  return [];
}

function waitMockLatency(signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }
      resolve();
    }, MOCK_LATENCY_MS);

    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };

    if (!signal) {
      return;
    }

    if (signal.aborted) {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export type FetchParametersTableOptions = {
  signal?: AbortSignal;
};

/**
 * Fetches parameter rows for the Parameters table through the internal router.
 * @param options Optional cancellation signal for request lifecycle management.
 * @returns The parameter rows from API when available, otherwise sample JSON rows.
 */
export async function fetchParametersTable(
  options?: FetchParametersTableOptions
): Promise<ParameterTableRow[]> {
//   const response = await router.get<ParameterTablePayload>("/parameters", {
//     signal: options?.signal,
//   });

//   if (!response.error && response.data !== undefined) {
//     return normalizeParameterRows(response.data);
//   }

  await waitMockLatency(options?.signal);
  return normalizeParameterRows(sampleParametersTable);
}

import { task } from "@renderinc/sdk/workflows";

const DEFAULT_HEALTH_ENDPOINT =
  "https://waste-tracker-backend-city.onrender.com/health";

type HealthPingResult = {
  endpoint: string;
  ok: boolean;
  status: number;
  statusText: string;
  startedAt: string;
  checkedAt: string;
  bodyPreview: string;
};

export const pingRenderHealthEndpoint = task(
  {
    name: "pingRenderHealthEndpoint",
    retry: { maxRetries: 3, waitDurationMs: 10_000, backoffScaling: 2 },
    timeoutSeconds: 60,
  },
  async (): Promise<HealthPingResult> => {
    const endpoint = process.env.HEALTH_ENDPOINT ?? DEFAULT_HEALTH_ENDPOINT;
    const startedAt = new Date().toISOString();

    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json, text/plain, */*" },
    });

    const body = await response.text();
    const bodyPreview = body.slice(0, 500);

    if (!response.ok) {
      throw new Error(
        `Health endpoint failed with ${response.status} ${response.statusText}: ${bodyPreview}`
      );
    }

    return {
      endpoint,
      ok: true,
      status: response.status,
      statusText: response.statusText,
      startedAt,
      checkedAt: new Date().toISOString(),
      bodyPreview,
    };
  }
);

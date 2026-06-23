const endpoint =
  process.env.HEALTH_ENDPOINT ??
  "https://waste-tracker-backend-city.onrender.com/health";

const startedAt = new Date().toISOString();

const response = await fetch(endpoint, {
  method: "GET",
  headers: { Accept: "application/json, text/plain, */*" },
});

const body = await response.text();
const bodyPreview = body.slice(0, 500);

if (!response.ok) {
  throw new Error(
    `Health check failed at ${startedAt}: ${response.status} ${response.statusText} ${bodyPreview}`
  );
}

console.log(
  JSON.stringify({
    ok: true,
    endpoint,
    status: response.status,
    statusText: response.statusText,
    startedAt,
    checkedAt: new Date().toISOString(),
    bodyPreview,
  })
);

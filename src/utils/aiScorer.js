// Client-Side Caller: Talks to YOUR backend server (/api/evaluate)
// The browser NEVER sees, handles, or needs an API key.

export async function evaluateStrategy(userText, caseData) {
  const cleanInput = userText.trim();

  // Call the server's private endpoint
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userText: cleanInput,
      caseData
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server Error: HTTP ${res.status}`);
  }

  return await res.json();
}

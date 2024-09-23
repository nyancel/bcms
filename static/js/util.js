async function util_fetch_post(endpoint, data) {
  let response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let response_json = await response.json();
  return response_json;
}

async function util_fetch_post_json(endpoint, data) {
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

async function util_fetch_post_formdata(endpoint, data) {
  let response = await fetch(endpoint, {
    method: "POST",
    body: data,
  });

  let json_response = await response.json();
  return json_response;
}

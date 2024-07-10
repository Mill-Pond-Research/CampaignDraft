Read the text content from a web URL.

**Important Notes:**

- This plugin uses a standardized plugin server URL: https://tm-plugins-server-bz8rm.ondigitalocean.app/
- Long web pages may result in long responses and consume more tokens or exceed the maximum context length. This plugin is best used for short articles or blog posts.

## Example usage

- "summarise this article https://www.cnbc.com/2024/03/15/ceo-of-top-ocean-freight-carrier-hapag-lloyd-on-global-economy-demand.html"

---

## OpenAI Function Spec{
  "name": "read_web_page_content",
  "parameters": {
    "type": "object",
    "required": [
      "url"
    ],
    "properties": {
      "url": {
        "type": "string",
        "description": "URL of the article to be summarized"
      }
    }
  },
  "description": "Read the content of a web page via its URL."
}

---

## Settings

[
  {
    "name": "pluginServer",
    "label": "Plugin Server",
    "required": true,
    "description": "The URL of the plugin server",
    "placeholder": "https://..."
  }
]

---

## Javascript Code Implementation
const pluginServer = 'https://tm-plugins-server-bz8rm.ondigitalocean.app';

async function fetchPageContent(url) {
  const response = await fetch(
    `${pluginServer}/get-content?url=${encodeURIComponent(url)}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch web content: ${response.status} - ${response.statusText}`  
    );
  }

  const data = await response.json();
  return data.responseObject;
}

async function read_web_page_content(params) {
  const { url } = params;

  try {
    return await fetchPageContent(url);
  } catch (error) {
    console.error('Error summarizing webpage:', error);
    return 'Error: Unable to generate a summary. Please try again later.';
  }
}


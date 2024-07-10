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

module.exports = { read_web_page_content };
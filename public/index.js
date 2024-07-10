const form = document.getElementById('marketing-form');
const campaignResults = document.getElementById('campaign-results');
const loadingIndicator = document.getElementById('loading-indicator');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoadingIndicator();
    clearCampaignResults();
    
    const userInputs = getUserInputs();
    console.log('User inputs:', userInputs);

    try {
        const response = await sendCampaignRequest(userInputs);
        const generatedCampaign = await handleResponse(response);
        displayCampaign(generatedCampaign);
    } catch (error) {
        handleError(error);
    } finally {
        hideLoadingIndicator();
    }
});

function showLoadingIndicator() {
    loadingIndicator.style.display = 'block';
}

function clearCampaignResults() {
    campaignResults.innerHTML = '';
}

function getUserInputs() {
    const formData = new FormData(form);
    const inputs = Object.fromEntries(formData);
    console.log('Form inputs:', inputs);
    return inputs;
}

async function sendCampaignRequest(userInputs) {
    console.log('Sending user inputs to server:', userInputs);
    const response = await fetch('http://localhost:3000/generate-campaign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInputs),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}

async function handleResponse(response) {
    const data = await response.json();
    return data.campaign;
}

function displayCampaign(generatedCampaign) {
    campaignResults.innerHTML = marked.parse(generatedCampaign);
}

function handleError(error) {
    console.error('Error:', error);
    campaignResults.innerHTML = `<p>An error occurred while generating the campaign: ${error.message}</p>`;
}

function hideLoadingIndicator() {
    loadingIndicator.style.display = 'none';
}
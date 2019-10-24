let auth0 = null;
const fetchAuthConfig = () => fetch('/js/auth_config.json');
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
  });
};
window.onload = async () => {
  await configureClient();
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    // show the gated content
  }
  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    // Process the login state
    await auth0.handleRedirectCallback();

    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, '/');
  }
  updateUI();
};

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();

  if (window.location.pathname === '/profile/') {
    document.getElementById(
      'ipt-access-token'
    ).innerHTML = await auth0.getTokenSilently();
  } else {
    document.getElementById('btn-logout').disabled = !isAuthenticated;
    document.getElementById('btn-login').disabled = isAuthenticated;
  }
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: 'https://netlify-auth0-demo.netlify.com/profile/',
  });
};

const logout = () => {
  auth0.logout({
    returnTo: window.location.origin,
  });
};

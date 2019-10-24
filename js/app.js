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
  updateUI();
};

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();

  if (window.location.pathname === '/profile/') {
    document.getElementById(
      'ipt-access-token'
    ).innerHTML = await auth0.getTokenSilently();
    document.getElementById('ipt-user-profile').innerHTML = JSON.stringify(
      await auth0.getUser()
    );
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

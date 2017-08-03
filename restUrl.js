window.baseRestURL = 'https://api.master.snapshot.dave.dbg-devops.com'; // 'http(s)://someUrl:port/path'
window.authWellKnownEndpoint = 'https://auth.dave.dbg-devops.com/auth/realms/DAVe/.well-known/openid-configuration';
window.authClientID = 'dave-ui';
window.authScopes = ['profile', 'group'];
//window.authFlow = 'openid-connect/direct';
window.authFlow = 'openid-connect/authorization-code';
//window.authFlow = 'openid-connect/hybrid';
//window.authFlow = 'openid-connect/implicit';

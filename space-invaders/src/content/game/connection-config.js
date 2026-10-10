export const PRODUCTION_RELAY='https://rmc-colyseus-multiplayer-server.vercel.app';

export function getRelayEndpoint(environment) {
  const url=new URL(environment.VITE_MULTIPLAYER_ENDPOINT||PRODUCTION_RELAY);
  const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  if(url.username||url.password||url.search||url.hash||url.pathname!=='/')throw Error('Configure a relay origin without credentials, path, or query parameters.');
  if(url.protocol!=='https:'&&!(environment.DEV&&local&&url.protocol==='http:'))throw Error('The multiplayer relay requires HTTPS; HTTP is allowed only for local development.');
  return url.origin;
}

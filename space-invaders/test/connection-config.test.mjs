import test from 'node:test';
import assert from 'node:assert/strict';
import {getRelayEndpoint,PRODUCTION_RELAY} from '../src/content/game/connection-config.js';
test('production relay is explicit and insecure or credential-bearing overrides fail visibly',()=>{
 assert.equal(getRelayEndpoint({}),PRODUCTION_RELAY);
 assert.equal(getRelayEndpoint({DEV:true,VITE_MULTIPLAYER_ENDPOINT:'http://127.0.0.1:2567'}),'http://127.0.0.1:2567');
 for(const endpoint of ['http://127.0.0.1:2567','http://relay.example','https://user:password@relay.example','https://relay.example/path','https://relay.example?token=secret'])assert.throws(()=>getRelayEndpoint({DEV:false,VITE_MULTIPLAYER_ENDPOINT:endpoint}));
});

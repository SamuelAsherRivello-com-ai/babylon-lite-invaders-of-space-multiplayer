// Original pixel shapes and PNG encoder. No external imagery or fonts.
import fs from 'node:fs';
import { deflateSync } from 'node:zlib';
const W=256,H=32, pixels=Buffer.alloc(W*H*4);
function pixel(x,y,hex) { const c=hex.match(/../g).map(v=>parseInt(v,16)); pixels.set([...c,255],(y*W+x)*4); }
function shape(frame,rows,color) {
 const ox=frame*16+Math.floor((16-rows[0].length)/2),oy=Math.floor((16-rows.length)/2);
 rows.forEach((row,y)=>[...row].forEach((v,x)=>{if(v==='1')pixel(ox+x,oy+y,color);if(v==='2')pixel(ox+x,oy+y,'f5f3df');if(v==='3')pixel(ox+x,oy+y,'162a47');}));
}
const ship=['00000200000','00002220000','00012221000','00012321000','00112321100','01112321110','11111111111','11101110111','11000100011'];
['68e8bd','ffbc69','bf9bff','70caff'].forEach((c,i)=>shape(i,ship,c));
const bug=['00100000100','00010001000','00111111100','01121112110','11111111111','10111111101','10100000101','00011011000'];
const moth=['00001110000','00011111000','01121112110','11111111111','11101110111','01010001010','10001000100','00010001000'];
const shell=['00011111000','00111111100','01121112110','11111111111','11111111111','01111111110','00101010100','01000000010'];
[bug,moth,shell].forEach((rows,i)=>{shape(4+i*2,rows,['ff766e','e5b7ff','80cfd0'][i]);shape(5+i*2,rows.map((r,y)=>y>5?r.split('').reverse().join(''):r),['ff766e','e5b7ff','80cfd0'][i]);});
shape(10,['00200','01210','01210','01210','00100'],'a4ffe1');
shape(11,['010','111','010','010','111','010'],'ff685e');
shape(12,['001000100','000101000','100010001','001222100','011222110','001222100','100010001','000101000','001000100'],'ffba70');
shape(13,['0001000','0001000','0112110','0001000','0001000'],'a5c4d2');
shape(14,['11111111111','10000000001','10111111101','10100000101','10101110101','10100000101','10111111101','10000000001','11111111111'],'e9b467');
shape(15,['1111111111111111'],'24425b');
// Second row: original tiny lunar rocks and HUD accents.
for(let i=0;i<48;i++) pixel((i*47+11)%W,16+(i*13)%16, i%4?'183247':'2c4960');
function crc(b) {let c=0xffffffff;for(const n of b){c^=n;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type),n=Buffer.alloc(4),c=Buffer.alloc(4);n.writeUInt32BE(data.length);c.writeUInt32BE(crc(Buffer.concat([t,data])));return Buffer.concat([n,t,data,c]);}
const header=Buffer.alloc(13);header.writeUInt32BE(W);header.writeUInt32BE(H,4);header[8]=8;header[9]=6;
const scan=Buffer.alloc((W*4+1)*H);for(let y=0;y<H;y++)pixels.copy(scan,y*(W*4+1)+1,y*W*4,(y+1)*W*4);
fs.mkdirSync('space-invaders/public/art',{recursive:true});
fs.writeFileSync('space-invaders/public/art/orbit-atlas.png',Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(scan)),chunk('IEND',Buffer.alloc(0))]));

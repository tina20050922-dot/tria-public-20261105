import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('public');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json','.woff2':'font/woff2','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.url==='/healthz'){res.writeHead(200,{'Content-Type':'text/plain'});return res.end('ok');}
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/')){res.writeHead(503,{'Content-Type':'application/json'});return res.end(JSON.stringify({ok:false,message:'目前暫不提供線上寄信，請使用網站聯絡方式。'}));}
  let path=resolve(root,'.'+decodeURIComponent(url.pathname));
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);return res.end();}
  let info;try{info=await stat(path)}catch{}
  if(!info?.isFile()){
   if(extname(path)){res.writeHead(404);return res.end();}
   path=resolve(root,'index.html');
  }
  const data=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end();}
}).listen(Number(process.env.PORT)||3000,'0.0.0.0');

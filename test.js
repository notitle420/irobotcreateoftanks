var os = require('os');

var interfaces = os.networkInterfaces();
var ip= '';
for(let dev in interfaces){
  interfaces[dev].forEach((details)=>{
    if(details.internal || details.family != 'IPv4') return;
    ip =details.address;
    console.log(ip);
  });
}

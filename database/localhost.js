var dns = require('dns');
var os = require('os');

var networkInterfaces = os.networkInterfaces( );
var ethernet = networkInterfaces.Ethernet;

var local_ip_v4 = "127.0.0.1";
var local_ip_v6 = "fe80::7177:9267:4b8b:9eca";

for (var i in ethernet) {
    if (ethernet[i].family == "IPv4") {
        local_ip_v4 = ethernet[i].address;
    } else if (ethernet[i].family == "IPv6") {
        local_ip_v6 = ethernet[i].address;
    }
}

module.exports = {
    local_ip_v4: local_ip_v4,
    local_ip_v6: local_ip_v6
}
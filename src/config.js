module.exports = {
    port: 8080, //8443
    url: `http://localhost:${8080}`,
    sessionSecret: 'be-project-Kacper-Adamczyk-session',
    tokenSecret: 'be-project-Kacper-Adamczyk-token'
};

// const sslOptions = {
//     key: fs.readFileSync('certificate/ukey.pem'),
//     cert: fs.readFileSync('certificate/cert.pem')
// };
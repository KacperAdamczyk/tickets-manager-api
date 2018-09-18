class DatabaseConfig {
    static ip = 'localhost';
    static port = 27017;
    static database = 'be-project';
    static connectionString = `mongodb://${DatabaseConfig.ip}:${DatabaseConfig.port}/${DatabaseConfig.database}`;
}

class ServerConfig {
    static port = 8080; // 8443
    static url = `http://localhost:${ServerConfig.port}`;
    static sessionSecret = 'be-project-Kacper-Adamczyk-session';
    static tokenSecret = 'be-project-Kacper-Adamczyk-token';
}

// const sslOptions = {
//     key: fs.readFileSync('certificate/ukey.pem'),
//     cert: fs.readFileSync('certificate/cert.pem')
// };

export default {
    DatabaseConfig,
    ServerConfig,
};

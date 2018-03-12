const env = process.env.NODE_ENV;

function isRunningTest() {
    return env && env.includes('test');
}

class DatabaseConfig {
    public static ip = 'localhost';
    public static database = 'be-project';
    public static  connectionString = `mongodb://${DatabaseConfig.ip}/${DatabaseConfig.database}`;
}

// noinspection TsLint
class ServerConfig {
    public static port = 8080; // 8443
    public static url = `http://localhost:${ServerConfig.port}`;
    public static sessionSecret = 'be-project-Kacper-Adamczyk-session';
    public static tokenSecret = 'be-project-Kacper-Adamczyk-token';
}

// const sslOptions = {
//     key: fs.readFileSync('certificate/ukey.pem'),
//     cert: fs.readFileSync('certificate/cert.pem')
// };

export default {
    DatabaseConfig,
    ServerConfig,
    isRunningTest
};

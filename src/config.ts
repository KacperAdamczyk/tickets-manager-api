const env = process.env.NODE_ENV;

function isRunningTest() {
    return env && env.includes('test');
}

class DatabaseConfig {
    public ip = 'localhost';
    public database = 'be-project';
    public connectionString = `mongodb://${this.ip}/${this.database}`;
}

// noinspection TsLint
class ServerConfig {
    public port = 8080; // 8443
    public url = `http://localhost:${this.port}`;
    public sessionSecret = 'be-project-Kacper-Adamczyk-session';
    public tokenSecret = 'be-project-Kacper-Adamczyk-token';
}

// const sslOptions = {
//     key: fs.readFileSync('certificate/ukey.pem'),
//     cert: fs.readFileSync('certificate/cert.pem')
// };

export default {
    ...new DatabaseConfig(),
    ...new ServerConfig(),
    isRunningTest
};

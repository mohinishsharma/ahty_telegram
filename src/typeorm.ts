import { DataSource } from "typeorm";
import { getConfigValue } from "./utils/config";
import { User } from "./entities/user";

const typeOrmConfig = getConfigValue("mysql");
const appDebug = getConfigValue("debug");

const dataSource = new DataSource({
    type: "mysql",
    host: typeOrmConfig.host,
    port: typeOrmConfig.port,
    username: typeOrmConfig.user,
    password: typeOrmConfig.password,
    database: typeOrmConfig.database,
    synchronize: false,
    logging: appDebug,
    entities: [
        User
    ],
});

export default dataSource;

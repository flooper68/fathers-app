import { config } from 'dotenv';

export interface ApplicationConfig {
  dbUsername: string;
  dbPassword: string;
  dbHost: string;
  dbPort: string;
  dbName: string;
  authenticationDbName: string;
  serverPort: string;
  woocommerceUrl: string;
  woocommerceKey: string;
  woocommerceSecret: string;
}

const getRequiredVariable = (key: string): string => {
  const variable = process.env[key];

  if (!variable) {
    throw new Error(`Missing env ${key}`);
  }
  return variable;
};

const getOptionalVariable = (key: string): string | undefined => {
  const variable = process.env[key];
  return variable;
};

export const getApplicationConfig = (): ApplicationConfig => {
  config();

  return {
    dbUsername: getRequiredVariable('MONGO_DB_USERNAME'),
    dbPassword: getRequiredVariable('MONGO_DB_PASSWORD'),
    dbHost: getRequiredVariable('MONGO_DB_HOST'),
    dbPort: getRequiredVariable('MONGO_DB_PORT'),
    dbName: getRequiredVariable('MONGO_DB_DATABASE_NAME'),
    authenticationDbName: getRequiredVariable(
      'MONGO_DB_AUTHENTICATION_DATABASE_NAME'
    ),
    serverPort: getOptionalVariable('SERVER_PORT') || `3002`,
    woocommerceUrl: getRequiredVariable('WOOCOMMERCE_URL'),
    woocommerceKey: getRequiredVariable('WOOCOMMERCE_KEY'),
    woocommerceSecret: getRequiredVariable('WOOCOMMERCE_SECRET'),
  };
};

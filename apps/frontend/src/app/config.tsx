type ApplicationConfig = {
  apiRoot: string;
};

enum ConfigProfileName {
  LOCAL = 'local',
  PRODUCTION = 'production',
}

const config: { [profileName in ConfigProfileName]: ApplicationConfig } = {
  local: {
    apiRoot: 'http://localhost:3001',
  },
  production: {
    apiRoot: '/api',
  },
};

export function getConfig() {
  // get APPLICATION_ENV environment variable from within Next.js
  const env = process.env.NEXT_PUBLIC_APPLICATION_ENV as ConfigProfileName;
  if (!env) {
    throw new Error('NEXT_PUBLIC_APPLICATION_ENV environment variable not found');
  }
  if (!config[env]) {
    throw new Error(`Config for environment '${env}' not found`);
  }
  return config[env];
}

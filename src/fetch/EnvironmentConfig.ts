class EnvironmentConfig {
  static fetch(url: string = 'config.json'): Promise<object> {
    return new Promise((resolve, reject) => {
      fetch(url).then((response) => {
        const statusCode = response.status;

        if (statusCode !== 401 && statusCode >= 400) {
          reject({
            title: 'Error',
            body: 'Could not fetch environment config!\n\n' + url,
          });
          return;
        }
        response
          .json()
          .then((json) => {
            EnvironmentConfig.set(json);
            resolve(json);
          })
          .catch((err) => {
            console.log(err, url);
            reject({
              title: 'Error',
              body: 'Could not read environment config!\n\n' + url,
            });
          });
      });
    });
  }
  static get(): any {
    const config = localStorage.getItem('envConfig') || '{}';
    return JSON.parse(config);
  }
  static set(config: any): void {
    localStorage.setItem('envConfig', JSON.stringify(config));
  }
}

export default EnvironmentConfig;

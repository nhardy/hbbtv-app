declare namespace Nodemon {
  interface Config {
    script: string;
  }

  interface Monitor {
    restart(): void;
    once(name: string, callback: () => void): void;
  }
}
declare module 'nodemon' {
  const nodemon: (config: Nodemon.Config) => Nodemon.Monitor;
  export default nodemon;
}

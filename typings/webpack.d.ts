declare module "*.jpg" {
  const url: string;
  export = url;
}

declare module "*.png" {
  const url: string;
  export = url;
}

declare module "*.styl" {
  interface IStyles {
    [local: string]: string;
  }
  const styles: IStyles;
  export = styles;
}

declare module "*.svg" {
  const url: string;
  export = url;
}

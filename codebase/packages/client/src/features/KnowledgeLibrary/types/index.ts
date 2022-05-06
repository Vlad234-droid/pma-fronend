export type Item = {
  id: string;
  img: string;
  title: string;
  description: string;
  imgDescription: string;
  link?: string;
};

export enum DataType {
  MANAGERS = 'namagers',
  COLLEAGUES = 'colleagues',
}

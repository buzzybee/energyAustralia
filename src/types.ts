// JSON typings
export interface IBandAPIResponse {
  name: string;
  recordLabel?: string;
}

export interface IFestivalAPIResponse {
  name?: string;
  bands: [IBandAPIResponse];
}

export interface IFestival {
  name: string;
}

import { IFestival } from '../types';

export default class BandModel {
  private readonly _bandName: string;
  private _festivals = new Set<IFestival>();

  constructor(bandName: string) {
    this._bandName = bandName;
  }

  addFestival(festivalName: string) {
    this._festivals.add({ name: festivalName });
  }

  get bandName() {
    return this._bandName;
  }

  get festivals() {
    return Array.from(this._festivals).sort();
  }

  asString() {
    const festivalString = this.festivals.map(f => f.name).join(', ');
    if (festivalString) {
      return `\tBand '${this.bandName}'\n\t\t'${festivalString}' Festival`;
    } else {
      // some bands have not attended any festivals
      return `\tBand '${this.bandName}'`;
    }
  }
}

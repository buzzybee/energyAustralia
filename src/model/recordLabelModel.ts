import * as lodash from 'lodash';
import BandModel from './bandModel';

export default class RecordLabelModel {
  private readonly _recordLabel: string;
  private _bands = new Set<BandModel>();

  constructor(recordLabel: string) {
    this._recordLabel = recordLabel;
  }

  get recordLabel() {
    return this._recordLabel;
  }

  get bands() {
    return lodash.sortBy(Array.from(this._bands), 'bandName');
  }

  addBand(band: BandModel) {
    this._bands.add(band);
  }

  asString() {
    const bandString = this.bands.map(b => b.asString()).join('\n');
    return `Record Label '${this.recordLabel}'\n${bandString}`;
  }
}

export default class FestivalModel {
  private readonly _name: string;
  private bandMap = new Map<string, [string | undefined]>();

  constructor(name: string) {
    this._name = name;
  }

  addBand(bandName: string, recordLabel?: string) {
    if (this.bandMap.has(bandName)) {
      this.bandMap.get(bandName)?.push(recordLabel);
    } else {
      this.bandMap.set(bandName, [recordLabel]);
    }
  }

  get name() {
    return this._name;
  }

  get bands(): Map<string, [string | undefined]> {
    return this.bandMap;
  }
}

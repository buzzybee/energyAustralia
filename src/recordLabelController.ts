import { IFestivalAPIResponse } from './types';
import * as FestivalsApiService from './api/festivalsApiService';
import RecordLabelModel from './model/recordLabelModel';
import RecordLabelService from './service/recordLabelService';

export default class RecordLabelController {
  private _recordLabelMap = new Map<string, RecordLabelModel>();
  private recordLabelService = new RecordLabelService();

  click = async () => {
    const festivalJSONData = await FestivalsApiService.getData();
    this.buildModel(festivalJSONData);
  };

  get recordLabels(): Map<string, RecordLabelModel> {
    return this._recordLabelMap;
  }

  private buildModel = (festivalJSON: [IFestivalAPIResponse]) => {
    if (festivalJSON && festivalJSON.length > 0) {
      this._recordLabelMap = this.recordLabelService.buildRecordLabelModel(
        this.recordLabelService.buildFestivalModel(festivalJSON)
      );
    }
  };

  getResult() {
    return Array.from(this.recordLabels.values())
      .map(m => m.asString())
      .join('\n');
  }
}

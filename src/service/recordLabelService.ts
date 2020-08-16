import { IFestivalAPIResponse } from '../types';
import FestivalModel from '../model/festivalModel';
import BandModel from '../model/bandModel';
import RecordLabelModel from '../model/recordLabelModel';

export default class RecordLabelService {
  buildFestivalModel(festivalJSON: [IFestivalAPIResponse]): Map<string, FestivalModel> {
    const festivalMap = new Map<string, FestivalModel>();
    festivalJSON.forEach(festival => {
      const festivalName = festival.name || '';
      if (!festivalMap.has(festivalName)) {
        festivalMap.set(festivalName, new FestivalModel(festivalName));
      }
      festival.bands.forEach(band => {
        festivalMap.get(festivalName)?.addBand(band.name, band.recordLabel);
      });
    });
    return festivalMap;
  }

  buildRecordLabelModel(festivalMap: Map<string, FestivalModel>) {
    const recordLabelMap = new Map<string, RecordLabelModel>();
    festivalMap.forEach(festival => {
      festival.bands.forEach((recordLabels, bandName) => {
        recordLabels.forEach(recordLabel => {
          if (recordLabel) {
            const band = new BandModel(bandName);
            if (festival.name) {
              band.addFestival(festival.name);
            }

            if (recordLabelMap.has(recordLabel)) {
              recordLabelMap.get(recordLabel)?.addBand(band);
            } else {
              const recordLabelModel = new RecordLabelModel(recordLabel);
              recordLabelModel.addBand(band);
              recordLabelMap.set(recordLabel, recordLabelModel);
            }
          }
        });
      });
    });
    return new Map(Array.from(recordLabelMap).sort());
  }
}

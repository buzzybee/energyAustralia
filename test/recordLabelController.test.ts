import RecordLabelController from '../src/recordLabelController';
import * as FestivalsApiService from '../src/api/festivalsApiService';

let recordLabelController: RecordLabelController;

describe('RecordLabelController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    recordLabelController = new RecordLabelController();
  });

  it('can call service to build model', async () => {
    const mock = jest.spyOn(FestivalsApiService, 'getData');
    const data = [
      {
        name: 'Trainerella',
        bands: [
          {
            name: 'Wild Antelope',
            recordLabel: 'Still Bottom Records'
          }
        ]
      }
    ];
    mock.mockResolvedValue(Promise.resolve(data));
    await recordLabelController.click();
    expect(mock).toBeCalled();
    expect(recordLabelController.recordLabels.size).toBe(1);
  });

  it('can get a string result once model is built', async () => {
    const mock = jest.spyOn(FestivalsApiService, 'getData');
    const data = [
      {
        name: 'Trainerella',
        bands: [
          {
            name: 'Wild Antelope',
            recordLabel: 'Still Bottom Records'
          }
        ]
      }
    ];
    mock.mockResolvedValue(Promise.resolve(data));
    await recordLabelController.click();
    expect(recordLabelController.getResult()).toBe(
      "Record Label 'Still Bottom Records'\n" +
        "\tBand 'Wild Antelope'\n" +
        "\t\t'Trainerella' Festival"
    );
  });
});

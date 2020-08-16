import * as FestivalsApiService from '../src/api/festivalsApiService';
import RecordLabelService from '../src/service/recordLabelService';
import FestivalModel from '../src/model/festivalModel';

let recordLabelService: RecordLabelService;

describe('RecordLabelService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    recordLabelService = new RecordLabelService();
  });

  it('can construct festival model using API JSON', async () => {
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
    const festivalJSONData = await FestivalsApiService.getData();

    const output: Map<string, FestivalModel> = recordLabelService.buildFestivalModel(
      festivalJSONData
    );
    output.forEach((festivalModel, name) => {
      const bands = festivalModel.bands;
      expect(name).toBe('Trainerella');
      bands.forEach((recordLabels, bandName) => {
        expect(bandName).toBe('Wild Antelope');
        expect(recordLabels.length).toBe(1);
        expect(recordLabels[0]).toBe('Still Bottom Records');
      });
    });
  });

  it('can construct recordLabel model using festival model', async () => {
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
    const festivalJSONData = await FestivalsApiService.getData();
    const festivalMap: Map<string, FestivalModel> = recordLabelService.buildFestivalModel(
      festivalJSONData
    );
    const output = recordLabelService.buildRecordLabelModel(festivalMap);
    expect(output.size).toBe(1);
    output.forEach(recordLabelModel => {
      const bands = recordLabelModel.bands;
      bands.forEach(bandModel => {
        expect(bandModel.bandName).toBe('Wild Antelope');
        expect(bandModel.festivals.length).toBe(1);
        expect(bandModel.festivals[0]).toEqual({ name: 'Trainerella' });
      });
    });
  });

  it('can construct record label model when bands have no festival', async () => {
    const mock = jest.spyOn(FestivalsApiService, 'getData');
    const data = [
      {
        bands: [
          {
            name: 'Propeller',
            recordLabel: 'Pacific Records'
          },
          {
            name: 'Critter Girls',
            recordLabel: 'ACR'
          }
        ]
      }
    ];
    mock.mockResolvedValue(Promise.resolve(data));
    const festivalJSONData = await FestivalsApiService.getData();
    const festivalMap: Map<string, FestivalModel> = recordLabelService.buildFestivalModel(
      festivalJSONData
    );
    const output = recordLabelService.buildRecordLabelModel(festivalMap);
    expect(output.size).toBe(2);
    const firstLabel = output.get('ACR');
    expect(firstLabel).toBeTruthy();
    expect(firstLabel?.recordLabel).toBe('ACR');
    expect(firstLabel?.bands[0].bandName).toBe('Critter Girls');
    expect(firstLabel?.bands[0].festivals.length).toBe(0);

    const secondLabel = output.get('Pacific Records');
    expect(secondLabel).toBeTruthy();
    expect(secondLabel?.recordLabel).toBe('Pacific Records');
    expect(secondLabel?.bands.length).toBe(1);
    expect(secondLabel?.bands[0].bandName).toBe('Propeller');
    expect(secondLabel?.bands[0].festivals.length).toBe(0);
  });

  it('can skip unsigned bands', async () => {
    const mock = jest.spyOn(FestivalsApiService, 'getData');
    const data = [
      {
        name: 'LOL-palooza',
        bands: [
          {
            name: 'Winter Primates',
            recordLabel: ''
          },
          {
            name: 'Werewolf Weekday',
            recordLabel: 'XS Recordings'
          }
        ]
      }
    ];
    mock.mockResolvedValue(Promise.resolve(data));
    const festivalJSONData = await FestivalsApiService.getData();
    const festivalMap: Map<string, FestivalModel> = recordLabelService.buildFestivalModel(
      festivalJSONData
    );
    const output = recordLabelService.buildRecordLabelModel(festivalMap);
    expect(output.size).toBe(1);

    const firstLabel = output.get('XS Recordings');
    expect(firstLabel).toBeTruthy();
    expect(firstLabel?.recordLabel).toBe('XS Recordings');
    expect(firstLabel?.bands.length).toBe(1);
    expect(firstLabel?.bands[0].bandName).toBe('Werewolf Weekday');
    expect(firstLabel?.bands[0].festivals.length).toBe(1);
    expect(firstLabel?.bands[0].festivals[0]).toEqual({ name: 'LOL-palooza' });
  });

  it('can support the same band at a festival with a different recording label', async () => {
    const mock = jest.spyOn(FestivalsApiService, 'getData');
    const data = [
      {
        name: 'LOL-palooza',
        bands: [
          {
            name: 'Winter Primates',
            recordLabel: 'ACE Records'
          },
          {
            name: 'Winter Primates',
            recordLabel: 'XS Recordings'
          }
        ]
      }
    ];
    mock.mockResolvedValue(Promise.resolve(data));
    const festivalJSONData = await FestivalsApiService.getData();
    const festivalMap: Map<string, FestivalModel> = recordLabelService.buildFestivalModel(
      festivalJSONData
    );
    const output = recordLabelService.buildRecordLabelModel(festivalMap);
    const outString = Array.from(output.values())
      .map(m => m.asString())
      .join('\n');
    expect(outString).toBe(
      "Record Label 'ACE Records'\n" +
        "\tBand 'Winter Primates'\n" +
        "\t\t'LOL-palooza' Festival\n" +
        "Record Label 'XS Recordings'\n" +
        "\tBand 'Winter Primates'\n" +
        "\t\t'LOL-palooza' Festival"
    );
  });

  it('recordLabel model outputs in sorted order', async () => {
    const mock = jest.spyOn(FestivalsApiService, 'getData');
    const data = [
      {
        name: 'LOL-palooza',
        bands: [
          {
            name: 'Zulu',
            recordLabel: 'Apple Records'
          },
          {
            name: 'Bahaa',
            recordLabel: 'XS Recordings'
          }
        ]
      },
      {
        name: 'Band in the sun',
        bands: [
          {
            name: 'Yazoo',
            recordLabel: 'Banana Records'
          },
          {
            name: 'Abba',
            recordLabel: 'XS Recordings'
          }
        ]
      }
    ];
    mock.mockResolvedValue(Promise.resolve(data));
    const festivalJSONData = await FestivalsApiService.getData();
    const festivalMap: Map<string, FestivalModel> = recordLabelService.buildFestivalModel(
      festivalJSONData
    );
    const output = recordLabelService.buildRecordLabelModel(festivalMap);
    const outString = Array.from(output.values())
      .map(m => m.asString())
      .join('\n');
    expect(outString).toBe(
      "Record Label 'Apple Records'\n" +
        "\tBand 'Zulu'\n" +
        "\t\t'LOL-palooza' Festival\n" +
        "Record Label 'Banana Records'\n" +
        "\tBand 'Yazoo'\n" +
        "\t\t'Band in the sun' Festival\n" +
        "Record Label 'XS Recordings'\n" +
        "\tBand 'Abba'\n" +
        "\t\t'Band in the sun' Festival\n" +
        "\tBand 'Bahaa'\n" +
        "\t\t'LOL-palooza' Festival"
    );
  });
});

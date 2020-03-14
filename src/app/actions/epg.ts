import {
  FETCH_ACTION_TYPE,
  IFetchAction,
  IFetchRequest,
  IFetchSuccess,
  IFetchFailure,
} from '../middleware/fetch';

const BASE_URL = 'https://freeviewweb.azurewebsites.net/umbraco/Surface/JsonString';

export const EPG_CONFIG_REQUEST = 'EPG_CONFIG_REQUEST';
export const EPG_CONFIG_SUCCESS = 'EPG_CONFIG_SUCCESS';
export const EPG_CONFIG_FAILURE = 'EPG_CONFIG_FAILURE';

export interface IEpgConfigJson {
  configXLSX: {
    services: {
      dvb: string[];
      lcn: string[];
      logo: string[];
    };
  };
}

export type IGetEpgConfigFetchAction = IFetchAction<'EPG_CONFIG_REQUEST', 'EPG_CONFIG_SUCCESS', 'EPG_CONFIG_FAILURE'>;
export type IGetEpgConfigRequestAction = IFetchRequest<'EPG_CONFIG_REQUEST'>;
export type IGetEpgConfigSuccessAction = IFetchSuccess<'EPG_CONFIG_SUCCESS', IEpgConfigJson>;
export type IGetEpgConfigFailureAction = IFetchFailure<'EPG_CONFIG_FAILURE'>;

export function getEpgConfig(): IGetEpgConfigFetchAction {
  return {
    type: FETCH_ACTION_TYPE,
    types: [EPG_CONFIG_REQUEST, EPG_CONFIG_SUCCESS, EPG_CONFIG_FAILURE],
    endpoint: {
      url: `${BASE_URL}/GetServiceConfigFile/`,
      query: {
        state: 'Sydney',
      },
      headers: {
        Accept: 'application/json',
      },
    },
  };
}

export const EPG_DATA_REQUEST = 'EPG_DATA_REQUEST';
export const EPG_DATA_SUCCESS = 'EPG_DATA_SUCCESS';
export const EPG_DATA_FAILURE = 'EPG_DATA_FAILURE';

export interface IEpgProgrammeJson {
  programme: {
    "@genre": string;
    "@subgenre": string;
    "@classification": string;
    "@program_type": string;
    title: string;
    synopsis: string;
    program_id: string;
    event_id: string;
    crid: {
      "@crid_type": string;
      "@crid_value": string;
    };
    date_time_duration: {
      "@date_time_value": string;
      "@duration": string;
    };
    series: {
      title: string;
      episode_title: string;
      synopsis: string;
      crid: {
        "@crid_type": string;
        "@crid_value": string;
      };
    };
    media: {
      filename: string;
      url: string;
      timestamp: string;
    };
    highlight: {
      "@dont_miss": string;
      "@coming_up": string;
      "@catch_up": string;
    };
    blackout: string;
    catch_up: {
      link: {
        "@type": string;
      };
    };
    "cast": string;
  };
}

export interface IEpgServiceJson {
  service: {
    '@service_name': string;
    '@network_name': string;
    '@default_authority': string;
    '@service_group': string;
    '@hww_id': string;
    '@affiliate_id': string;
    '@service_type': string;
    '@LCN': string;
    '@Logo': string;
    schedule: IEpgProgrammeJson[];
  };
}

export interface IEpgDataJson {
  TVGuide: IEpgServiceJson[];
}

export interface IGetEpgDataActionParams {
  index: number;
}

export type IGetEpgDataFetchAction = IFetchAction<'EPG_DATA_REQUEST', 'EPG_DATA_SUCCESS', 'EPG_DATA_FAILURE', IGetEpgDataActionParams>;
export type IGetEpgDataRequestAction = IFetchRequest<'EPG_DATA_REQUEST', IGetEpgDataActionParams>;
export type IGetEpgDataSuccessAction = IFetchSuccess<'EPG_DATA_SUCCESS', IEpgDataJson, IGetEpgDataActionParams>;
export type IGetEpgDataFailureAction = IFetchFailure<'EPG_DATA_FAILURE', IGetEpgDataActionParams>;

export function getEpgData(index: number = 0): IGetEpgDataFetchAction {
  return {
    type: FETCH_ACTION_TYPE,
    types: [EPG_DATA_REQUEST, EPG_DATA_SUCCESS, EPG_DATA_FAILURE],
    endpoint: {
      url: `${BASE_URL}/ReadFromTVGuideDB/`,
      query: {
        state: 'Sydney',
        param: 'tvGuide',
        index,
      },
      headers: {
        Accept: 'application/json',
      },
    },
    index,
  };
}

export type IEpgFetchActions = IGetEpgConfigFetchAction | IGetEpgDataFetchAction;
export type IEpgActions = IGetEpgConfigRequestAction
  | IGetEpgConfigSuccessAction
  | IGetEpgConfigFailureAction
  | IGetEpgDataRequestAction
  | IGetEpgDataSuccessAction
  | IGetEpgDataFailureAction;

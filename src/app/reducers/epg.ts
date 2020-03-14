import {
  EPG_CONFIG_REQUEST,
  EPG_CONFIG_SUCCESS,
  EPG_CONFIG_FAILURE,
  EPG_DATA_REQUEST,
  EPG_DATA_SUCCESS,
  EPG_DATA_FAILURE,
  IEpgServiceJson,
} from '../actions/epg';
import { AllActions } from '../actions';
import { fromHex, zfill } from '../lib/math';

export interface IEpgState {
  config: {
    isLoading: boolean;
    isLoaded: boolean;
    isError: boolean;
    dvb: string[];
    lcn: number[];
  };
  data: {
    [index: number]: {
      isLoading: boolean;
      isLoaded: boolean;
      isError: boolean;
      services: IEpgServiceJson[];
    };
  };
}

const initialState: IEpgState = {
  config: {
    isLoading: false,
    isLoaded: false,
    isError: false,
    dvb: [],
    lcn: [],
  },
  data: {},
};

export default function epg(state: IEpgState = initialState, action: AllActions): IEpgState {
  console.log('epg reducer', action);
  switch (action.type) {
    case EPG_CONFIG_REQUEST:
      return {
        ...state,
        config: {
          ...state.config,
          isLoading: true,
          isError: false,
        },
      };

    case EPG_CONFIG_SUCCESS:
      return {
        ...state,
        config: {
          ...state.config,
          isLoading: false,
          isLoaded: true,
          isError: false,
          dvb: action.response.configXLSX.services.dvb.map((triplet) => {
            const [onid,, sid] = triplet.split('.');
            return `${zfill(fromHex(onid), 4)}::${zfill(fromHex(sid), 4)}`;
          }),
          lcn: action.response.configXLSX.services.lcn.map((lcn) => parseInt(lcn, 10)),
        },
      };

    case EPG_CONFIG_FAILURE:
      return {
        ...state,
        config: {
          ...state.config,
          isLoading: false,
          isError: true,
        },
      };

    case EPG_DATA_REQUEST:
      return {
        ...state,
        data: {
          ...state.data,
          [action.index]: {
            ...state.data[action.index],
            isLoading: true,
            isError: false,
          },
        },
      };

    case EPG_DATA_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.index]: {
            ...state.data[action.index],
            isLoading: false,
            isLoaded: true,
            isError: false,
            services: action.response.TVGuide,
          },
        },
      };

    case EPG_DATA_FAILURE:
      return {
        ...state,
        data: {
          ...state.data,
          [action.index]: {
            ...state.data[action.index],
            isLoading: false,
            isError: true,
          },
        },
      };

    default:
      return state;
  }
}

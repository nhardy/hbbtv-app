import { get } from 'lodash-es';
import React from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { IReduxStore } from '../../redux/createStore';
import { IReduxState } from '../../reducers';
import { getEpgConfig, getEpgData, IEpgServiceJson } from '../../actions/epg';
import { setRouteError } from '../../actions/routeError';

interface IProps {
  services: IEpgServiceJson[],
}

const Index = ({ services }: IProps) => (
  <div>{get(services, [0, 'service', '@Logo'])}</div>
);

export default asyncConnect([
  {
    promise: async ({ store: { dispatch, getState } }: { store: IReduxStore }) => {
      const isLoaded = () => {
        const state = getState().epg;
        return state.config.isLoaded && get(state.data, [0, 'isLoaded'], false);
      };
      if (!isLoaded) await Promise.all([
        dispatch(getEpgConfig()),
        dispatch(getEpgData(0)),
      ]);
      console.log('state', getState());
      if (!isLoaded) dispatch(setRouteError({ status: 500 }));
    },
  },
], (state: IReduxState) => ({
  services: get(state, ['epg', 'data', 0, 'services']),
}))(Index);

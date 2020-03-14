import { IHbbtvActions } from "./hbbtv";
import { IRouteErrorAction } from "./routeError";
import { IEpgFetchActions, IEpgActions } from "./epg";

export type AllFetchActions = IEpgFetchActions;
export type AllActions = AllFetchActions | IHbbtvActions | IRouteErrorAction | IEpgActions;

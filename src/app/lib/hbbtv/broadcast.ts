import { find, range } from 'lodash-es';
import { fromHex, toHex, zfill } from '../math';

let broadcast: OIPF.VideoBroadcastObject | null = null;

export default broadcast;

export enum PlayState {
  UNREALIZED = 0,
  CONNECTING = 1,
  PRESENTING = 2,
  STOPPED = 3,
}

export enum PlayStateError {
  /**
   * channel not supported by tuner
   */
  NOT_SUPPORTED = 0,
  /**
   * cannot tune to given transport stream (e.g. no signal)
   */
  CANNOT_TUNE = 1,
  /**
   * tuner locked by other object
   */
  TUNER_LOCKED = 2,
  /**
   * parental lock on channel
   */
  PARENTAL_LOCK = 3,
  /**
   * encrypted channel, key / module missing
   */
  ENCRYPTED_CHANNEL = 4,
  /**
   * unknown channel (e.g. can’t resolve DVB or ISDB triplet)
   */
  UNKNOWN_CHANNEL = 5,
  /**
   * channel switch interrupted (e.g. because another channel switch was activated before
   * the previous one completed)
   */
  SWITCH_INTERRUPTED = 6,
  /**
   * channel cannot be changed, because it is currently being recorded
   */
  CURRENTLY_RECORDING = 7,
  /**
   * cannot resolve URI of referenced IP channel
   */
  CANNOT_RESOLVE_URL = 8,
  /**
   * insufficient bandwidth
   */
  INSUFFICIENT_BANDWIDTH = 9,
  /**
   * channel cannot be changed by nextChannel() / prevChannel() methods either
   * because the OITF does not maintain a favourites or channel list or because the
   * video / broadcast object is in the Unrealized state
   */
  NO_CHANNEL_LIST = 10,
  /**
   * insufficient resources are available to present the given channel (e.g. a lack of
   * available codec resources)
   */
  INSUFFICIENT_RESOURCES = 11,
  /**
   * specified channel not found in transport stream
   */
  CHANNEL_NOT_FOUND = 12,
  /**
   * unidentified error
   */
  UNINDENTIFIED_ERROR = 100,
}

export function setBroadcastRef(ref: OIPF.VideoBroadcastObject) {
  broadcast = ref;
}

export function getPlayState(): PlayState {
  return broadcast!.playState;
}

export function getChannelList(): OIPF.Channel[] {
  const { channelList } = broadcast!.getChannelConfig();
  return range(0, channelList.length)
    .map((i) => channelList.item(i));
}

/**
 * Returns the numeric ONID and SID for a given DVB triplet
 * @param dvbTriplet hexadecimal DVB triplet colon-separated (i.e. ONID:TSID:SID)
 * @returns {[number, number]} [onid, sid]
 */
export function getOnidSid(dvbTriplet: string): [number, number] {
  const [onid,, sid] = dvbTriplet.split(':');
  return [onid, sid].map(fromHex) as [number, number];
}

export function getChannelByDvbTriplet(dvbTriplet: string): OIPF.Channel | null {
  const [onid, sid] = getOnidSid(dvbTriplet);
  return find(getChannelList(), { onid, sid }) || null;
}

export function setChannelByDvbTriplet(dvbTriplet: string) {
  broadcast!.setChannel(getChannelByDvbTriplet(dvbTriplet)!);
}

export function getDvbTriplet(channel: OIPF.Channel = broadcast!.getChannelConfig().currentChannel): string {
  const { onid, sid } = channel;
  return `${zfill(toHex(onid), 4)}::${zfill(toHex(sid), 4)}`;
}

declare namespace OIPF {
  interface Collection<T> extends ArrayLike<T> {
    item(index: number): T;
  }

  interface ChannelList extends Collection<OIPF.Channel> {
    /**
     * The Channel List is located here in the Firefox FireHbbTV plugin
     */
    _list?: OIPF.Channel[];
  }

  interface ChannelConfig {
    readonly channelList: OIPF.ChannelList;
    readonly currentChannel: OIPF.Channel;
  }
}

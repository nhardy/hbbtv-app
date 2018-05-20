import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onPlayStateChange } from '../../actions/hbbtv/broadcast';
import { setBroadcastRef } from '../../lib/hbbtv/broadcast';

interface IProps {
  onPlayStateChange: typeof onPlayStateChange;
}

class VideoBroacast extends Component<IProps, {}> {
  public render() {
    return (
      <div>
        <object type="video/broadcast" height="100%" width="100%" ref={this.setRef} />
      </div>
    );
  }

  private setRef = (ref: OIPF.VideoBroadcastObject) => {
    setBroadcastRef(ref);
    ref.onPlayStateChange = this.props.onPlayStateChange;
  }
}

export default connect(null, { onPlayStateChange })(VideoBroacast);

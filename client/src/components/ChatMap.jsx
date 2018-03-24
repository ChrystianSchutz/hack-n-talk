import React from 'react';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';

const ChatMapBase = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px`, width: `70%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={13}
    defaultCenter={{ lat: 51.107883, lng: 17.038538 }}
  >
    {props.isMarkerShown && (
      <Marker
        position={{ lat: 51.107883, lng: 17.038538 }}
        onClick={props.onMarkerClick}
      />
    )}
  </GoogleMap>
));

export default class ChatMap extends React.PureComponent {
  state = {
    isMarkerShown: false
  };

  componentDidMount() {
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    this.setState({ isMarkerShown: true });
  };

  showLiveChat = () => {
    /* eslint-disable */
    window.__lc = window.__lc || {};
    window.__lc.license = 9616670;
    (function() {
      var lc = document.createElement('script');
      lc.type = 'text/javascript';
      lc.async = true;
      lc.src =
        ('https:' == document.location.protocol ? 'https://' : 'http://') +
        'cdn.livechatinc.com/tracking.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(lc, s);
    })();

    setTimeout(function() {
      parent.LC_API.open_chat_window({ source: 'minimized' });
    }, 1000);
  };

  handleMarkerClick = () => {
    this.showLiveChat();
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
  };

  render() {
    return (
      <ChatMapBase
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    );
  }
}

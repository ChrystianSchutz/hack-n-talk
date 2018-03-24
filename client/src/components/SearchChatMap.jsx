import React from 'react';

const _ = require('lodash');
const { compose, withProps, lifecycle } = require('recompose');
const { withScriptjs, withGoogleMap, GoogleMap } = require('react-google-maps');
const {
  SearchBox
} = require('react-google-maps/lib/components/places/SearchBox');
const {
  MarkerWithLabel
} = require('react-google-maps/lib/components/addons/MarkerWithLabel');

const supportedIcons = ['sushi', 'burger', 'chinese', 'pizza', 'fastfood'];

const getLocation = onGeoLocationLoaded => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onGeoLocationLoaded);
  } else {
    alert('No geolocation support');
  }
};

const showLiveChat = (license) => {
  /* eslint-disable */
  window.__lc = window.__lc || {};
  window.__lc.license = license;
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

const SearchChatMap = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyA0Bqc3sHPL5KC4J3d_PmgwyTGV09_2ZWs&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px`, width: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};
      const location = window.location.pathname;
      let x = 51.107883;
      let y =  17.038538;
      if(location == '/'){
        showLiveChat(9616670);
      }

      this.setState({
        searchValue: '',
        bounds: null,
        center: {
          lat: 51.107885,
          lng: 17.038538
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
          getLocation(position => {
            setTimeout(
              this.setState({
                center: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
              }),
              100
            );
          });
        },
        onBoundsChanged: _.debounce(() => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter()
          });
        }, 500),
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds(); //eslint-disable-line

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
            name: place.name,
            category: this.state.searchValue
          }));
          const nextCenter = _.get(
            nextMarkers,
            '0.position',
            this.state.center
          );

          this.setState({
            center: nextCenter,
            markers: nextMarkers
          });
        },
        onMarkerClick: marker => {
          
          console.log(marker.name);
          if(location == '/'){
            window.location = ` ${window.location.href}/${marker.name}`;
          }else{
                        showLiveChat(9617260);
          }
         
        },
        onInputChange: event => {
          this.setState({
            searchValue: event.target.value
          });
        }
      });
    },
    componentDidMount(){
      setTimeout( () =>{
        var input = document.getElementById("searchbar")
        google.maps.event.trigger( input, 'focus')
        google.maps.event.trigger( input, 'keydown', {keyCode:13})
      },1500)     
      setTimeout( () =>{
        var input = document.getElementById("searchbar")
        google.maps.event.trigger( input, 'keydown', {keyCode:13})
      },2000)     

    }
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT} //eslint-disable-line
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        defaultValue={ decodeURIComponent(window.location.pathname).replace('/', '') }
        id="searchbar"
        placeholder="What would you like to eat?"
        onChange={props.onInputChange}
        onInput={props.onInputChange}
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) => {
      const found = supportedIcons.find(i => props.searchValue.includes(i) || window.location.pathname.replace('/', '').includes(i));
      const icon = Boolean(found)
        ? `../icons/${found}.png`
        : undefined;
      return (
        <MarkerWithLabel
          key={index}
          position={marker.position}
          onClick={() => props.onMarkerClick(marker)}
          icon={icon}
          size={new google.maps.Size(16, 16)}
          labelAnchor={new google.maps.Point(-16, 32)}
          labelStyle={{
            backgroundColor: '#FFFACD',
            fontSize: '10px',
            padding: '5px',
            borderRadius: '5px'
          }}
        >
          <span>{marker.name}</span>
        </MarkerWithLabel>
      );
    })}
  </GoogleMap>
));

export default SearchChatMap;

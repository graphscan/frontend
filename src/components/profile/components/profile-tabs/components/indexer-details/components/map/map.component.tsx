import ReactMapGL, { Marker } from "react-map-gl";

type Props = {
  location: {
    latitude: number;
    longitude: number;
  } | null;
};

export const Map: React.FC<Props> = ({ location }) => {
  return (
    <ReactMapGL
      mapboxAccessToken={
        "pk.eyJ1Ijoid2FyZm9sbG93c21lIiwiYSI6ImNrbXEzcWY1cDE3YXkybnBlejI3cXl0cGkifQ.XUO-CXeck4wvE3vEOahl-g"
      }
      mapStyle="mapbox://styles/warfollowsme/ckohlpu2b0xhz17p9uu5y04vz"
      style={{ width: "100%", height: "100%" }}
      initialViewState={{
        longitude: location?.longitude,
        latitude: location?.latitude,
        zoom: location ? 10 : 0,
      }}
    >
      {location && (
        <Marker latitude={location.latitude} longitude={location.longitude}>
          <img
            style={{ pointerEvents: "none" }}
            src="/images/map-marker.svg"
            alt="Map Marker"
          />
        </Marker>
      )}
    </ReactMapGL>
  );
};

import React, { useState, useEffect } from "react";

const initialLocation = {
  latitude: null,
  longitude: null,
  speed: null
};

const App = () => {
  // -- STATE --
  const [sample, setSample] = useState(0);
  const [next, setNext] = useState(0);
  const [position, setPosition] = useState({ x: null, y: null });
  const [online, setOnline] = useState(navigator);
  const [{ latitude, longitude, speed }, setLocation] = useState(
    initialLocation
  );

  // -- LIFECYCLE --
  useEffect(() => {
    // tracker for unclean api's, to prevent memory leaks
    let mounted = true;
    // -- effect handlers
    const handleMouseMove = e => {
      setPosition({ x: e.pageX, y: e.pageY });
    };
    const handleGeoLocation = e => {
      if (mounted) {
        setLocation({
          latitude: e.coords.latitude,
          longitude: e.coords.longitude,
          speed: e.coords.speed
        });
      }
    };
    // -- effects
    setNext(sample + 1);
    document.title = `Ping Total: ${sample}`;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
    navigator.geolocation.getCurrentPosition(handleGeoLocation); // dirty api
    const watchId = navigator.geolocation.watchPosition(handleGeoLocation);
    // effect cleanup
    return () => {
      mounted = false;
      window.removeEventListener("mousemove", handleMouseMove, true);
      window.removeEventListener("online", setOnline(true), true);
      window.removeEventListener("offline", setOnline(false), true);
      navigator.geolocation.clearWatch(watchId);
    };
  }, [sample]);

  // -- RENDER --
  return (
    <div>
      <h1>React Tracker</h1>
      <button type="button" onClick={() => setSample(sample + 1)}>
        Increment Hook State
      </button>
      <p>{`Sample: ${sample}`}</p>
      {`Next: ${next}`}

      <hr />
      <h2>Mouse Position</h2>
      <p>{`X Position: ${position.x || 0}`}</p>
      <p>{`Y Position: ${position.y || 0}`}</p>

      <hr />
      <h2>Online Status</h2>
      <p>
        User Status:
        {online ? " Online" : " Offline"}
      </p>

      <hr />
      <h2>GEOLOCATION</h2>
      <p>{`Latitude: ${latitude ||
        "Unavailable, enable position services"}`}</p>
      <p>{`Longitude: ${longitude ||
        "Unavailable, enable position services"}`}</p>
      <p>{`Speed: ${speed || 0}`}</p>
    </div>
  );
};

export default App;

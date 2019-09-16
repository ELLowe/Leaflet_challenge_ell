function createMap(EarthquakeMarkersLayer){
    console.log(EarthquakeMarkersLayer);
  
    // Create a baseMaps object to hold the lightmap and darkmap layer
    // Define variables for our tile layers
    const light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    });
  
    const dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
    });
  
    // Only one base layer can be shown at a time
    const baseMaps = {
    Light: light,
    Dark: dark
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    // Overlays that may be toggled on or off
    const overlayMaps = {
    Earthquakes: EarthquakeMarkersLayer
    };
  
    // Create the map object with options
     // Creating map object
     const myMap = L.map("map", {
      center: [39.8283, -98.5795],
      zoom: 4,
      layers: [light, EarthquakeMarkersLayer]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
  }
  
  // Create the createMarkers function
  function createMarkers(response){
    console.log('["createMarkers"] response: ', response);
    // Pull the "stations" property off of response.data
    let features = response.features;
    console.log(features);
  
    // Initialize an array to hold bike markers
    let earthquakeMarkers = [];
  
    // Loop through the stations array
    // for (var i = 0; i < stations.length, i++){
    features.forEach(feature => {
      // For each earthquake, create a marker and bind a popup with the earthquake's "place"
      let earthquakeMarker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]).bindPopup(feature.properties.place);
      // Add the marker to the earthquakeMarkers array
      earthquakeMarkers.push(earthquakeMarker);
    });
    // Create a layer group made from the bike markers array, pass it into the createMap function
    let markersLayer = L.layerGroup(earthquakeMarkers);
    createMap(markersLayer);
  }
    
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  // clear method:
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
  d3.json(url, createMarkers);
  
  // old method:
  // d3.json('https://gbfs.citibikenyc.com/gbfs/en/station_information.json',(response) => {
  //   createMarkers(response);
  // });
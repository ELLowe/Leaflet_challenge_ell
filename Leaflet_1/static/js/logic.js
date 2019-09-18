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

    // LEGEND NEEDS WORK!
    function getColor(d) {
        return d >= 8.0 ? '#ff0000' :
            d >= 7.0  ? '#ff8000' :
            d >= 6.0  ? '#e6b800' :
            d >= 5.4  ? '#00b300' :
            d >= 2.5  ? '#0033cc' :
                        '#663399' ;
    }

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 2.5, 5.4, 6.9, 7.9, 8.0],
        labels = ["2.5 or less", "2.5-5.4", "5.5-6.0","6.1-6.9","7.0-7.9","8.0 or more"];

        // loop through the density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<div style="background-color:' + getColor(grades[i]) + '"> ' +
                labels[i] + '</div>';
        }

        return div;
    };

    legend.addTo(myMap);
}

// Create the createMarkers function
function createMarkers(response){
    console.log('["createMarkers"] response: ', response);
    // Pull the earthquakes & properties off of response.features
    let features = response.features;
    console.log(features);
  
    // Initialize an array to hold earthquake markers
    let earthquakeMarkers = [];

    // Loop through the earthquakes array and create a circle marker for each earthquake object
    features.forEach((feature) => {
        // Conditionals for earthquake effects by magnitude
        let color = "";
        let nature ="";
        let magnitude = feature.properties.mag;
        if (magnitude < (2.5)) {
            color = "#663399";
            nature = "Usually not felt, but can be recorded by seismograph.";
        }
        else if (feature.properties.mag < 5.4) {
            color = "#0033cc";
            nature = "Often felt, but only causes minor damage.";
        }
        else if (feature.properties.mag < 6.0) {
            color = "#00b300";
            nature = "Slight damage to buildings and other structures.";
        }
        else if (feature.properties.mag < 6.9) {
            color = "#e6b800";
            nature = "May cause a lot of damage in very populated areas.";
        }
        else if (feature.properties.mag < 7.9) {
            color = "#ff8000";
            nature = "Major earthquake. Serious damage.";
        }
        else {
            color = "#ff0000";
            nature = "Great earthquake. Can totally destroy communities near the epicenter";
        }
    
    // Add circles to the array
    let earthquakeMarker =
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        fillOpacity: 0.85,
        color: "black",
        fillColor: color,
        weight: 1,
        // Adjust radius
        radius: feature.properties.mag * 9000
        }).bindPopup(`<h1>${feature.properties.place}</h1> <hr> <h3>Magnitude: ${feature.properties.mag}</h3> <hr> <p>${nature} </p>`);
        earthquakeMarkers.push(earthquakeMarker);
    
    });

    // Create a layer group made from the earthquakeMarkers array, pass it into the createMap function
    let markersLayer = L.layerGroup(earthquakeMarkers);
    createMap(markersLayer);
}


    
// Perform an API call to the USGS API to get earthquake information. Call createMarkers when complete:
//   const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
const url ='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
//   const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';
d3.json(url, createMarkers);
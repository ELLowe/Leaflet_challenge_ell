function createMap(EarthquakeMarkersLayer){
    console.log(EarthquakeMarkersLayer);
  
    // Created a baseMaps object to hold the lightmap and darkmap layer
    // Defined variables for tile layers
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
  
    // Create an overlayMaps object to hold the earthquake data layer
    // This creates overlays that may be toggled on or off
    const overlayMaps = {
    Earthquakes: EarthquakeMarkersLayer
    };
  
    // Created the map object with options
     // Map object is centered on the US
     const myMap = L.map("map", {
      center: [39.8283, -98.5795],
      zoom: 4,
      layers: [light, EarthquakeMarkersLayer]
    });
  
    // Created a layer control, pass in the baseMaps and overlayMaps. Added the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

    // Legend
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

        // loop through the density intervals and generate a colored label for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<div style="background-color:' + getColor(grades[i]) + '"> ' +
                labels[i] + '</div>';
        }

        return div;
    };

    legend.addTo(myMap);
}

// Created a createMarkers function to generate the circles
function createMarkers(response){
    console.log('["createMarkers"] response: ', response);
    // Pulled the earthquakes & properties off of response.features
    let features = response.features;
    console.log(features);
  
    // Initialized an array to hold earthquake markers
    let earthquakeMarkers = [];

    // Looped through the earthquakes array and create a circle marker for each earthquake object
    features.forEach((feature) => {
        // Conditionals for earthquake effects by magnitude:
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
    
    // Added circles to the array
    let earthquakeMarker =
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        fillOpacity: 0.85,
        color: "black",
        fillColor: color,
        weight: 1,
        // Adjusted radius according to magnitude and made popups
        radius: feature.properties.mag * 9000
        }).bindPopup(`<h1>${feature.properties.place}</h1> <hr> <h3>Magnitude: ${feature.properties.mag}</h3> <hr> <p>${nature} </p>`);
        earthquakeMarkers.push(earthquakeMarker);
    
    });

    // Created a layer group made from the earthquakeMarkers array, passed it into the createMap function for the overlay
    let markersLayer = L.layerGroup(earthquakeMarkers);
    createMap(markersLayer);
}


    
// Performed the API call to the USGS API to get earthquake information. Called createMarkers to start the process of building the map:
const url ='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
d3.json(url, createMarkers);
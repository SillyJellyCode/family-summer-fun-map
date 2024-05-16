// Initialize the map
var map = L.map('map').setView([42.984, -81.251], 12);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add markers or other features here


// Add GeoJSON data for parks
fetch('data/Parks.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<b>${feature.properties.name}</b><br>${feature.properties.description}`);
            }
        }).addTo(map);
    });

// Add GeoJSON data for park amenities
fetch('data/Park_Amenities.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<b>${feature.properties.name}</b><br>${feature.properties.type}`);
            }
        }).addTo(map);
    });

// Initialize the map
var map = L.map('map').setView([42.984, -81.251], 12);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var amenitiesLayer;

// Function to add GeoJSON data to the map
function addGeoJsonData(url, map, nameProperty, additionalProperty, isShape = false) {
    console.log(`Fetching GeoJSON data from: ${url}`);
    fetch(url)
        .then(response => {
            console.log(`Response status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Change to text() to log the raw response
        })
        .then(text => {
            console.log(`Raw response data from ${url}:`, text);
            return JSON.parse(text); // Parse the text response
        })
        .then(data => {
            console.log(`GeoJSON data loaded from ${url}:`, data);
            L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties[nameProperty]) {
                        let popupContent = `<b>${feature.properties[nameProperty]}</b>`;
                        if (feature.properties[additionalProperty]) {
                            popupContent += `<br>${feature.properties[additionalProperty]}`;
                        }
                        layer.bindPopup(popupContent);

                        if (isShape) {
                            // Add a label for park shapes
                            let label = L.divIcon({
                                className: 'label-class',
                                html: feature.properties[nameProperty],
                                iconSize: [100, 40] // Adjust size as needed
                            });
                            L.marker(layer.getBounds().getCenter(), { icon: label }).addTo(map);
                        }
                    }
                }
            }).addTo(map);
            console.log(`GeoJSON data added to the map from ${url}`);
        })
        .catch(error => {
            console.error(`Failed to load GeoJSON data from ${url}:`, error);
        });
}

// Add GeoJSON data for parks with labels
addGeoJsonData('data/Parks.geojson', map, 'GIS_FeatureKey', 'description', true);

// Function to filter amenities by type
function filterAmenities(type) {
    if (amenitiesLayer) {
        map.removeLayer(amenitiesLayer);
    }

    fetch('data/Park_Amenities.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            amenitiesLayer = L.geoJSON(data, {
                filter: function (feature) {
                    if (type === 'all') {
                        return true;
                    }
                    return feature.properties.type === type;
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        let popupContent = `<b>${feature.properties.name}</b>`;
                        if (feature.properties.type) {
                            popupContent += `<br>${feature.properties.type}`;
                        }
                        layer.bindPopup(popupContent);
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Failed to load amenities data:', error);
        });
}

// Initial load of all amenities
filterAmenities('all');

// Add event listener for the dropdown
document.getElementById('amenity-type').addEventListener('change', function () {
    const selectedType = this.value;
    filterAmenities(selectedType);
});

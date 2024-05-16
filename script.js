// Initialize map and tile layer
var map = L.map('map').setView([42.984, -81.251], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var amenitiesLayer; // Variable to hold the amenities layer

// Function to add GeoJSON data
function addGeoJsonData(url, map, nameProperty, additionalProperty, isShape = false) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties[nameProperty]) {
                        let popupContent = `<b>${feature.properties[nameProperty]}</b>`;
                        if (feature.properties[additionalProperty]) {
                            popupContent += `<br>${feature.properties[additionalProperty]}`;
                        }
                        layer.bindPopup(popupContent);

                        if (isShape) {
                            layer.on('mouseover', function () {
                                layer.openPopup();
                            });
                            layer.on('click', function () {
                                layer.openPopup();
                            });
                        }
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error(`Failed to load GeoJSON data from ${url}:`, error);
        });
}

// Function to filter amenities
function filterAmenities(type, owner) {
    if (amenitiesLayer) {
        map.removeLayer(amenitiesLayer); 
    }

    fetch('data/Park_Amenities.geojson')
        .then(response => response.json())
        .then(data => {
            amenitiesLayer = L.geoJSON(data, {
                filter: feature => 
                    (type === 'all' || feature.properties.Type.toLowerCase() === type.toLowerCase()) &&
                    (owner === 'all' || feature.properties.Owner.toLowerCase() === owner.toLowerCase()),

                pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                    radius: 5,
                    fillColor: "#3388ff", 
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }),

                onEachFeature: (feature, layer) => {
                    if (feature.properties && feature.properties.name) {
                        let popupContent = `<b>${feature.properties.name}</b><br>${feature.properties.Type}<br>${feature.properties.Owner}`;
                        layer.bindPopup(popupContent);
                    }
                }
            }).addTo(map);
        })
        .catch(error => console.error('Failed to load amenities data:', error));
}

// Add GeoJSON data for parks with labels
addGeoJsonData('data/Parks.geojson', map, 'GIS_FeatureKey', 'description', true);

// Initial load and event listeners 
filterAmenities('all', 'all');

document.getElementById('amenity-type').addEventListener('change', function () {
    const selectedType = this.value;
    const selectedOwner = document.getElementById('amenity-owner').value;
    filterAmenities(selectedType, selectedOwner);
});

document.getElementById('amenity-owner').addEventListener('change', function () {
    const selectedOwner = this.value;
    const selectedType = document.getElementById('amenity-type').value;
    filterAmenities(selectedType, selectedOwner);
});

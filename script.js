// JavaScript code
const sectorDropdown = document.getElementById('sector');
const neighbourDropdown = document.getElementById('neighbours');
const mapDiv = document.getElementById('map');
let map;

const sectorsData = {
    sector1: ["Sector 2", "Sector 3"],
    sector2: ["Sector 1", "Sector 3"],
    sector3: ["Sector 1", "Sector 2"],
};

function updateNeighbours() {
    const selectedSector = sectorDropdown.value;
    const neighbours = sectorsData[selectedSector];

    neighbourDropdown.innerHTML = "";

    neighbours.forEach(neighbour => {
        const option = document.createElement("option");
        option.text = neighbour;
        neighbourDropdown.add(option);
    });

    fetchGeoJSON(selectedSector);
}

sectorDropdown.addEventListener("change", updateNeighbours);

function fetchGeoJSON(selectedSector) {
    const geojsonUrl = 'https://example.com/sectors.geojson'; // Replace with your actual GeoJSON URL

    fetch(geojsonUrl)
        .then(response => response.json())
        .then(data => {
            const geojson = data;
            updateMap(selectedSector, geojson);
        })
        .catch(error => {
            console.error('Error fetching GeoJSON:', error);
        });
}

function updateMap(selectedSector, geojson) {
    // Clear previous layers on the map
    map.eachLayer(layer => {
        if (layer instanceof L.Polygon) {
            map.removeLayer(layer);
        }
    });

    const selectedSectorFeature = geojson.features.find(feature => feature.properties.name === selectedSector);
    if (selectedSectorFeature) {
        const coordinates = selectedSectorFeature.geometry.coordinates;
        const polygon = L.polygon(coordinates);
        map.addLayer(polygon);
        map.fitBounds(polygon.getBounds());
    }
}

// Initialize neighbours dropdown and map based on the default selected sector
updateNeighbours();

// Initialize the map
map = L.map(mapDiv).setView([0, 0], 1);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

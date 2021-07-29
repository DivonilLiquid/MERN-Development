/* eslint-disable */
// console.log('Hello from the server side :D');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);
mapboxgl.accessToken = 'pk.eyJ1IjoiZGl2b25pbGxpcXVpZCIsImEiOiJja3I0bWR4a2gwenpsMnZwZDV3NnBma2RxIn0._2GP32XGDLdQOEhx1x590g';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/divonilliquid/ckr4mycsi0m9o17mzv8ocxez5',
scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});

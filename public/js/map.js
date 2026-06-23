const initListingMap = () => {
  const mapElement = document.querySelector("#map");

  if (!mapElement || typeof L === "undefined") {
    return;
  }

  const listingLocation = mapElement.dataset.location;
  const listingTitle = mapElement.dataset.title || "Listing location";
  const defaultCoordinates = [20, 0];

  const map = L.map(mapElement, {
    scrollWheelZoom: false,
  }).setView(defaultCoordinates, 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const addMapNotice = (message) => {
    const notice = L.control({ position: "topright" });

    notice.onAdd = () => {
      const div = L.DomUtil.create("div", "map-notice");
      div.textContent = message;
      return div;
    };

    notice.addTo(map);
  };

  const buildPopupContent = () => {
    const wrapper = document.createElement("div");
    const title = document.createElement("strong");
    const location = document.createElement("div");

    title.textContent = listingTitle;
    location.textContent = listingLocation;
    wrapper.append(title, location);

    return wrapper;
  };

  if (!listingLocation) {
    addMapNotice("Location not available");
    return;
  }

  const params = new URLSearchParams({
    format: "json",
    limit: "1",
    q: listingLocation,
  });

  fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not find map location");
      }

      return response.json();
    })
    .then((places) => {
      if (!places.length) {
        addMapNotice("Location not found");
        return;
      }

      const coordinates = [Number(places[0].lat), Number(places[0].lon)];

      map.setView(coordinates, 13);
      L.marker(coordinates)
        .addTo(map)
        .bindPopup(buildPopupContent())
        .openPopup();
    })
    .catch(() => {
      addMapNotice("Map location could not load");
    });
};

initListingMap();

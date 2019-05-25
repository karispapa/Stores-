function autocomplete(input, latInput, lngInput){
  if(!input) return; // skip the fn from runing if no input on page
  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.latlng.lat();
    lngInput.value = place.geometry.location.latlng.lng();
     // latInput.value = e.latLng.lat();
      //lngInput.value = e.latLng.lng();
});

// if someone hits enter on the address field, dont submit the form
  input.on('keydown', (e) => {
    if (e.keycode === 13) e.preventDefault();
  });
}

export default autocomplete;
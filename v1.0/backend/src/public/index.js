function hideURLParams() {
    locationName = location.search.replace(/[^=&]+=(&|$)/g,"").replace(/&$/,"");            
    history.replaceState(null, document.getElementsByTagName("title")[0].innerHTML, locationName);
}
window.onload = hideURLParams;
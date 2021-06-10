function init() {
    var aus = [-25.48825925715691, 133.9317197973893];
    // Création de la map
    var map = L.map('mapid').setView(aus, 5);

    const mapLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWFuYWNoaCIsImEiOiJja21qZDhmOGswbGx5Mm5ta2lwOXdwdXlmIn0.plXsl8ucHBOmyLd43jbUHA'
    });

    mapLayer.addTo(map);

    // Création de l'icône kangourou
    var kangIcon = L.icon({
        iconUrl: 'kangaroo.png',
    
        iconSize:     [50, 50], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    var menuList = document.getElementById('menu-list');
    var listItem = document.getElementsByClassName('stepTitle');

    const fecthData = url => {
        return new Promise( (resolve, reject) => {
            // Get content from API with Fetch API (https://developer.mozilla.org/fr/docs/Web/API/Fetch_API)
            fetch(url)
            .then( response => {
                // Display response
                // console.log(response);
    
                // Check response
                return response.ok
                ? response.json()
                : reject('Fetch error', response);
            })
            .then( data => {
                // Display json data
                console.log(data);
    
                // Resolve Promise
                return resolve(data);
            })
            .catch( fetchError => {
                return reject(fetchError);
            });
        });
    };    

    const displayOnMap = data => {
        // Add every step in the menu
        for(i=0;i<data.features.length;i++) {
            menuList.innerHTML += `
                <li>
                    <h3 id="${i}" class="stepTitle">Step ${i+1} : ${data.features[i].properties.name}</h3>
                </li>
            `;
        }
        // Add every step to the map 
        for(i=0;i<data.features.length;i++){
            var coordinates = [data.features[i].geometry.lat, data.features[i].geometry.long];
            var step = L.marker(coordinates, {icon: kangIcon}).addTo(map);
            step.bindPopup("<h2 class='center'>Location : <span class='location'>"+data.features[i].properties.name+"</span></h2><br><h3>"+data.features[i].properties.popupContent+"</h3></br><img src='21.jpg'>");
        }
        // Add an id for every step img
        var itemsPoint = document.getElementsByClassName('leaflet-marker-icon');
        for(i=0;i<itemsPoint.length;i++) {
            itemsPoint[i].setAttribute('id', 'point'+[i]);
            itemsPoint[i].classList.add('step');
        }
        
        // Add the flyTo effect to each step
        for(i=0;i<listItem.length;i++) {
            listItem[i].addEventListener('click', function(event){
                map.flyTo([data.features[event.target.id].geometry.lat, data.features[event.target.id].geometry.long], 11);
            });
            // listItem[i].addEventListener('mouseenter', function(event){
            //     console.log('Vous survolez '+data.features[event.target.id].properties.name);
            //     console.log('point'+[event.target.id]);
            //     // var pointToSwitch = document.getElementById('point'+[event.target.id])
            //     // pointToSwitch.style.width = "150px";
            // })
        }

        // Add a line between following steps
        for(i=0;i<data.features.length;i++) {
            var polygon = L.polygon([
                [data.features[i].geometry.lat, data.features[i].geometry.long],
                [data.features[i+1].geometry.lat, data.features[i+1].geometry.long]
            ]).addTo(map);
        }
    }
    // CIRCLE
    var start = L.circle([-28.16667800406691, 153.51349599757995], {
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.5,
        radius: 1500
    }).addTo(map);


    fecthData('map-db.json')
    .then( data => displayOnMap(data))
    .catch( err => console.log(err))
}


let locationForm = document.getElementById('location-form');
locationForm.addEventListener('submit',displayResult);


function displayResult(e){
    e.preventDefault();
    console.log('hi');
    let address = document.getElementById('location-input').value;
    address = address.replace(/ /g,'+');
    console.log(address);
   let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=***YOUR API KEY***`
    getFormattedAddress(url).then((FA) => {
        let formattedAddress = `
        <ul class = 'list-group'>
            <li class = 'list-group-item'>${FA}</li>
        </ul>
        `;
        document.getElementById('formatted-address').innerHTML = formattedAddress;
    });
    
    getLatLong(url).then( (loc) => {
        getMLA(loc).then( (name) => {console.log(name)
            let mlaname = `
            <ul class = 'list-group'>
                <li class = 'list-group-item'>${name}</li>
            </ul>
            `;
            document.getElementById('mlaname').innerHTML=mlaname

        } );
    });
}

async function getFormattedAddress(url){
    let rawData = await fetch(url);
    let data =  await rawData.json();
    console.log(data.results[0].formatted_address);
    return await data.results[0].formatted_address;
}

async function getLatLong(url){
    let rawData = await fetch(url);
    let data =  await rawData.json();
    return await data.results[0].geometry.location;
}

async function getMLA(loc){
    
    let urlForOPS =  `https://openstates.org/api/v1/legislators/geo/?lat=${loc.lat}&long=${loc.lng}&apikey=***YOUR API KEY***`;
    let rawData = await fetch(urlForOPS);
    let data = await rawData.json();
    
    if(await data[0].active){
    return await data[0].full_name;
    }
}



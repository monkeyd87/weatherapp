let date = document.querySelector('.date');
date.textContent = moment().format('L');

let city =  document.querySelector('#city')
let form = document.querySelector('form')

window.addEventListener('load',event=>{
    if(localStorage.history){
        let cities = JSON.parse(localStorage.getItem('history'))
        for(city of cities){
            let button = document.createElement('button')
            button.setAttribute('class','btn btn-secondary')
            button.textContent =city
            document.querySelector('.history').appendChild(button)
        }
    }
})


async function getLatLon(f){
    let response =  await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${f}&limit=1&appid=80a7f23b8526cb024061f7df615b33cc`)
    let data =  await response.json()
    console.log(data[0].lat, data[0].lon)
}




let button =  document.querySelector('button')
button.addEventListener('click',event=>{
    event.preventDefault()
    let formData =  new FormData(form)
    
    let cityName = formData.get('cities')
    // getLatLon(cityName)
    saveCity(cityName)
   
    city.textContent = cityName.toUpperCase()
    form.reset()
    document.querySelector('.history').innerHTML = ''
    if(localStorage.history){
        let cities = JSON.parse(localStorage.getItem('history'))
        for(city of cities){
            let button = document.createElement('button')
            button.setAttribute('class','btn btn-secondary')
            button.textContent =city
            document.querySelector('.history').appendChild(button)
        }
    }


    
})


function saveCity(f){
   let history = localStorage.getItem('history')?  JSON.parse(localStorage.getItem('history')):[]
   if(!history.includes(f)){
       history.push(f)
       localStorage.setItem('history',JSON.stringify(history))

   }
}
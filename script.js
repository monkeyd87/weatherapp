let API_key = '47ed6ec2484eea6490cedb8170964c0e'

let date = document.querySelector('.date');
date.textContent = moment().format('L');

let city =  document.querySelector('#city')
let wind = document.querySelector('#wind')
let humidity = document.querySelector('#humidity')
let temp = document.querySelector('#temp')
let uv = document.querySelector('#uv')

let form = document.querySelector('form')

window.addEventListener('load',event=>{
    if(localStorage.history){
        let cities = JSON.parse(localStorage.getItem('history'))
        for(let city of cities){
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

//  38.5810606 -121.493895


async function currentWeather(f){
    let response =  await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${f}&limit=5&appid=80a7f23b8526cb024061f7df615b33cc`)
    let data =  await response.json()
    let lat = data[0].lat
    let lon = data[0].lon
    console.log(lat,lon)
    let weatherapi = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_key}`)
    let weatherdata = await weatherapi.json()
    console.log(weatherdata)
    temp.textContent = Math.floor(weatherdata.main.temp) + '°F'
    wind.textContent = weatherdata.wind.speed +' MPH'
    humidity.textContent = weatherdata.main.humidity +' %'
    
}




let button =  document.querySelector('button')
button.addEventListener('click',event=>{
    event.preventDefault()
    let formData =  new FormData(form)
    
    let cityName = formData.get('cities')
    currentWeather(cityName)
    
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



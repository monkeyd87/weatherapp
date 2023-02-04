let API_key = '47ed6ec2484eea6490cedb8170964c0e'

let date = document.querySelector('.date');
date.textContent = moment().format('L');

let city =  document.querySelector('#city')
let wind = document.querySelector('#wind')
let humidity = document.querySelector('#humidity')
let temp = document.querySelector('#temp')
let uv = document.querySelector('#uv')
let currentImg =  document.querySelector('.img')

let fiveday = document.querySelector('#fiveDay')


let form = document.querySelector('form')

window.addEventListener('load',event=>{
    load()
})

function saveCity(f){
    let history = localStorage.getItem('history')||[]
    if(!history.includes(f)){
        history.push(f)
        localStorage.setItem('history',JSON.stringify(history))
 
    }
 }

//  38.5810606 -121.493895


async function currentWeather(f){
    try{

        let response =  await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${f}&limit=5&appid=80a7f23b8526cb024061f7df615b33cc`)
        let data =  await response.json()
        let lat = data[0].lat
        let lon = data[0].lon
        console.log(lat,lon)
        let weatherapi = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_key}`)
        let weatherdata = await weatherapi.json()
        console.log(weatherdata)
        let imgel = document.createElement('img')
        imgel.setAttribute('src',`http://openweathermap.org/img/wn/${weatherdata.weather[0].icon}.png`)
        currentImg.innerHTML = ''
        currentImg.appendChild(imgel)
        temp.textContent = Math.floor(weatherdata.main.temp) + '°F'
        wind.textContent = weatherdata.wind.speed +' MPH'
        humidity.textContent = weatherdata.main.humidity +' %'
    
        let fivedayf = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_key}`)
        let fivedayData = await fivedayf.json()
        console.log(fivedayData)
        let list  =  fivedayData.list
        console.log(list)
        fiveday.innerHTML = ''
        for(let i =0;i < list.length; i +=8){
            let card = document.createElement('div')
            card.setAttribute('class','fiveDayCard col rounded m-3')
    
            let day = document.createElement('h2')
            day.textContent = moment(list[i].dt_txt).format('l')
    
            let img = document.createElement('img')
            img.setAttribute('class','current-img')
            img.setAttribute('src',`http://openweathermap.org/img/wn/${list[i].weather[0].icon}.png`)
    
            let temp = document.createElement('p')
            temp.textContent = `Temp: ${Math.floor(list[i].main.temp)}°f`
    
            let wind = document.createElement('p')
            wind.textContent = `wind: ${list[i].wind.speed} MPH`
    
            let humidity = document.createElement('p')
            humidity.textContent = `humidity: ${list[i].humidity} %`
    
    
    
            card.appendChild(day)
            card.appendChild(img)
            card.appendChild(temp)
            card.appendChild(wind)
            card.appendChild(humidity)
            
            fiveday.appendChild(card)
    
        }
    }catch{
        let remove = JSON.parse(localStorage.getItem('history'))
        remove.pop()
        localStorage.setItem('history',JSON.stringify(remove))
        load()
    }





    
}


function load(){
    document.querySelector('.history').innerHTML = ''
    if(localStorage.history){
        let cities = JSON.parse(localStorage.getItem('history')).reverse()
        for(let city of cities){
            let button = document.createElement('button')
            button.setAttribute('class','btn btn-secondary')
            button.textContent =city
            button.addEventListener('click',event=>{
                document.querySelector('#city').textContent = event.target.innerText.toUpperCase()
                currentWeather(event.target.innerText)
                
            })
            document.querySelector('.history').appendChild(button)
        }
    }

}

let button =  document.querySelector('button')
button.addEventListener('click',event=>{
    event.preventDefault()
    let formData =  new FormData(form)
    
    let cityName = formData.get('cities')
    currentWeather(cityName)
   
    
    saveCity(cityName)
    city.textContent =''
    city.textContent = cityName.toUpperCase()
    form.reset()
    load()


    
})



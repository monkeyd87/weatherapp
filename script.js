let API_key = '47ed6ec2484eea6490cedb8170964c0e'

let date = document.querySelector('.date');
date.textContent = moment().format('LL');

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

function saveCity(city){
    let history = JSON.parse(localStorage.getItem('history'))||[]
    if(!history.includes(city)){

        history.push(city)
        localStorage.setItem('history',JSON.stringify(history))

 
    }
 }

//  38.5810606 -121.493895


async function currentWeather(location){
    try{
        fiveday.innerHTML = ''
        let response =  await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=80a7f23b8526cb024061f7df615b33cc`)
        let data =  await response.json()
        const {lat,lon,name}= data[0]
        // let weatherapi = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_key}`)

        let fivedayf = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_key}`)
        let fivedayData = await fivedayf.json()
        let fiveDayForcast  =  fivedayData.list
        const weatherCurrent = fiveDayForcast[0]
        console.log(fiveDayForcast)

        


        // let weatherdata = await weatherapi.json()
        let imgel = document.createElement('img')
        imgel.setAttribute('src',`http://openweathermap.org/img/wn/${weatherCurrent.weather[0].icon}.png`)
        currentImg.innerHTML = ''
        currentImg.appendChild(imgel)
        city.textContent = name
        temp.textContent = Math.floor(weatherCurrent.main.temp) + '°F'
        wind.textContent = weatherCurrent.wind.speed +' MPH'
        humidity.textContent = weatherCurrent.main.humidity +' %'
    

        
        for(let i = 0;i < fiveDayForcast.length; i += 8){
            const day = fiveDayForcast[i+3]
            const {dt_txt,wind,main,weather} = day
            console.log(weather[0])
            let card = document.createElement('div')
            card.setAttribute('class','fiveDayCard col col-2 rounded m-3')

            switch(day.weather[0].main){
                case "Rain":
                    card.classList.add('rain')
                    break;
                case "Clear":
                    card.classList.add('clear')
                    break;
                case "Clouds":
                    card.classList.add('cloudy')
                    break;
                case "Snow":
                    card.classList.add('snow')
                    break;
                    


            }
    
            let date = document.createElement('h2')
            date.textContent = moment(dt_txt).format('LL h:mm A')
    
            let img = document.createElement('img')
            img.setAttribute('class','current-img')
            img.setAttribute('src',`http://openweathermap.org/img/wn/${weather[0].icon}.png`)
    
            let temp = document.createElement('p')
            temp.textContent = `Temp: ${Math.floor(main.temp)}°f`
    
            let windEl = document.createElement('p')
            windEl.textContent = `wind: ${wind.speed} MPH`
    
            let humidityEl = document.createElement('p')
            humidityEl.textContent = `humidity: ${main.humidity} %`
    
    
    
            card.appendChild(date)
            card.appendChild(img)
            card.appendChild(temp)
            card.appendChild(windEl)
            card.appendChild(humidityEl)
            
            fiveday.appendChild(card)
    
        }
    }catch(err){
        console.log(err)
        let remove = JSON.parse(localStorage.getItem('history'))
        remove.pop()
        localStorage.setItem('history',JSON.stringify(remove))
        city.textContent = 'city not found'
        load()
    }





    
}


function load(){
    document.querySelector('.history').innerHTML = ''
    if(localStorage.history){
        let cities = JSON.parse(localStorage.getItem('history')).reverse()
        for(let city of cities){
            let button = document.createElement('button')
            button.setAttribute('class','btn text-light btn-primary historyBtn')
            button.textContent =city
            button.addEventListener('click',event=>{
                document.querySelector('#city').textContent = event.target.innerText.toUpperCase()
                currentWeather(event.target.innerText)
                
            })
            document.querySelector('.history').appendChild(button)
        }
    }

}

let searchBtn =  document.querySelector('.search')
searchBtn.addEventListener('click',event=>{

    event.preventDefault()
    let formData =  new FormData(form)
    
    let cityName = formData.get('cities')
    currentWeather(cityName)
   
    
    saveCity(cityName)
    form.reset()
    load()


    
})



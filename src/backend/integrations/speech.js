import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path';

export default class Speech {
    static get CONFIG_PATH() { return './integrations/' }

    static async generate_speech(greet_name, location, voice_id) {
        const config = load_config(path.join(this.CONFIG_PATH, 'speech.json'))
        const keys = load_config(path.join(this.CONFIG_PATH, 'apikeys.json'))

        const greeting_keywords = { "[NAME]": greet_name, "[NAME2]": "Chaki" }

        const layout = (config.layouts[randomIndex(config.layouts.length)]).split(' ')
        var speech = ""
        for (var i in layout) {
            if (layout[i] === 'G') {
                var greeting = config.greetings[randomIndex(config.greetings.length)]
                speech += infill_data(greeting, greeting_keywords) + '.\n'
            }
            if (layout[i] === 'W') {
                var weather = config.weather[randomIndex(config.weather.length)]
                var data = await get_weather_data(location, keys.OpenWeatherMap)
                if (data == null) {
                    continue
                }
                speech += infill_data(weather, data) + '.\n'
            }
            if (layout[i] === 'Q') {
                speech += 'Your daily quote is.\n' + config.quotes[randomIndex(config.quotes.length)] + '\n'
            }
        }

        await upload_speech(speech, keys.Elevenlabs, voice_id)
    }
}

function load_config(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8', (err) => {
        if (err) { console.error(err) }
    }))
}


async function upload_speech(speech, elevenKey, voice_id) {
    // TODO make sure that file is written to disk 
    const filepath = './persistence/audio/daily.mp3'
    if (fs.existsSync(filepath)) {
        fs.rmSync(filepath)
        console.log('deleted daily.mp3')
    }

    var body = JSON.stringify({
        text: speech, model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.5, style: 0.5, use_speaker_boost: true }
    })

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': elevenKey, 'voice-id': voice_id },
        body: body
    }
    var res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice_id, requestOptions)
    if (!res.ok) {
        var json = await res.json()
        if(json.status.includes('quota')){
            // TODO generate and play status response
        }
    } else {
        var bf = await res.arrayBuffer()
        fs.writeFileSync(filepath, Buffer.from(bf))
        console.log('generated daily.mp3')
    }
}

function randomIndex(size) {
    return Math.random() * size | 0;
}

async function get_weather_data(location, apiKey) {
    // get weather data through OPENWEATHERMAP
    const configured_url = 'lat=' + location.lat + '&lon=' + location.lon + '&appid=' + apiKey + '&units=metric'
    var res = await fetch('https://api.openweathermap.org/data/2.5/weather?' + configured_url,
        { headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) {
        console.log(await res.text())
        return null
    }
    var data = await res.json()

    // create data structure for future handling
    var weather_dict = {}
    weather_dict['[TEMP]'] = Math.round(data.main.temp)
    weather_dict['[FTEMP]'] = Math.round(data.main.feels_like)
    weather_dict['[WEATHER]'] = data.weather[0].description
    weather_dict['[WIND]'] = Math.round(data.wind.speed)
    return weather_dict
}

// replaces dictionary keys found in template string with their dictionary value
function infill_data(template, data_dict) {
    var result = template
    for (const [key, value] of Object.entries(data_dict)) {
        result = result.replace(key, value)
    }
    return result
}
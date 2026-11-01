// Open-Meteo WMO interpretation codes; fixed Luoyang city coordinates, China Standard Time.
export const WEATHER_URL='https://api.open-meteo.com/v1/forecast?latitude=34.62&longitude=112.45&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FShanghai&forecast_days=1';
export function weatherKind(code){
 if([71,73,75,77,85,86].includes(code))return 'snow';
 if([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,97,99].includes(code))return 'rain';
 if([45,48].includes(code))return 'fog';
 if([2,3].includes(code))return 'cloud';
 if([0,1].includes(code))return 'clear';
 return null;
}
export const weatherNames={snow:'雪',rain:'雨',fog:'雾',cloud:'云',clear:'晴'};
export function parseWeather(payload){
 const c=payload?.current;
 if(!c||!Number.isFinite(c.temperature_2m)||!Number.isInteger(c.weather_code)||!weatherKind(c.weather_code)||typeof c.time!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(c.time))throw new Error('Invalid weather data');
 return {kind:weatherKind(c.weather_code),temperature:Math.round(c.temperature_2m),time:c.time,wind:Number.isFinite(c.wind_speed_10m)?c.wind_speed_10m:0};
}

// Keep the actual weather description separate from the three visual treatments.
export function weatherEffect(kind){return kind==='rain'||kind==='snow'?kind:'clear';}

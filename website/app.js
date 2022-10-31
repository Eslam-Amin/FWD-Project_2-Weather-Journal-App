
/* Global Variables */
const apiKey = "1019c9f62799b3d2225f56b47de96218&units=imperial";
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';

/* HTML Elements */
const zipCodeElement = document.getElementById("zip");
const feelingsElement = document.getElementById("feelings");
const contentElement = document.getElementById("content");
const dateElement = document.getElementById("date");
const tempElement = document.getElementById("temp");


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();




document.getElementById("generate").addEventListener("click", async function () {
    try {
        const zipCode = zipCodeElement.value.trim();
        const feelings = feelingsElement.value.trim();
        let weatherUrl = baseUrl + zipCode + "&APPID=" + apiKey;
        console.log(weatherUrl);
        fetchDataFromWeatherApi(weatherUrl).then((res) => {
            let dataObject = { "city": res.name, "zipCode": zipCode, "temp": res.main.temp, "feelings": feelings, "date": newDate }
            return dataObject
        }).then((data)=>{
            postDataToMyServer(data);
        }).catch((err) => {
            console.log("Error: ", err)
        })
        getDataFromMyServer().then((res) => {
            updateUI(res);
        }).catch((err) => {
            console.log("Error: ", err)
        })
    }
    catch (err) {
        console.log("error: ", err);
    }
});


const fetchDataFromWeatherApi = async (url) => {
    try {
        const res = await fetch(url);
        let myData = await res.json();
        if (myData.cod != 200){
            updateUI(null);
            return alert(myData.message);
        }
        return myData;
    }
    catch (err) {
        console.log("error: ", err);
    }
}

const postDataToMyServer = async (data) => {
    try {
        const res = await fetch("/postData", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const newData = await res.json();
        console.log("this is the newData", newData);
        return newData;
    }
    catch (err) {
        console.log("error", err);
    }
};


const getDataFromMyServer = async () => {
    try {
        const res = await fetch("/getAll")
        let myData = await res.json();
        return myData
    }
    catch (err) {
        console.log("error", err)
    }
}

function updateUI(dataObject) {
    if(dataObject === null) { 
    dateElement.innerHTML = "";
    tempElement.innerHTML = "";
    contentElement.innerHTML = "";
    }
    else{
        dateElement.innerHTML = `Today: ${dataObject.date}`;
        tempElement.innerHTML = `Temperature: ${dataObject.temp}`;
        contentElement.innerHTML = `
        City: ${dataObject.city}<br>
        Feelings: ${dataObject.feelings}
        `
    }
}



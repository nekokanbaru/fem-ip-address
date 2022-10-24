import "./style.css";
import javascriptLogo from "./javascript.svg";
import Axios from "axios";

const map = L.map("map").setView([0, 0], 1);

function printData(data) {
  document.querySelector("#ip-address").innerText = data.data.ip;
  document.querySelector("#location").innerText =
    data.data.location.city + ", " + data.data.location.country;
  document.querySelector("#timezone").innerText = data.data.location.timezone;
  document.querySelector("#isp").innerText = data.data.isp;

  // map
  const lat = data.data.location.lat;
  const lng = data.data.location.lng;
  // const map = L.map("map", {
  //   center: [lat, lng],
  //   zoom: 18,
  // });

  map.setView([lat, lng], 18);
  const marker = L.marker([lat, lng]).addTo(map);
  L.tileLayer(
    "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=UjVHFEz8ae6YwvcHFHd4",
    {
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
  ).addTo(map);

  console.log(data);
}

function printError() {
  document.querySelector("#ip-address").innerText = "not found";
  document.querySelector("#location").innerText = "not found";
  document.querySelector("#timezone").innerText = "not found";
  document.querySelector("#isp").innerText = "not found";
}

try {
  const getIp = async () => {
    const data = await Axios.get(
      "https://geo.ipify.org/api/v2/country,city?apiKey=at_6xssdILxCgrlFUXt5sXO14TMVdqV4"
    );
    printData(data);
    document.querySelector("#search").value = data.data.ip;
  };
  getIp();
} catch (e) {
  console.log(e);
}

window.onload = function () {
  const btnSearch = document.querySelector("#btn-search");
  const searchBar = document.querySelector("#search");

  btnSearch.addEventListener("click", async () => {
    searchIp();
  });

  searchBar.addEventListener("keyup", (event) => {
    if(event.keyCode === 13) {
      searchIp();
    }
  })

};

async function searchIp() {
  const searchText = document.querySelector("#search").value;
    const regexIP =
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
    const regexDomain =
      /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/gm;

    if (regexIP.test(searchText) == true) {
      const searchResult = await Axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_6xssdILxCgrlFUXt5sXO14TMVdqV4&ipAddress=${searchText}`
      ).catch((err) => console.log(err));
      if (searchResult !== undefined) {
        printData(searchResult);
        console.log(searchResult);
      }
    } else if (regexDomain.test(searchText) == true) {
      const searchResult = await Axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_6xssdILxCgrlFUXt5sXO14TMVdqV4&domain=${searchText}`
      ).catch((err) => printError());
      if (searchResult !== undefined) {
        printData(searchResult);
        console.log(searchResult);
      }
    } else {
      console.log("invalid input");
      printError();
    }
}

// document.querySelector("#app").innerHTML = `

//  `;

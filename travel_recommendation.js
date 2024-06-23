// let input = document.querySelector("input#query");
// input.addEventListener("input", async (e) => {
//   findRecommendations(e.target.value.trim().toLowerCase());
// });

document.forms[0].addEventListener("submit", (e) => {
  e.preventDefault();
  let query = e.target.query.value;
  let formatedQuery = query.trim().toLowerCase();
  if (formatedQuery) {
    findRecommendations(formatedQuery);
  }
});

function getCurrentTime(timeZone){
    const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const time = new Date().toLocaleTimeString('en-US', options);
    return time;
}

function generateRecommendationHTML(recommendation) {
  let htmlContent = `
    <div class="recommendation">
    <img src="${recommendation.imageUrl}" />
    <div class="info">
      <p class="place__name">${recommendation.name}</p>
      <strong class="description">
        Current Time: 
        <span data-timezone="${recommendation.timeZone}">
            ${getCurrentTime(recommendation.timeZone)}
        </span>
      </strong>
      <p class="description">
        ${recommendation.description}
      </p>
      <div>
        <button style="padding: 0.5rem 1rem" type="button">
          Visit
        </button>
      </div>
    </div>
  </div>
`;
  return htmlContent.trim();
}

async function findRecommendations(query) {
  const res = await fetch("/travel_recommendation_api.json");
  const data = await res.json();

  let recommendations = document.querySelector(".recommendations");
  recommendations.innerHTML = "";

  const keyword = {
    beaches: "beach, beaches",
    countries: "australia, japan, sydney, brazil",
    temples: "temple, temples",
  };

  if (keyword.beaches.search(query) !== -1) {
    data.beaches.forEach((beach) => {
      recommendations.innerHTML += generateRecommendationHTML(beach);
    });
    return;
  }

  if (keyword.temples.search(query) !== -1) {
    data.temples.forEach((temple) => {
      recommendations.innerHTML += generateRecommendationHTML(temple);
    });
    return;
  }

  if (keyword.countries.search(query) !== -1) {
    data.countries
      .filter((country) => new RegExp(query).test(country.name.toLowerCase()))
      .flatMap((country) => country.cities)
      .forEach((country) => {
        recommendations.innerHTML += generateRecommendationHTML(country);
      });
    return;
  }


  recommendations.innerHTML = "Please enter a valid search query..."
}



setInterval(() => {
    let timezones = document.querySelectorAll("span[data-timezone]");
    timezones.forEach(timezone => {
        timezone.innerHTML = getCurrentTime(timezone.dataset.timezone);
    })
}, 1000)
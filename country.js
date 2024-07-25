document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const countrySearchInput = document.getElementById('country-search');
  
    searchButton.addEventListener('click', function() {
      const countryName = countrySearchInput.value.trim();
      if (countryName === '') return;
  
      const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Country not found');
          }
          return response.json();
        })
        .then(data => {
          const countryData = data[0];
          const countryName = countryData.name.common;
          const countryFlag = countryData.flags.png; // Assuming 'flags' contains PNG URL
          const borderCodes = countryData.borders;
  
          // Update main country card
          const mainCountryElement = document.getElementById('main-country');
          const countryImageElement = document.createElement('img');
          countryImageElement.classList.add('country-image');
          countryImageElement.src = countryFlag;
          countryImageElement.alt = countryName;
  
          const countryNameElement = document.createElement('div');
          countryNameElement.classList.add('country-name');
          countryNameElement.textContent = countryName;
  
          mainCountryElement.innerHTML = ''; // Clear previous content
          mainCountryElement.appendChild(countryImageElement);
          mainCountryElement.appendChild(countryNameElement);
  
          // Fetch and display neighbors
          const neighborsElement = document.getElementById('neighbors');
          neighborsElement.innerHTML = ''; // Clear previous neighbors
  
          let neighborCardsHTML = '';
          let cardCount = 0;
  
          borderCodes.forEach((borderCode, index) => {
            const neighborApiUrl = `https://restcountries.com/v3.1/alpha/${borderCode}`;
  
            fetch(neighborApiUrl)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Neighbor country not found');
                }
                return response.json();
              })
              .then(neighborData => {
                const neighborName = neighborData[0].name.common;
                const neighborCountryFlag = neighborData[0].flags.png;
  
                // Construct HTML for each neighbor card
                const neighborCardHTML = `
                  <div class="neighbor-card">
                    <img class="neighbor-image" src="${neighborCountryFlag}" alt="${neighborName}">
                    <div class="neighbor-name">${neighborName}</div>
                  </div>
                `;
                neighborCardsHTML += neighborCardHTML;
                cardCount++;
  
                // Check if it's the fourth card or the last card in the list
                if (cardCount % 4 === 0 || index === borderCodes.length - 1) {
                  const neighborsRowElement = document.createElement('div');
                  neighborsRowElement.classList.add('neighbors-row');
                  neighborsRowElement.innerHTML = neighborCardsHTML;
                  neighborsElement.appendChild(neighborsRowElement);
                  neighborCardsHTML = ''; // Reset for the next row
                }
              })
              .catch(error => {
                console.error('Error fetching neighbor country data:', error);
              });
          });
        })
        .catch(error => {
          console.error('Error fetching country data:', error);
        });
    });
  });
  
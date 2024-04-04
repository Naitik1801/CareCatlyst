const sliderContainer = document.querySelector('.slider-container');
const cardsContainer = document.querySelector('.cards');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const body = document.querySelector("body");
// const checkout = document.getElementsByClassName("donateBtn");
let cardIndex = 0;

function updateSliderPosition() {
    // const cardWidth = document.querySelector('.trendCard').offsetWidth - 1; // Adjust the width and margin
    cardsContainer.style.transform = `translateX(${-cardIndex * 340}px)`;
}
// function addDonate() {
//   for (var i = 0; i < checkout.length; i++) {
//     checkout[i].addEventListener("click", () => {
//       $.ajax({
//         url: "/checkout-session",
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify({ quantity: 1 }),
//         success: function (data, textStatus, xhr) {
//           var stripe = Stripe(
//             "pk_test_51P0frbSHbBcqBAz5ffHOQBtb9g6ZUeh8i8Q5ztbayzatFEsKZWjDBfD5WDjPeiSMWRjctx0SLgCwXUNIcFy151OS0017jxZPNF"
//           );
//           return stripe.redirectToCheckout({ sessionId: data.id });
//         },
//       });
//     });
//   }
// }
function showCards(data) {
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'trendCard';
            let reach = item.a * 100 / item.t;
            reach = reach.toFixed(0)
            reach = +reach
            card.innerHTML = `
            <div class="trendImg">
                <img class="tImg" src="${item.image}" />
              </div>
              <div class="title"><a href="${item.url}">${item.title}</a></div>
              <div class="raisedBy">
                <span>FF</span>
                <p class="name">${item.by}</p>
              </div>
              <div class="raisedAmt"><p><span>${item.amount}</span> raised out of</p></div>
              <div class="target">${item.target}</div>
              <div class="bar">
                <div class="achieve" style="width:${reach}%"></div>
              </div>
              <div class="trendDetails">
                <div class="timeLeftWrap">
                  <span class="clock">
                    <img src="./Images/clockicon.png" alt="" />
                  </span>
                  <span class="timeLeft"> <span>${item.dayleft}</span></span>
                  days left
                </div>
                <div class="supports">
                  <span class="heart">
                    <img src="./Images/hearticon.png" alt="" />
                  </span>
                  <span class="totalSupport">${item.support}</span>
                  Supporters
                </div>
              </div>
              <div class="cardBtns">
                <button class="shareFB" onclick="window.location.href='https://www.facebook.com/sharer/sharer.php?u=https://www.example.com'">
                  <span class="FBimg">
                    <img src="./Images/fbicon.png" alt="FB" />
                  </span>
                  <span>Share</span>
                </button>
                <a href="donate.html"><button class="donateBtn">Donate</button></a>
              </div>
            </div>
            `;
            cardsContainer.appendChild(card);
        })
}

fetch('http://localhost:3000/items/child')
    .then(response => response.json())
    .then(data => {
        showCards(data);
        // addDonate();
        const scripts = document.createElement("script");
        scripts.src = "https://js.stripe.com/v3/";
        body.appendChild(scripts);
            prevBtn.addEventListener('click', () => {
                if (cardIndex > 0) {
                    cardIndex--;
                    updateSliderPosition();
                }
            });
    
            nextBtn.addEventListener('click', () => {
                if (cardIndex < data.length - 1) {
                    cardIndex++;
                    updateSliderPosition();
                }
            });;
        }).catch(error => {
        console.error('Error fetching data:', error);
    });

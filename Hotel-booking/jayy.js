function calculateNights(checkin, checkout) {
    const [checkinDay, checkinMonth] = checkin.split("/").map(Number);
    const [checkoutDay, checkoutMonth] = checkout.split("/").map(Number);
    const differenceInDays = checkoutDay - checkinDay;
    return differenceInDays >= 0 ? differenceInDays : 1; 
}

document.getElementById("checkAvailability").addEventListener("click", function () {
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const guests = parseInt(document.getElementById("guests").value);
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;

    if (!datePattern.test(checkin) || !datePattern.test(checkout)) {
        alert("Please enter valid dates in DD/MM format.");
        highlightInvalidField(document.getElementById("checkin"));
        highlightInvalidField(document.getElementById("checkout"));
        return;
    }

    const [checkinDay, checkinMonth] = checkin.split("/").map(Number);
    const [checkoutDay, checkoutMonth] = checkout.split("/").map(Number);
    const checkinDate = new Date(2024, checkinMonth - 1, checkinDay);
    const checkoutDate = new Date(2024, checkoutMonth - 1, checkoutDay);
    if (checkoutDate <= checkinDate) {
        alert("Checkout date must be after check-in date.");
        highlightInvalidField(document.getElementById("checkout"));
        return;
    }

    if (guests > 3) {
        document.getElementById("guestWarning").style.display = "block";
        highlightInvalidField(document.getElementById("guests"));
        return;
    } else {
        document.getElementById("guestWarning").style.display = "none";
    }

    document.getElementById("rooms").style.display = "block";
    document.getElementById("filterByPrice").style.display = "inline-block";
});

document.getElementById("filterByPrice").addEventListener("click", function () {
    const roomsContainer = document.getElementById("rooms");
    const rooms = Array.from(roomsContainer.getElementsByClassName("room"));
    rooms.sort((a, b) => parseInt(a.getAttribute("data-price")) - parseInt(b.getAttribute("data-price")));
    roomsContainer.innerHTML = "<h2>Available Rooms</h2>";
    rooms.forEach(room => roomsContainer.appendChild(room));
    roomsContainer.appendChild(document.getElementById("filterByPrice"));
});

function selectRoom(roomType, price) {
    try {
      console.log("Room selected:", roomType, price);
      console.log("heyyy")
      // First, show the confirmation form (if it's hidden)
      const confirmation = document.getElementById("confirmation");
      console.log("confirmation",confirmation)
      if (confirmation) {
        confirmation.style.display = "block";
      }
  
      // Now get form elements safely
      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("phone");
      const emailInput = document.getElementById("email");
  
      if (nameInput && phoneInput && emailInput) {
        nameInput.value = "";
        phoneInput.value = "";
        emailInput.value = "";
      } else {
        console.warn("Some form elements are not found in the DOM.");
      }
  
    } catch (error) {
      console.error("Error selecting room:", error);
    }
  }
function confirmBooking() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const guests = document.getElementById("guests").value;
    const SelectedRoom = document.getElementById("confirmationSelectedRoom").innerText.replace("Room Selected: ", "");
    const TotalPrice = document.getElementById("confirmationTotalPrice").innerText.replace("Total Price for", "").trim();
  
   if (!/^[a-zA-Z\s]+$/.test(name)) {
    alert("Please enter a valid name using only alphabets.");
    highlightInvalidField(document.getElementById("name"));
    return;
}

    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        highlightInvalidField(document.getElementById("phone"));
        return;
    }

    if (!email.endsWith("@gmail.com")) {
        alert("Please use a valid Gmail address.");
        highlightInvalidField(document.getElementById("email"));
        return;
    }
    alert(`Booking confirmed for ${name}!\nThank you for choosing our hotel.`);

}

document.getElementById("rooms").addEventListener("click", function (event) {
    const room = event.target.closest(".room");
    if (!room) return;

    const roomType = room.querySelector("p").innerText.split(" - ")[0];
    const pricePerNight = parseInt(room.getAttribute("data-price"));
    selectRoom(roomType, pricePerNight);
});
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM Loaded");

    console.log("3")
    // Handle room click
    document.querySelectorAll(".room").forEach(room => {
        room.addEventListener("click", () => {
          const roomType = room.querySelector("p").innerText;
          const price = room.dataset.price;
      
          // Fill hidden fields
          document.getElementById("room").value = roomType;
          document.getElementById("price").value = price;
          document.getElementById("checkinHidden").value = document.getElementById("checkin").value;
          document.getElementById("checkoutHidden").value = document.getElementById("checkout").value;
          document.getElementById("guestsHidden").value = document.getElementById("guests").value;
      
          // Get check-in and check-out values
          const checkin = document.getElementById("checkin").value;
          const checkout = document.getElementById("checkout").value;
      
          // Parse dates
          const [checkinDay, checkinMonth] = checkin.split("/").map(Number);
          const [checkoutDay, checkoutMonth] = checkout.split("/").map(Number);
          const checkinDate = new Date(2025, checkinMonth - 1, checkinDay);
          const checkoutDate = new Date(2025, checkoutMonth - 1, checkoutDay);
      
          // Calculate difference in milliseconds and convert to days
          const millisecondsPerDay = 1000 * 60 * 60 * 24;
          const nights = Math.round((checkoutDate - checkinDate) / millisecondsPerDay);
      
          // Total price calculation
          const totalPrice = nights * parseInt(price);
      
          // Show confirmation content
          document.getElementById("confirmationSelectedRoom").innerText = `Selected Room: ${roomType}`;
          document.getElementById("confirmationTotalPrice").innerText = `Total Price for ${nights} night(s): ₹${totalPrice}`;
      
          // Hide rooms and show confirmation section
          document.getElementById("rooms").style.display = "none";
          document.getElementById("confirmation").style.display = "block";
          document.getElementById("name").value = "";
          document.getElementById("phone").value = "";
          document.getElementById("email").value = "";
        });
      });
      
  
    // Handle final booking form
    const bookingForm = document.getElementById("bookingForm");
    console.log("bookingForm found:", bookingForm !== null);
    console.log("5")
    if (bookingForm) {
      console.log("Attaching submit listener to bookingForm");

    
    bookingForm.addEventListener("submit", function(e) {
      e.preventDefault();
      console.log("Form submitted!");
      
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const email = document.getElementById("email").value;
      const checkin = document.getElementById("checkinHidden").value;
      const checkout = document.getElementById("checkoutHidden").value;
      const guests = document.getElementById("guestsHidden").value;
      const room = document.getElementById("room").value;
      const price = document.getElementById("price").value;
      

     if (!/^[a-zA-Z\s]+$/.test(name)) {
        alert("Please enter a valid name using only alphabets.");
        highlightInvalidField(document.getElementById("name"));
        return;
    }
    

      if (!/^\d{10}$/.test(phone)) {
          alert("Please enter a valid 10-digit phone number.");
          highlightInvalidField(document.getElementById("phone"));
          return;
      }

      if (!email.endsWith("@gmail.com")) {
          alert("Please use a valid Gmail address.");
          highlightInvalidField(document.getElementById("email"));
          return;
      }
      // Create data object
      const data = {
          name: name,
          phone: phone,
          email: email,
          checkin: formatDateToMySQL(checkin),
          checkout: formatDateToMySQL(checkout),
          guests: parseInt(guests),
          room: room,
          price: parseFloat(price),
      };
      
      console.log("About to make API call to:", "http://127.0.0.1:8000/bookings");
      console.log("With data:", JSON.stringify(data));
      
      // Make API call
      fetch("http://127.0.0.1:8000/bookings", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
          if (result.message) {
              alert(`Booking confirmed for ${name}!\nThank you for choosing our hotel.`);
          } else {
              alert("Booking failed: " + (result.detail || "Unknown error"));
          }
      })
      .catch(error => {
          console.error("API call error:", error);
          alert("Server error. Please try again.");
      });
      });
    }
  });
  

function formatDateToMySQL(dateStr) {
    const parts = dateStr.split("/");
    if (parts.length !== 2) return null;  // Invalid format
    return `2025-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}
function highlightInvalidField(field) {
    if (field) {
        field.style.border = "2px solid red"; // Highlight in red
        console.error(`❌ Invalid field: ${field.id}`);
    }
}


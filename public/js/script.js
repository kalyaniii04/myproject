document.addEventListener("DOMContentLoaded", () => {
    'use strict'
  
    // --- 1. Bootstrap Validation (Moved inside DOMContentLoaded) ---
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
    
    // --- 2. Theme Toggle (Original, already correct) ---
    const toggleSwitch = document.getElementById("theme-toggle");
    const body = document.body;

    // Check if the toggle switch element exists before proceeding
    if (toggleSwitch) {
        // Apply stored preference
        if (localStorage.getItem("theme") === "dark") {
            body.classList.add("dark");
            toggleSwitch.checked = true; // FIXES ERROR AT LINE 27 (now inside a check)
        }

        // Listen for toggle
        toggleSwitch.addEventListener("change", () => {
            if (toggleSwitch.checked) {
                body.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                body.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        });
    }


    // --- 3. Toggle Filters (Moved inside DOMContentLoaded) ---
    const showFiltersBtn = document.getElementById("showFiltersBtn");
    
    // Check if the button element exists before adding listener
    if (showFiltersBtn) {
        showFiltersBtn.addEventListener("click", function () { // FIXES ERROR AT LINE 45
            const filters = document.getElementById("filters");
            filters.classList.toggle("show-all");

            // Change button text dynamically
            if (filters.classList.contains("show-all")) {
                this.textContent = "Hide Filters";
            } else {
                this.textContent = "Show All Filters";
            }
        });
    }
});

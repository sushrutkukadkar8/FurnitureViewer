// ===========================================
// Furniture Viewer
// script.js
// ===========================================

// Elements
const viewer = document.getElementById("viewer");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const list = document.getElementById("list");

// Details
const modelName = document.getElementById("modelName");
const modelCategory = document.getElementById("modelCategory");
const modelMaterial = document.getElementById("modelMaterial");
const modelDimensions = document.getElementById("modelDimensions");
const modelDescription = document.getElementById("modelDescription");

// Store all furniture
let furniture = [];

// ================================
// Load JSON
// ================================

fetch("models.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Unable to load models.json");
        }
        return response.json();
    })
    .then(data => {

        furniture = data;

        createCategories();

        displayFurniture();

    })
    .catch(error => {

        console.error(error);

        alert("Unable to load furniture list.");

    });


// ================================
// Create Category Dropdown
// ================================

function createCategories(){

    const categories = ["All"];

    furniture.forEach(item=>{

        if(!categories.includes(item.category)){

            categories.push(item.category);

        }

    });

    categorySelect.innerHTML="";

    categories.forEach(cat=>{

        const option=document.createElement("option");

        option.value=cat;

        option.textContent=cat;

        categorySelect.appendChild(option);

    });

}

// ================================
// Display Cards
// ================================

function displayFurniture(){

    list.innerHTML="";

    const searchText=searchInput.value.toLowerCase();

    const selectedCategory=categorySelect.value;

    const filtered=furniture.filter(item=>{

        const nameMatch=item.name
            .toLowerCase()
            .includes(searchText);

        const categoryMatch=
            selectedCategory==="All"
            || item.category===selectedCategory;

        return nameMatch && categoryMatch;

    });

    filtered.forEach(item=>{

        const card=document.createElement("div");

        card.className="model-card";

        card.innerHTML=`

            <img src="${item.thumbnail}" alt="${item.name}">

            <div class="card-info">

                <h3>${item.name}</h3>

                <p>${item.category}</p>

            </div>

        `;

        card.onclick=()=>{

            loadFurniture(item);

        };

        list.appendChild(card);

    });

    // Load first item automatically

    if(filtered.length>0 && !viewer.src){

        loadFurniture(filtered[0]);

    }

}

// ================================
// Load Furniture
// ================================

function loadFurniture(item) {

    viewer.src = item.model;

    if (item.iosModel) {
        viewer.setAttribute("ios-src", item.iosModel);
    }

    modelName.textContent = item.name;
    modelCategory.textContent = item.category;
    modelMaterial.textContent = item.material;
    modelDimensions.textContent = item.dimensions;
    modelDescription.textContent = item.description;
}

// ================================
// Search
// ================================

searchInput.addEventListener("input",()=>{

    displayFurniture();

});

// ================================
// Category
// ================================

categorySelect.addEventListener("change",()=>{

    displayFurniture();

});

// ================================
// Viewer Events
// ================================

viewer.addEventListener("load",()=>{

    console.log("Model Loaded");

});

viewer.addEventListener("error",()=>{

    console.error("Model Failed");

});
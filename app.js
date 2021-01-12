const cards = document.querySelectorAll(".cards");
const inputCards = document.querySelectorAll(".input-cards");
const addBtns = document.querySelectorAll(".add");
const list = document.querySelectorAll("ul");
const yourBtn = document.querySelector(".your-btn");
const myList = document.querySelector(".my-list");

let itemsList = [];
let yourTitle = [];

displaySavedValues();
addItem(inputCards, addBtns, list);
addMyList();

//Add item
function addItem(inputCards, addBtns, list) {
  addBtns.forEach((addBtn, i) => {
    addBtn.addEventListener("click", () => {
      inputVal = inputCards[i].value;
      theObject = { valueInput: inputVal, position: i };

      if (inputVal) {
        itemsList.push(theObject);
        storageItem();
        const li = document.createElement("li");
        list[i].appendChild(li);
        let fullItems = localStorage.getItem("listOfItems");
        li.innerText = JSON.parse(fullItems)[itemsList.length - 1].valueInput;
        inputCards[i].value = "";
        deleteItem();
      }
    });
  });
}

//Delete Item
function deleteItem() {
  const items = document.querySelectorAll("li");

  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      theTargetText = e.target.innerText;
      let findItem = itemsList.findIndex(
        (itemList) => itemList.valueInput == theTargetText
      );

      if (findItem != -1) {
        itemsList.splice(findItem, 1);
        localStorage.setItem("listOfItems", JSON.stringify(itemsList));
      }
      e.target.remove();

      if (itemsList.length === 0) {
        localStorage.removeItem("listOfItems");
      }
    });
  });
}

//Create card
function addMyList() {
  yourBtn.addEventListener("click", () => {
    const myDiv = document.createElement("div");
    myDiv.className = "my-list";
    myList.appendChild(myDiv);
    myDiv.innerHTML = `
  
    <div class="cards">
        <input type='text' class='your-title' placeholder='Insert a title...' onkeyup="addTitle()"/>
        <input type="text" class="input-cards" placeholder="Add new cards..." maxlength = "30"/>
        <button class="add">ADD</button>
        <ul></ul>
      </div>
  `;
    addNewItem();
  });
}

//Add item
function addNewItem() {
  const inputCards = document.querySelectorAll(".input-cards");
  const addBtns = document.querySelectorAll(".add");
  const list = document.querySelectorAll("ul");
  addItem(inputCards, addBtns, list);
}

//Add title and save
function addTitle() {
  const myTitles = document.querySelectorAll(".your-title");

  myTitles.forEach((myTitle, i) => {
    theTitle = { valueInput: myTitle.value, position: i + 2 };

    if (theTitle) {
      yourTitle.push(theTitle);
      saveAndReplace();

      //Delete the same text position and replace with the new one and save
      function saveAndReplace() {
        for (let x = 0; x <= yourTitle.length - 2; x++) {
          if (
            yourTitle[yourTitle.length - 1].position === yourTitle[x].position
          ) {
            yourTitle.splice(x, 1);
            storageTitle();
          }
        }
      }
    }
  });
}

//Save to local storage
function storageItem() {
  localStorage.setItem("listOfItems", JSON.stringify(itemsList));
}

function storageTitle() {
  localStorage.setItem("listOfTitles", JSON.stringify(yourTitle));
}

//Pick the saved values and display in reload
function displaySavedValues() {
  createUls();
  createLis();

  //Pick the saved values and create li element
  function createLis() {
    const list = document.querySelectorAll("ul");
    let fullItems = localStorage.getItem("listOfItems");
    let eachItems = JSON.parse(fullItems);

    if (eachItems) {
      for (i = 0; i <= eachItems.length - 1; i++) {
        const li = document.createElement("li");
        list[eachItems[i].position].appendChild(li);
        li.innerHTML = eachItems[i].valueInput;
        itemsList.push({
          valueInput: li.innerHTML,
          position: eachItems[i].position,
        });
        storageItem();
        deleteItem();
      }
    }
  }
}

//Pick the saved values and create ul element
function createUls() {
  let fullItems = localStorage.getItem("listOfItems");
  let eachItems = JSON.parse(fullItems);

  let fullTitles = localStorage.getItem("listOfTitles");
  let eachTitles = JSON.parse(fullTitles);

  if (eachTitles) {
    if (eachTitles.length === 0) {
      localStorage.removeItem("listOfTitles");
    }
  }

  //Create Divs and display the saved titles and items
  function addDivs(eachSomething) {
    for (i = 2; i <= getMaxPosition(eachSomething); i++) {
      let findItem = eachSomething.findIndex((c) => c.position >= 2);
      if (findItem != -1) {
        const myDiv = document.createElement("div");
        myDiv.className = "my-list";
        myList.appendChild(myDiv);

        myDiv.innerHTML = `
            <div class="cards">
            <input type='text' class='your-title' placeholder='Insert a title...' onkeyup="addTitle()" value='${getInputValue(
              i,
              eachTitles
            )}'/>
            <input type="text" class="input-cards" placeholder="Add new cards..." maxlength = "30" />
            <button class="add">ADD</button>
            <ul></ul>
            </div>
            `;
        if (eachTitles) {
          deleteTitles(eachTitles);
        }
        addNewItem();
      }
    }
  }

  if (eachItems || eachTitles) {
    if (getMaxPosition(eachItems) >= getMaxPosition(eachTitles)) {
      if (eachItems) {
        addDivs(eachItems);
      }
    } else {
      addDivs(eachTitles);
    }
  }
}

//Get the max position of eachItems and eachTitles
function getMaxPosition(eachSomethings) {
  if (eachSomethings) {
    let maxPosition = Math.max.apply(
      Math,
      eachSomethings.map(function (eachSomething) {
        return eachSomething.position;
      })
    );
    return maxPosition;
  } else {
    return 0;
  }
}

//Get the saved titles(eachTitles)
function getInputValue(l, eachTitles) {
  if (eachTitles && eachTitles[l - 2]) {
    return eachTitles.map((eachTitle) => {
      return eachTitle.valueInput;
    })[l - 2];
  } else {
    return "";
  }
}

//Delete titles
function deleteTitles(eachTitles) {
  if (eachTitles === [] || eachTitles.length === 0) {
    localStorage.removeItem("listOfTitles");
  }
  yourTitle = eachTitles;

  if (eachTitles[getMaxPosition(eachTitles) - 2]) {
    if (eachTitles[getMaxPosition(eachTitles) - 2].valueInput === "") {
      yourTitle.pop();
      storageTitle();
    }
  }
}

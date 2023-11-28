const template = document.createElement("template");
template.innerHTML =`
<style>
nav{
    background-image: linear-gradient(to bottom right, black, red)
  }
</style>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

<nav class="navbar">
    <!-- logo / brand -->
    <div class="navbar-brand">
      <a class="navbar-item" href="home.html">
        <img src = images/dota-2-logo.png></img>
      </a>
      <a class="navbar-burger" id = "burger">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>

    <div class="navbar-menu" id = "nav-links">
      <div class="navbar-end">
        <a class="navbar-item is-hoverable has-text-black-bis" href="home.html" id = "home">
          Home
        </a>
      
        <a class="navbar-item is-hoverable has-text-black-bis" href="app.html" id = "app">
          App
        </a>
      
        <a class="navbar-item is-hoverable has-text-black-bis" href="favorites.html" id = "fav">
          Favorites
        </a>

        <a class="navbar-item is-hoverable has-text-black-bis" href="community.html" id = "com">
        Community
        </a>
      
        <a class="navbar-item is-hoverable has-text-black-bis" href="documentation.html" id = "doc">
          Documentation
        </a>
      </div>
    </div>
  </nav>
`;

class AppNavbar extends HTMLElement
{
    constructor()
    {
        super();

        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback()
    {
        
        this.burgerIcon = this.shadowRoot.querySelector("#burger");
        this.navbarMenu = this.shadowRoot.querySelector("#nav-links");

        this.app = this.shadowRoot.querySelector("#app");
        this.home = this.shadowRoot.querySelector("#home");
        this.favorite = this.shadowRoot.querySelector("#fav");
        this.community = this.shadowRoot.querySelector("#com");
        this.documentation = this.shadowRoot.querySelector("#doc");

        this.burgerIcon.addEventListener("click", () => 
        {
            this.navbarMenu.classList.toggle("is-active");
        })
        this.render();
    }

    attributeChangedCallback(attributeName, oldVal, newVal)
    {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    static get observedAttributes()
    {
        return ["data-currentPage"];
    }

    render()
    {
        if ( document.URL.includes("home.html") ) {
            this.home.classList.add("has-background-success");
        }
        else if ( document.URL.includes("app.html") ) {
            this.app.classList.add("has-background-success");
        }
        else if ( document.URL.includes("favorites.html") ) {
            this.favorite.classList.add("has-background-success");
        }
        else if ( document.URL.includes("community.html") ) {
          this.community.classList.add("has-background-success");
        }
        else {
            this.documentation.classList.add("has-background-success");
        }
    }

    

}
customElements.define("app-navbar", AppNavbar);
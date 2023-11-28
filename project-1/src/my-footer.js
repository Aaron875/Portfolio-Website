const template = document.createElement("template");
template.innerHTML =`
<style>
footer{
    background-image: linear-gradient(to top right, black, red);
    
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

<footer>
  <div class = "has-text-centered is-size-4">
        <a href = "https://people.rit.edu/amc3047/235/Project1/index.html" target = "_blank">&copy; 2022 Aaron Cummings</a>
    </div>
</footer>

`;

class MyFooter extends HTMLElement
{
    constructor()
    {
        super();

        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback()
    {
        
    }
}
customElements.define("my-footer", MyFooter);
const template = document.createElement("template");
template.innerHTML =`
<style>
footer{
    background-image: linear-gradient(to bottom right,  red, blue);
    
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

</style>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

<footer>

    <div class= "columns is-gapless mx-6">
        <div class="column is-one-fifth">
            <a class="button is-info  is-rounded has-text-danger-dark is-medium" href = "https://aaron875.github.io/Portfolio-Website" target = "_blank">&copy; 2022 Aaron Cummings</a>
        </div>
        <div class="column is-one-fifth">
        </div>
        <div class="column is-one-fifth">
        </div>
        <div class="column is-one-fifth">
        </div>
        <div class="column is-one-fifth has-text-right">
            <a class="button is-danger  is-rounded has-text-link-dark is-medium" href = "https://www.stsci.edu/~lbradley/seminar/attractors.html" target = "_blank">Useful Attractor Math</a>
        </div>
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
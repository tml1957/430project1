const template = document.createElement("template");
template.innerHTML = `
    <style>
      @import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css";
    </style>
    <nav class="navbar is-white has-shadow has-background-primary has-shadow">
    <!-- logo / brand -->
    <div class="navbar-brand">
      <a class="navbar-item" href="client.html">
      </a>
      <a class="navbar-burger" id="burger">
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>
  
    <div class="navbar-menu" id="nav-links">
      <!-- right links -->
      <div class="navbar-start">
      <a class="navbar-item is-hoverable" href="client.html">
          Submit
        </a>
      
        <a class="navbar-item is-hoverable" href="clientPage2.html">
          Review
        </a>
      </div> <!-- end navbar-start -->
    </div>
  </nav>
`;

class Navbar extends HTMLElement{
    constructor(){
        super();
        
        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.navList = this.shadowRoot.querySelectorAll("a.navbar-item");
    }

    connectedCallback(){
        const burgerIcon = this.shadowRoot.querySelector("#burger");
        const navbarMenu = this.shadowRoot.querySelector("#nav-links");

        burgerIcon.addEventListener('click', () => {
            navbarMenu.classList.toggle('is-active');
        });

        this.navList.item(this.getAttribute('page')).style.backgroundColor = "#feecf0";
        this.render();
    }

    render(){
        //const email = this.getAttribute('data-email') ? this.getAttribute('data-email') : "tml1957@rit.edu";
        //const text = this.getAttribute('data-text') ? this.getAttribute('data-text') : "Thomas Leonard";

        //this.shadowRoot.querySelector("span").innerHTML = `Created by: ${text} <br> Contact at: ${email}`;
    }
  } 
	
  customElements.define('tl-navbar', Navbar);
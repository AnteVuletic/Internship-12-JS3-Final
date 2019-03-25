"use strict";
(function(){
    const ID_MAIN_WRAPPER = "content";
    function ContentDelivery(entryPoint){
        this.content = entryPoint;
    }
    ContentDelivery.prototype.replaceHTML =  function(HTML){
        document.getElementById(this.content).innerHTML = HTML;
    }
    function AuthenticationService(entryPoint){
        ContentDelivery.call(this,entryPoint);
        this.isAuthorized = false;
        this.authorizedEvent = new Event("authorized");
        this.validator;
        this.newUser;
        this.HTML_REGISTER_MARKUP = `<div class="authentication__wrapper register__wrapper">
                                        <div class="authentication">
                                            <div class="authentication__img">
                                                <img src="assets/images/pattern.png" draggable="false" alt="Register image" />
                                            </div>
                                            <div class="authentication__form">
                                                <form name="authentication">
                                                    <label>Username:</label>
                                                    <div class="tooltip">
                                                        <input type="text" name="username" minlength="5" maxlength="10" placeholder="Username" required/>
                                                    </div>
                                                    <label>Password:</label>
                                                    <div class="tooltip">
                                                        <input type="password" name="password" minlength="5" maxlength="10" placeholder="Password" required/>
                                                    </div>
                                                    <label>Repeat password:</label>
                                                    <div class="tooltip">
                                                        <input type="password" name="repeat" minlength="5" maxlength="10" placeholder="Repeat password" required/>
                                                    </div>
                                                    <input type="submit" name="action" class="form__button" value="Register"/>
                                                </form>
                                            </div>
                                        </div>
                                    </div>`; 
        this.HTML_LOGIN_MARKUP = `<div class="authentication__wrapper login__wrapper">
                                    <div class="authentication">
                                        <div class="authentication__img">
                                            <img src="assets/images/pattern.png" draggable="false" alt="Login image" />
                                        </div>
                                        <div class="authentication__form">
                                            <form name="authentication">
                                                <label>Username:</label>
                                                <div class="tooltip">
                                                    <input type="text" name="username" placeholder="Username" required/>
                                                </div>
                                                <label>Password:</label>
                                                <div class="tooltip">
                                                    <input type="password" name="password" placeholder="Password" required/>
                                                </div>
                                                <div class="errorMessage">
                                                    <span>Invalid credentials try again.</span>
                                                </div>
                                                <input type="submit" name="action" class="form__button" value="Login"/>
                                            </form>
                                        </div>
                                    </div>
                                </div>`;
    }
    AuthenticationService.prototype = Object.create(ContentDelivery.prototype);
    AuthenticationService.prototype.initializeState = function(){
        if(window.localStorage.length === 0){
            this.newUser = true
        }
        else{
            this.newUser = false;
        } 
        this.render();
    }
    AuthenticationService.prototype.render = function(){
        this.newUser ? this.replaceHTML(this.HTML_REGISTER_MARKUP) : this.replaceHTML(this.HTML_LOGIN_MARKUP);
        this.handleAction();
    }
    AuthenticationService.prototype.handleAction = function(){
        let toolTipSpan = document.createElement("span");
        toolTipSpan.classList.add("tooltipText");
        toolTipSpan.innerText = "This field is required";
        let toolTipUser = toolTipSpan.cloneNode(true);
        let toolTipPassword = toolTipSpan.cloneNode(true);
        this.validator = document.getElementsByName("authentication")[0];
        this.validator.username.insertAdjacentElement('afterend',toolTipUser);
        this.validator.password.insertAdjacentElement('afterend',toolTipPassword);
        this.validator.username.onchange = () =>{
            if(this.validator.username.validity.tooShort || this.validator.username.validity.tooLong){
                toolTipUser.style.visibility = "visible";
                toolTipUser.innerText = "Username needs to be longer then 5 characters.";
                this.validator.username.insertAdjacentElement('afterend',toolTipUser);
            }else{
                toolTipUser.style.visibility = "hidden";
            }
        }
        this.validator.password.onchange = () =>{
            if(this.validator.password.validity.tooShort || this.validator.password.validity.tooLong){
                toolTipPassword.style.visibility = "visible";
                toolTipPassword.innerText = "Username needs to be longer then 5 characters.";
                this.validator.password.insertAdjacentElement('afterend',toolTipPassword);
            }else{
                toolTipPassword.style.visibility ="hidden";
            }
        }
        if(this.newUser){
            this.validator.repeat.insertAdjacentElement('afterend',toolTipSpan);
            this.validator.repeat.onchange = () =>{
                if(this.validator.password.value !== this.validator.repeat.value){
                    toolTipSpan.style.visibility ="visible";
                    this.validator.repeat.setCustomValidity("Password missmatch");
                    toolTipSpan.innerText = "Password missmatch.";
                    this.validator.repeat.insertAdjacentElement('afterend',toolTipSpan);
                }else{
                    this.validator.repeat.setCustomValidity("");
                    toolTipSpan.style.visibility ="hidden";
                }
            }
        }
        this.validator.action.addEventListener("authorized",(event)=>{
            if(this.newUser){
                if(!this.validator.username.validity.tooShort && !this.validator.password.validity.tooShort && !this.validator.repeat.validity.customError){
                    window.localStorage.setItem(this.validator.username.value,this.validator.password.value);
                }
            }else{
                let isUser = window.localStorage.getItem(this.validator.username.value);
                if(isUser !== null){
                    if(this.validator.password.value === isUser){
                        this.isAuthorized = true;
                        return;
                    }
                }
                this.validator.username.value = "";
                this.validator.password.value = "";
                document.querySelector(".errorMessage").style.display = "block";
                this.isAuthorized = false;
            }
        });
    }
    function ApiManager(){
        this.payloadUsers;
        this.payloadPosts;
    }
    ApiManager.prototype.getUsers = function(){
        return fetch("https://jsonplaceholder.typicode.com/users")
            .then(unserilizied => unserilizied.json())
            .then(data => {
                return this.payloadUsers = data;
            })
            .catch((err)=>{
                console.log(err)
            });
    }
    ApiManager.prototype.getPosts = function(){
        return fetch("https://jsonplaceholder.typicode.com/users/1/posts")
            .then(unserilizied => unserilizied.json())
            .then(data =>{
                return this.payloadPosts = data;
            })
            .catch((err)=>{
                console.log(err)
            });
    }
    ApiManager.prototype.getData = function(){
        return Promise.all([this.getPosts(),this.getUsers()]).then(_=>true);
    }
    function User(data){
        this.id = data.id;
        this.username = data.username;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.website = data.website;
        this.address = {
            street : data.address.street,
            suite : data.address.suite,
            city: data.address.city,
            zipcode: data.address.zipcode
        };
        this.company = {
            name: data.company.name,
            catchPhrase: data.company.catchPhrase
        }
        this.posts =[];
    }
    User.prototype.getUserCard = function(){
        return `<div id=${this.id} class="users__card">
                    <div class="card__header">
                        <img class="header__img" src="assets/images/pattern.png" draggable="false"/>
                        <h2 class="header__username">${this.username}</h2>
                    </div>
                    <div class="card__main">
                        <span class="main__id">ID: ${this.id}</span>
                        <span class="main__name">Name: ${this.name}</span>
                        <span class="main__email">Email: ${this.email}</span>
                    </div>
                    <div class="card__footer">
                        <button class="footer__button footer__button--details">Details</button>
                        <button class="footer__button footer__button--posts">Posts</button>
                    </div>
                </div>`;
    }
    function AppManager(entryPoint){
        ContentDelivery.call(this,entryPoint);
        this.api = new ApiManager();
        this.users = [];
    }
    AppManager.prototype = Object.create(ContentDelivery.prototype);
    AppManager.prototype.run = function(){
        this.authorize();
    }
    AppManager.prototype.authorize = function(){
        let auth = new AuthenticationService(ID_MAIN_WRAPPER);
        auth.initializeState();
        return auth.validator.action.addEventListener("click",()=>{
            event.preventDefault();
            auth.validator.action.dispatchEvent(auth.authorizedEvent);
            if(auth.isAuthorized){
                this.api.getData().finally(_=>{
                    this.formatUsers();
                    this.printUsers();
                });
            }
        });
    }
    AppManager.prototype.formatUsers = function(){
        this.api.payloadUsers.forEach((user,index)=>{
            this.users.push(new User(user));
            this.api.payloadPosts
                .filter((post)=>post.userId === this.users[index].id)
                .forEach((filteredPost)=>{
                    this.users[index].posts.push({
                        postId : filteredPost.id,
                        title: filteredPost.title,
                        body : filteredPost.body
                    });
                });
        })
    }
    AppManager.prototype.printUsers = function(){
        let stageUserHTML = `<div class="users">`;
        this.users.forEach((user)=>{
            stageUserHTML += user.getUserCard();
        });
        stageUserHTML +="</div>";
        this.replaceHTML(stageUserHTML);
    }
    let app = new AppManager(ID_MAIN_WRAPPER);
    app.run();
    
})();
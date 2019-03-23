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
        this.authorized = false;
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
                                                <input type="text" name="username" minlength="5" maxlength="10" placeholder="Username"/>
                                                <label>Password:</label>
                                                <input type="password" name="password" minlength="5" maxlength="10" placeholder="Password"/>
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
        this.validator.repeat.insertAdjacentElement('afterend',toolTipSpan);
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
        this.validator.repeat.onchange = () =>{
            if(this.validator.password.value !== this.validator.repeat.value){
                toolTipSpan.style.visibility ="visible";
                this.validator.repeat.setCustomValidity("Password missmatch");
                toolTipSpan.innerText = "Password missmatch.";
                this.validator.repeat.insertAdjacentElement('afterend',toolTipSpan);
                console.log(this.validator.repeat.validity)
            }else{
                this.validator.repeat.setCustomValidity("");
                toolTipSpan.style.visibility ="hidden";
            }
        }
        this.validator.action.addEventListener("click",(event)=>{
            event.preventDefault();
            
        });
    }
    var uAuth = new AuthenticationService(ID_MAIN_WRAPPER);
    uAuth.initializeState();
})();
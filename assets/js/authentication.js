"use strict";
(function(){
    function ContentDelivery(entryPoint){
        this.content = entryPoint;
    }
    ContentDelivery.prototype.replaceHTML =  function(HTML){
        document.getElementById(this.content).innerHTML = HTML;
    }
    function AuthenticationService(entryPoint){
        ContentDelivery.call(this,entryPoint);
        this.authorized = false;
        this.newUser;
        this.HTML_REGISTER_MARKUP = `<div class="authentication__wrapper register__wrapper">
                                        <div class="authentication">
                                            <div class="authentication__img">
                                                <img src="assets/images/pattern.png" draggable="false" alt="Register image" />
                                            </div>
                                            <div class="authentication__form">
                                                <form name="register">
                                                    <label>Username:</label>
                                                    <input type="text" name="username" placeholder="Username"/>
                                                    <label>Password:</label>
                                                    <input type="password" name="password" placeholder="Password"/>
                                                    <label>Repeat password:</label>
                                                    <input type="password" name="repeat" placeholder="Repeat password"/>
                                                    <input type="submit" class="form__button" value="Register"/>
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
                                            <form>
                                                <label>Username:</label>
                                                <input type="text" name="username" placeholder="Username"/>
                                                <label>Password:</label>
                                                <input type="password" name="password" placeholder="Password"/>
                                                <input type="submit" class="form__button" value="Login"/>
                                            </form>
                                        </div>
                                    </div>
                                </div>`;
    }
    AuthenticationService.prototype = Object.create(ContentDelivery.prototype);
    AuthenticationService.prototype.initializeState = function(){
        window.localStorage.length === 0 ? this.newUser = true : this.newUser = false;
    }
    AuthenticationService.prototype.render = function(){
        this.newUser ? this.replaceHTML(this.HTML_REGISTER_MARKUP) : this.replaceHTML(this.HTML_LOGIN_MARKUP);
    }
    var uAuth = new AuthenticationService("content");
    uAuth.initializeState();
    uAuth.render();
})();
<template>
    <div>
        <!-- link and title -->
        <h1>Register/login</h1><br>
        <router-link :to="{ name: 'home'}">Home</router-link>
        <router-link :to="{ name: 'petitions'}">Petitions</router-link>
        <div v-if="this.$cookies.isKey('userId')">
            <router-link :to="{ name: 'users'}">Profile</router-link>
            <router-link :to="{ name: 'mypetitions'}">My petitions</router-link>
        </div>

        <!-- logout -->
        <div v-if="this.$cookies.isKey('token')" :key="componentKey">
            <h2>LogOut</h2>
            <div v-if="errorFlag" style="color: red;">
                {{ error }}
            </div>
                <form id="app" v-on:submit.prevent="LogoutUser()" >
                    <input type="submit" value="LogOut">  
                </form>

        </div>

        <!-- login and regiester -->
        <div v-else :key="componentKey">
            <div>
                <h2>Register</h2>
                <div v-if="errorFlag" style="color: red;">
                    {{ error }}
                </div>
                <form id="app" method="post" v-on:submit.prevent="CreateUser()" >
                    <table>  
                        <tr>
                            <td><label for="Name">Name:</label></td>
                            <td><input type="text" id="Name" name="name" value="" v-model="name"><br><br></td>
                        </tr>
                        <tr>
                            <td><label for="Email">Email:</label></td>
                            <td><input type="text" id="Email" name="email" value="" v-model="email"><br><br></td>
                        </tr>
                        <tr>
                            <td><label for="Password">Password:</label></td>
                            <td><input type="password" id="Password" name="password" value="" v-model="password"><br><br></td>
                        </tr>
                        <tr>
                            <td><label for="City">City:</label></td>
                            <td><input type="text" id="City" name="city" value="" v-model="city"><br><br></td>
                        </tr>
                        <tr>
                            <td><label for="Country">Country:</label></td>
                            <td><input type="text" id="Country" name="country" value="" v-model="country"><br><br></td>
                        </tr>
                        <tr>
                            <td><label for="file-input">Picture:</label></td>
                            <td><input type="file" accept="image/*" @change="setImage($event)" id="file-input"><br><br></td>
                        </tr>
                    </table>  
                    <input type="submit" value="Submit">    
                </form>
            </div>

            <div>
                <h2>Login</h2>
                <form id="app" method="post" v-on:submit.prevent="LoginUser()" >
                    <table>  
                        <tr>
                            <td><label for="Email">Email:</label></td>
                            <td><input type="text" id="Email" name="email" value="" v-model="email"><br><br></td>
                        </tr>
                        <tr>
                            <td><label for="Password">Password:</label></td>
                            <td><input type="password" id="Password" name="password" value="" v-model="password"><br><br></td>
                        </tr>
                    </table>  
                    <input type="submit" value="Submit">
                    
                </form>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        data (){
            return{
                error: "",
                errorFlag: false,
                name: null,
                email: null,
                password: null,
                city: null,
                country: null,
                pict: null,

                result: [],

                componentKey: 0
            }
        },
        mounted: function() {
            this.GetUsersINFO(); 
        },
        methods: {
            GetUsersINFO: function() {
                console.log("User ID:",this.$cookies.get('id'));
            },
            setImage: function(event) {
                this.pict = event.target.files[0];
                console.log("THIS", this.pict);
            },
            uploadImage: function() {
                var base = "http://localhost:4941/api/v1/users/" + this.$cookies.get('userId') + "/photo" ;
                console.log("UPLOADING PIC",base);

                if (this.pict != null) {
                    let extension = this.pict.name.split('.').pop();
                    console.log(this.pict);
                    if (extension.toLowerCase() == "jpg") {
                        extension = "jpeg"
                    }
                    extension = "image/" + extension.toLowerCase();
                    this.$http.put(base, this.pict, { headers: { 'X-Authorization':this.$cookies.get('token'), 'Content-Type':extension }})
                    .then((response) => {
                        console.log("UPLOADED");
                    })
                    .catch((error) => {
                        console.log("err");
                        //this.error = error;
                        //this.errorFlag = true;
                    });
                }
            },

            LogoutUser: function() {
                this.$cookies.remove('userId');
                this.$cookies.remove('token');
                this.componentKey +=1;
            },

            LoginUser: function() {
                console.log("email:",this.email);
                console.log("password:",this.password);
                var base = "http://localhost:4941/api/v1/users/login";

                var postRew = {
                "email": this.email,
                "password": this.password,
                };

                console.log(postRew)

                this.$http.post(base, postRew)
                .then((response) => {
                    this.errorFlag = false;
                    this.result = response.data;
                    //window.alert(this.result.userId,this.result.token);
                    //window.alert(this.result.token);
                    this.$cookies.set('userId',this.result.userId);
                    this.$cookies.set('token',this.result.token);
                    this.componentKey +=1;
                })
                .catch((error) => {
                    alert("there was error with your inputs. please try again");
                    //this.error = error;
                    //this.errorFlag = true;
                });
            },

            CreateUser: function(e) {
                console.log("name:",this.name);
                console.log("email:",this.email);
                console.log("password:",this.password);
                console.log("city:",this.city);
                console.log("country:",this.country);

                var base = "http://localhost:4941/api/v1/users/register";



                var postRew = {
                "name": this.name,
                "email": this.email,
                "password": this.password,
                };

                if (this.city !== "" && this.city != null){
                    postRew["city"] = this.city;
                }

                if (this.country !== "" && this.country != null){
                    postRew["country"] = this.country;
                }
                

                console.log(postRew)

                this.$http.post(base, postRew)
                .then((response) => {
                    this.errorFlag = false;
                    this.result = response.data;
                    this.$cookies.set('userId',this.result.userId);
                    
                    this.LoginUser();

                    this.uploadImage();
                })
                .catch((error) => {
                    alert("there was error with your inputs. please try again");
                    //this.error = error;
                    //this.errorFlag = true;
                });
            },

        }
    }
</script>

<template>
    <div>
        <!-- link and title -->
        <h1>User</h1><br>
        <router-link :to="{ name: 'home'}">Home</router-link>
        <router-link :to="{ name: 'petitions'}">Petitions</router-link>
        <router-link :to="{ name: 'mypetitions'}">My petitions</router-link>
        <div v-if="this.$cookies.isKey('token')">
            <router-link :to="{ name: 'login'}">Logout</router-link>
        </div>
        <div v-else>
            <router-link :to="{ name: 'login'}">Register/login</router-link>
        </div>

        <div>
            <div v-if="picture">
                    <img :src="'http://localhost:4941/api/v1/users/' + this.$cookies.get('userId') +'/photo'" style="width:200px;"/>
            </div>


            <table>         
                <tr>
                    <td>Name:</td>
                    <td>{{ results.name }}</td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td>{{ results.email }}</td>
                </tr>
                <tr>
                    <td>City:</td>
                    <td>{{ results.city }}</td>
                </tr>
                <tr>
                    <td>Country:</td>
                    <td>{{ results.country }}</td>
                </tr>
            </table>
        </div>
        <h2>Update info</h2>
        <h4>leave blank what you want to be unchanged.</h4>
        <div>
            <form id="app" v-on:submit.prevent="updateUser()" >
                <table>  
                    <tr>
                        <td><label for="Name">New Name:</label></td>
                        <td><input type="text" id="Name" name="name" value="" v-model="newName"><br><br></td>
                    </tr>
                    <tr>
                        <td><label for="Email">New Email:</label></td>
                        <td><input type="text" id="Email" name="email" value="" v-model="newEmail"><br><br></td>
                    </tr>
                    <tr>
                        <td><label for="Password">New Password:</label></td>
                        <td><input type="password" id="Password" name="password" value="" v-model="newPassword"><br><br></td>
                    </tr>
                    <tr>
                        <td><label for="Password">Old Password:</label></td>
                        <td><input type="password" id="Password" name="currentPassword" value="" v-model="oldPassword"><br><br></td>
                    </tr>
                    <tr>
                        <td><label for="City">New City:</label></td>
                        <td><input type="text" id="City" name="city" value="" v-model="NewCity"><br><br></td>
                    </tr>
                    <tr>
                        <td><label for="Country">New Country:</label></td>
                        <td><input type="text" id="Country" name="country" value="" v-model="newCountry"><br><br></td>
                    </tr>
                    <tr>
                        <td><label for="file-input">New Picture:</label></td>
                        <td><input type="file" accept="image/*" @change="setImage($event)" id="file-input"><br></td>
                    </tr>
                    
                </table>  
                <input type="submit" value="Submit">    
            </form>
        </div>
    </div>


</template>


<script>
    export default {
        data (){
            return{
                error: "",
                errorFlag: false,
                results: '',
                newName: '',
                newEmail: '',
                newPassword: '',
                oldPassword: '',
                NewCity: '',
                newCountry: '',
                picture: '',
                pict: null,
            }
        },
        mounted: function() {
            this.GetUsers();
        },
        methods: {
            updateUser: function(){
                var base = "http://localhost:4941/api/v1/users/" + this.$cookies.get('userId');

                var postRew = { };

                if (this.newName !== "" && this.newName != null){
                    postRew["name"] = this.newName;
                }
                if (this.newEmail !== "" && this.newEmail != null){
                    postRew["email"] = this.newEmail;
                }
                if (this.newPassword !== "" && this.newPassword != null){
                    postRew["password"] = this.newPassword;
                }
                if (this.oldPassword !== "" && this.oldPassword != null){
                    postRew["currentPassword"] = this.oldPassword;
                }
                if (this.NewCity !== "" && this.NewCity != null){
                    postRew["city"] = this.NewCity;
                }
                if (this.newCountry !== "" && this.newCountry != null){
                    postRew["country"] = this.newCountry;
                }
                

                console.log(postRew)
                if(Object.keys(postRew).length === 0){
                    this.uploadImage();
                    this.GetUsers();
                    this.GetUserPicture(this.$cookies.get('userId'));
                    return;
                }

                this.$http.patch(base, postRew, { headers: {'X-Authorization':this.$cookies.get('token')}})
                .then((response) => {
                    this.errorFlag = false;
                    this.result = response.data;
                    this.uploadImage();
                    this.GetUsers();
                    this.GetUserPicture(this.$cookies.get('userId'));
                    
                })
                .catch((error) => {
                    alert("there was error with your inputs. please try again");
                    //this.error = error;
                    //this.errorFlag = true;
                });
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
            GetUserPicture: function(id) {
                var base = "http://localhost:4941/api/v1/users/" + id +"/photo";

                console.log(base);

                this.$http.get(base)
                .then((response) => {
                    this.picture = true;
                })
                .catch((error) => {
                    this.picture = false;
                });
            },
            GetUsers: function() {
                var base = "http://localhost:4941/api/v1/users/" + this.$cookies.get('userId');
                console.log("STRING TO THE API:",base);

                this.$http.get(base, { headers: {'X-Authorization':this.$cookies.get('token')}})
                .then((response) => {
                    this.results = response.data;
                    this.GetUserPicture(this.$cookies.get('userId'))
                    
                })
                .catch((error) => {
                    alert(error)
                    //this.error = error;
                    //this.errorFlag = true;
                });
                },

            },
        }

</script>
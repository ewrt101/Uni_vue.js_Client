<template>
    <div>
        <!-- link and title -->
        <h1>My Petitions</h1><br>
        <router-link :to="{ name: 'home'}">Home</router-link>
        <router-link :to="{ name: 'petitions'}">Petitions</router-link>
        <div v-if="this.$cookies.isKey('userId')">
            <router-link :to="{ name: 'users'}">Profile</router-link>
        </div>
        <div v-if="this.$cookies.isKey('token')">
            <router-link :to="{ name: 'login'}">Logout</router-link>
        </div>
        <div v-else>
            <router-link :to="{ name: 'login'}">Register/login</router-link>
        </div>


        <div v-if="errorFlag" style="color: red;">
        {{ error }}
        </div>
        <div v-if="$route.params.petitionId">
            <div id="petition">
                <br>
                <router-link :to="{ name: 'mypetitions'}">Back to Petitions</router-link><br>
                
                <b>{{ petition.title }}</b>
                <div v-if="picture">
                    <img :src="'http://localhost:4941/api/v1/petitions/' + this.$route.params.petitionId +'/photo'" style="width:500px;"/>
                </div>
                <table>
                    <tr>
                        <td>Description:</td>
                        <td>{{ petition.description }}</td>
                    </tr>
                    <tr>
                        <td>Author Name:</td>
                        <td>{{ petition.authorName }}</td>
                    </tr>
                    <tr v-if="petition.authorCity != null">
                        <td>Author City:</td>
                        <td>{{ petition.authorCity }}</td>
                    </tr>
                    <tr v-if="petition.authorCountry != null">
                        <td>Author Country:</td>
                        <td>{{ petition.authorCountry }}</td>
                    </tr>
                    <tr>
                        <td>Signature Count:</td>
                        <td>{{ petition.signatureCount }}</td>
                    </tr>
                    <tr>
                        <td>Category:</td>
                        <td>{{ petition.category }}</td>
                    </tr>
                    <tr>
                        <td>Created Date:</td>
                        <td>{{ petition.createdDate }}</td>
                    </tr>
                    <tr v-if="petition.closingDate != null">
                        <td>Closing Date:</td>
                        <td>{{ petition.closingDate }}</td>
                    </tr>
                    <tr v-else>
                        <td>Closing Date:</td>
                        <td>No closing date</td>
                    </tr>

                    <tr>
                        <h4>signatories</h4>
                        <ul v-for="sig in sigs">
                            <li>
                                <b>{{ sig.name }}</b>
                                <table>
                                    <tr>
                                        <td>city:</td>
                                        <td>{{ sig.city }}</td>
                                    </tr>
                                    <tr>
                                        <td>country:</td>
                                        <td>{{ sig.country }}</td>
                                    </tr>
                                    <tr>
                                        <td>signedDate:</td>
                                        <td>{{ sig.signedDate }}</td>
                                    </tr>
                                </table>
                            </li>
                        </ul>
                    </tr>
                    
                </table> 
                <br>
                <b>share:</b><br>

                <ShareNetwork
                    network="facebook"
                    :url="'www.canterbury.ac.nz/petition/' + this.$route.params.petitionId"
                    :title="petition.title"
                    :description="petition.description"
                    :quote="petition.title"
                    hashtags="UC,not-real "
                >
                    <button>Share on Facebook</button>
                </ShareNetwork>
                <br>
                <ShareNetwork
                    network="twitter"
                    :url="'www.canterbury.ac.nz/petition/' + this.$route.params.petitionId"
                    :title="petition.title"
                    hashtags="UC,not-real "
                >
                    <button>Share on Twitter</button>
                </ShareNetwork>
                <br>
                <ShareNetwork
                    network="email"
                    :url="'www.canterbury.ac.nz/petition/' + this.$route.params.petitionId"
                    :title="petition.title"
                    :description="petition.description"
                >
                    <button>Share with email</button>
                </ShareNetwork>
                <br><br>
                <form id="app" v-on:submit.prevent="editPet()" v-if="inpass">
                    <input type="submit" value="Edit Petition">
                </form>
                <form id="app" v-on:submit.prevent="removePet()">
                    <input type="submit" value="Delete Petition">
                </form>
                
            </div>
        </div>
        <div v-else>
            <div id="petitions">
                Current categories:
                <ul v-for="cat in cats">
                    <li>
                        {{ cat.categoryId }} . {{ cat.name }}
                    </li>
                </ul>
                <form id="app" v-on:submit.prevent="MakeNew()">
                    <input type="file" accept="image/*" @change="setImage($event)" id="file-input"><br>
                    <input type="submit" value="Create New Petition">
                </form>
                <br>

                <ul v-for="petition in petitions">
                    <li>
                        <b>{{ petition.title }}</b>
                        <table>         
                            <tr>
                                <td>category:</td>
                                <td>{{ petition.category }}</td>
                            </tr>
                            <tr>
                                <td>authorName:</td>
                                <td>{{ petition.authorName }}</td>
                            </tr>
                            <tr>
                                <td>signatureCount:</td>
                                <td>{{ petition.signatureCount }}</td>
                            </tr>
                        </table>
                        <router-link v-model="singleView" :to="{ name: 'mypetition', params: { petitionId: petition.petitionId}}">View</router-link>
                    </li>
                </ul>
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
                petitions: [],
                petition: [],
                sigs: [],
                count: 0,
                cats: [],
                picture: false,
                inpass: false,
                pict: null,
            }
        },
        mounted: function() {
            this.getPetitions(this.$route.query);
            this.getSinglePetition(this.$route.params.petitionId);
            this.GetCats();
        },

        watch: {
            '$route' (to, from) {
                this.getSinglePetition(this.$route.params.petitionId);
            }
        },
        methods: {

            removePet: function() {
                this.$http.delete("http://localhost:4941/api/v1/petitions/" + this.$route.params.petitionId, { headers: {'X-Authorization':this.$cookies.get('token')}})
                .then((response) => {
                    this.$router.push({ name: 'mypetitions'});
                    this.getPetitions();
                })
                .catch((error) => {
                    this.error = error;
                    this.errorFlag = true;
                });
            },
            setImage: function(event) {
                this.pict = event.target.files[0];
                console.log("THIS", this.pict);
            },
            uploadImage: function(id) {
                var base = "http://localhost:4941/api/v1/petitions/" + id + "/photo" ;
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
            editPet: function() {
                var base = "http://localhost:4941/api/v1/petitions/" + this.$route.params.petitionId;

                console.log("URL:", base);

                var postRew = { };
                var title =prompt("New title (leave blank to not change)", "");
                if (title !== "" && title != null){
                    postRew["title"] = title;
                }

                var description = prompt("New description (leave blank to not change)", "");
                if (description !== "" && description != null){
                    postRew["description"] = description;
                }

                var categoryId = prompt("New categoryId (leave blank to not change)", "");
                if (categoryId !== "" && categoryId != null){
                    postRew["categoryId"] = parseInt(categoryId);
                }


                var date =prompt("New end date (CAN NOT BE IN THE PASS)", "2021-01-01 00:00:00.000");
                if (date !== "" && date != null){
                    postRew["closingDate"] = date;
                }

                if (postRew == JSON.stringify({})){
                    alert("Nothing changed");
                    return;
                }
                var then = new Date(date);
                var now = new Date();

                if(then < now && date !== "" && date != null){
                    alert("Date is in the pass");
                    return;
                }

                console.log(postRew);
                this.$http.patch(base, postRew, { headers: {'X-Authorization':this.$cookies.get('token')}} )
                .then((response) => {
                    //this.picture = true;
                    this.getSinglePetition(this.$route.params.petitionId);
                })
                .catch((error) => {
                    alert("categoryId error");
                    //this.error = error;
                    //this.errorFlag = true;
                });
            },
            GetPetPicture: function() {
                var base = "http://localhost:4941/api/v1/petitions/" + this.$route.params.petitionId +"/photo";

                console.log("URL:", base);

                this.$http.get(base)
                .then((response) => {
                    this.picture = true;
                })
                .catch((error) => {
                    this.picture = false;
                    //this.error = error;
                    //this.errorFlag = true;
                });
            },
            GetUsersINFO: function() {
                console.log("User ID:",this.$cookies.get('userId'));
            },
            GetCats: function() {
                this.$http.get("http://localhost:4941/api/v1/petitions/categories")
                .then((response) => {
                    this.cats = response.data;
                })
                .catch((error) => {
                    this.error = error;
                    this.errorFlag = true;
                });
            },
            MakeNew: function() {

                if (this.pict == null){
                    alert("add picture");
                    return;
                }

                var title = prompt("Please enter a title", "example");
                var description = prompt("Please enter a description", "this is a example");
                var categoryId = prompt("Please enter a categoryId", "1");
                //var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
                //var today = new Date();
                var date = prompt("Please enter closing a date (can leave blank)",'2021-01-01 00:00:00.000', );
                //var date = prompt("Please enter a date (can leave blank)", today.getDate()+"-"+monthNames[today.getMonth()]+"-"+today.getFullYear());

                if (title === ""){
                    alert("no title added");
                    return
                }
                categoryId = parseInt(categoryId);
                if (categoryId < 0 || categoryId > this.cats.length){
                    alert("Wrong categoryId used");
                    return
                }
                if (description === ""){
                    alert("no description added");
                    return
                }

                var then = new Date(date);
                var now = new Date();
                if(then < now && date !== "" && date != null){
                    alert("Date is in the pass");
                    return;
                }

                var base = "http://localhost:4941/api/v1/petitions";
                var postRew = { };
                postRew["title"] = title;
                postRew["description"] = description;
                postRew["categoryId"] = categoryId;
                if (date !== "" && date != null){
                    postRew["closingDate"] = date;
                }

                this.$http.post(base,postRew, { headers: {'X-Authorization':this.$cookies.get('token')}})
                .then((response) => {
                    //this.petitions = response.data;
                    alert("added petition")
                    this.addSign(response.data.petitionId);
                    this.uploadImage(response.data.petitionId);
                    this.getPetitions();
                })
                .catch((error) => {
                    alert("there was error with your inputs. please try again");
                    //this.error = error;
                    //this.errorFlag = true;
                });
            },
            addSign: function(id) {
                var base = "http://localhost:4941/api/v1/petitions/" + id +"/signatures";
                
                this.$http.post(base, "" , { headers: {'X-Authorization':this.$cookies.get('token')}})
                .then((response) => {

                })
                .catch((error) => {
                    this.error = error;
                    this.errorFlag = true;
                });
            },

            getPetitions: function(query) {
                var base = "http://localhost:4941/api/v1/petitions?authorId=" + this.$cookies.get('userId');

                console.log("STRING TO THE API:",base);
                this.$http.get(base)
                .then((response) => {
                    this.petitions = response.data;


                })
                .catch((error) => {
                    this.error = error;
                    this.errorFlag = true;
                });
            },

            getSinglePetition: function(id){
                if (id == null){
                    return;
                }
                this.$http.get('http://localhost:4941/api/v1/petitions/' + id)
                .then((response) => {
                this.petition = response.data;

                var then = new Date(response.data.closingDate);
                var now = new Date();

                if(then < now){
                    this.inpass = false;
                }else{
                    this.inpass = true;
                }
                this.getSigs(id);
                this.GetPetPicture();
            })
            .catch((error) => {
                this.error = error;
                this.errorFlag = true;
            });
            },
            getSigs: function(id){
                this.$http.get('http://localhost:4941/api/v1/petitions/' + id + '/signatures')
                .then((response) => {
                this.sigs = response.data;
            })
            .catch((error) => {
                this.error = error;
                this.errorFlag = true;
            });
            },


        }
    }
</script>

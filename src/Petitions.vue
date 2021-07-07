<template>
    <div>
        <!-- link and title -->
        <h1>Petitions Page</h1><br>
        <router-link :to="{ name: 'home'}">Home</router-link>
        <div v-if="this.$cookies.isKey('userId')">
            <router-link :to="{ name: 'users'}">Profile</router-link>
            <router-link :to="{ name: 'mypetitions'}">My petitions</router-link>
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
                <!--{{getSinglePetition($route.params.petitionId) }}-->
                <br>
                <router-link :to="{ name: 'petitions'}">Back to Petitions</router-link><br>
                
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
                    </table> 
                    <div v-if="this.$cookies.isKey('userId')">
                        <div v-if="inpass">
                            <div v-if="this.$cookies.get('userId') != this.petition.authorId">
                                <form v-if="this.yes == 1" v-on:submit.prevent="removeSign()" :key="componentKey">
                                    <input type="submit" value="Unsign">
                                </form>
                                <form v-else id="app" v-on:submit.prevent="addSign()">
                                    <input type="submit" value="Sign">
                                </form>
                            </div>
                        </div>
                    </div>

                    <tr>
                        <h4>signatories</h4>
                        <ul v-for="sig in sigs">
                            <li>
                                <b>{{ sig.name }}</b>
                                <div v-if="picture">
                                    <img :src="'http://localhost:4941/api/v1/users/' + sig.signatoryId +'/photo'" style="width:50px;"/>
                                </div>
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
                    :description="petition.description">
                    <button>Share with email</button>
                </ShareNetwork>
                
            </div>
        </div>
        <div v-else>
            <div id="petitions">
                <form id="app" method="get">
                    <input type="radio" id="A-Z" name="sortBy" value="ALPHABETICAL_ASC">
                    <label for="Z-A">A-Z</label>
                    <input type="radio" id="Z-A" name="sortBy" value="ALPHABETICAL_DESC">
                    <label for="Z-A">Z-A</label>
                    <input type="radio" id="most to least" name="sortBy" value="SIGNATURES_DESC">
                    <label for="most to least">most to least</label>
                    <input type="radio" id="least to most" name="sortBy" value="SIGNATURES_ASC">
                    <label for="least to most">least to most</label>
                    <br>
                    <label for="categoryId">Category:</label>
                    <select id="categoryId" name="categoryId">
                        <option value=1>Animals</option>
                        <option value=2>Environment</option>
                        <option value=3>Entertainment</option>
                        <option value=4>Human rights</option>
                        <option value=5>Immigration</option>
                        <option value=6>Justice</option>
                        <option value=7>Other</option>
                    </select> 
                    <input type="checkbox" id="categoryId_use" name="categoryId_use" value="yes">
                    <br>
                    <label for="Search">Search:</label>
                    <input type="text" id="Search" name="q" value=""><br><br>
                    

                    <input type="submit" value="Submit">
                </form>

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
                        <router-link v-model="singleView" :to="{ name: 'petition', params: { petitionId: petition.petitionId}}">View</router-link>
                    </li>
                </ul>
                <!-- last button start-->
                <div>
                    <form v-if="this.count != 0" v-on:submit.prevent="searchPetitions(-10, this.$route.query)">
                        
                        <input type="submit" value="LastPage" >
                    </form>

                    <form v-else v-on:submit.prevent="searchPetitions(-10)" >
                        
                        <input type="submit" value="LastPage" disabled>
                    </form>
                </div>
                <!-- last button end-->

                <form  v-on:submit.prevent="searchPetitions(10)">
                    
                    <input type="submit" value="NextPage">
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
                petitions: [],
                petition: [],
                sigs: [],
                count: 0,
                yes: 0,
                componentKey: 0,
                picture: false,
                mine: 0,
                inpass: false,

            }
        },
        mounted: function() {
            this.getPetitions(this.$route.query);
            this.getSinglePetition(this.$route.params.petitionId);
        },

        watch: {
            '$route' (to, from) {
                this.getSinglePetition(this.$route.params.petitionId);
            }
        },
        methods: {

            GetUsersINFO: function() {
                console.log("User ID:",this.$cookies.get('userId'));
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
            addSign: function() {
                var base = "http://localhost:4941/api/v1/petitions/" + this.$route.params.petitionId +"/signatures";

                console.log("URL:", base);
                console.log("TOKEN",this.$cookies.get('token'));
                
                this.$http.post(base, "" , { headers: {'X-Authorization':this.$cookies.get('token')}})
                .then((response) => {
                    //alert("added")
                    console.log(status);

                    this.componentKey +=1;
                    this.getSigs(this.$route.params.petitionId);
                })
                .catch((error) => {
                    console.log(error.response.status);
                    if(error.response.status == 403){
                        alert("already closed");
                    }else{
                        this.error = error;
                        this.errorFlag = true;
                    }
                    
                });
            },
            removeSign: function() {
                var base = "http://localhost:4941/api/v1/petitions/" + this.$route.params.petitionId +"/signatures";

                console.log("URL:", base);
                console.log("TOKEN",this.$cookies.get('token'));
                
                this.$http.delete(base, { headers: {'X-Authorization':this.$cookies.get('token')}})
                .then((response) => {
                    //alert("removed")
                    this.componentKey +=1;
                    this.getSigs(this.$route.params.petitionId);
                    
                })
                .catch((error) => {
                    this.error = error;
                    this.errorFlag = true;
                });
            },

            getPetitions: function(query) {
                var base = "http://localhost:4941/api/v1/petitions?count=10";

                if (query.sortBy != null){
                    base += "&sortBy=" + query.sortBy;
                }
                if (query.q != null && query.q !== ""){
                    base += "&q=" + query.q;
                }
                if (query.categoryId_use == "yes"){
                    base += "&categoryId=" + query.categoryId;
                }
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
                console.log(then,now);
                if(then < now && response.data.closingDate != null){
                    this.inpass = false;
                }else{
                    this.inpass = true;
                }

                this.GetPetPicture();
                this.getSigs(id);
                
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
                var item_;
                this.yes = 0;
                try{
                    var i;
                    var len;
                    for (i = 0, len = response.data.length; i < len; i++){
                        if (response.data[i].signatoryId == this.$cookies.get('userId')){
                            this.yes = 1;
                            break;
                        }
                    }
                }catch (err){

                }

            })
            .catch((error) => {
                this.error = error;
                this.errorFlag = true;
            });
            },

            searchPetitions: function(count){
                console.log("parms:", this.$route.query);
                this.count += count;
                var base = "http://localhost:4941/api/v1/petitions?count=10&startIndex=" + this.count;
                
                if (this.$route.query.sortBy != null){
                    base += "&sortBy=" + this.$route.query.sortBy;
                }
                if (this.$route.query.q != null && this.$route.query.q !== ""){
                    base += "&q=" + this.$route.query.q;
                }
                if (this.$route.query.categoryId_use == "yes"){
                    base += "&categoryId=" + this.$route.query.categoryId;
                }
                
                
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

        }
    }
</script>

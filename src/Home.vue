<template>
    <div>
        <!-- link and title -->
        <h1>Home Page</h1><br>
        <router-link :to="{ name: 'petitions'}">Petitions</router-link>
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
    </div>
</template>
<script>
    export default {
        data (){
            return{
                error: "",
                errorFlag: false,
            }
        },
        mounted: function() {
            this.GetUsersINFO();
        },
        methods: {
            GetUsersINFO: function() {
                console.log("User ID:",this.$cookies.get('userId'));
            },

        }
    }
</script>


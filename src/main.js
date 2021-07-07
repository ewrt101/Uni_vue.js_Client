import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue';
import Petitions from './Petitions.vue';
import myPetitions from './myPetitions.vue';
import User from './User.vue';
import Login from './Login.vue';


import VueRouter from 'vue-router';
Vue.use(VueRouter);

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

import VueSocialSharing from 'vue-social-sharing';
Vue.use(VueSocialSharing);

Vue.use(require('js-cookie'));
Vue.use(require('vue-cookies'));


const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/petition/:petitionId",
    name: "petition",
    component: Petitions
  },
  {
    path: '/petitions',
    name: "petitions",
    component: Petitions
  },
  {
    path: "/mypetition/:petitionId",
    name: "mypetition",
    component: myPetitions
  },
  {
    path: "/mypetition/:petitionId",
    name: "mypetitionEdit",
    component: myPetitions
  },
  {
    path: '/mypetitions',
    name: "mypetitions",
    component: myPetitions
  },
  {
    path: '/User',
    name: "users",
    component: User
  },
  {
    path: '/login',
    name: "login",
    component: Login
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});
  
  

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})

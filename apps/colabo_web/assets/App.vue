<template>
  <div id="app">
   <!-- <img src="./static/images/aoba_suzukaze.png"> -->
    <router-view/>
  </div>
</template>

<script>

import {initializeColabo} from './js/socket'
import {EventBus} from './main.js'

export default {
  name: 'App',
  created(){
    let colabo = initializeColabo()
    console.log('APP CREATED')
    colabo.join()
    .receive("ok", tok => {
      console.log('Joined colabo lobby.')
      EventBus.$emit('lobby_joined')
    })
    .receive("error", resp => { console.log("Unable to join", resp) })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
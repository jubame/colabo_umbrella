<template>
  <textarea v-model="content" @input="onTextChange"></textarea>
</template>

<script>

import diff_match_patch from "diff_match_patch"
let dmp = new diff_match_patch.diff_match_patch();
import {EventBus} from '../main.js'
import {colabo} from '../js/socket.js'

export default {
  name: 'Editor',
  data() {
      return {
        content: '',
        previousContent: '',
        hasChanged: false
      }
  },

  created() {
    //alert("CREATED")
    
    setInterval(
      this.push,
      5000
    );

    EventBus.$on('new_diff', 
      (patches) => {
        let wasPatchedArray
        console.log('EventBus: new_diff received')
        console.log(patches)
        console.log('Patch es')
        let appliedPatchResult = dmp.patch_apply(patches, this.content)
        this.content = appliedPatchResult[0]
      }
    );


  },


  methods: {
    push() {
      if (this.hasChanged){
        //alert("PUSH")
        console.log(this.previousContent)
        console.log(this.content)

        // let d = dmp.diff_main(this.previousContent, this.content)
        let d = dmp.patch_make(this.previousContent, this.content)
        console.log(d)
        colabo.push(d)

        this.hasChanged = false
        this.previousContent = this.content
      }
    },


    onTextChange(text) {
      //console.log(text)
      this.hasChanged = true
      
      //alert(this.content + "__" + this.previousContent)
      
    }


  }

  
}
</script>

<style>
textarea {
    width: 80%;
    height: 90%;
    margin: auto;
}
</style>
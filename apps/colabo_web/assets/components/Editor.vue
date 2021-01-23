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
      (patch) => {
        this.onNewDiff(patch)
      }
    );

    EventBus.$on('lobby_joined', () => {
      console.log('lobby_joined')
      //console.log(colabo.getDiffs())
      
      colabo.getDiffs().receive("ok", patches => {
        let appliedPatchResult
        for(var patch of patches) {
          appliedPatchResult = dmp.patch_apply(patch, this.content)
          this.previousContent = appliedPatchResult[0]
          this.content = appliedPatchResult[0]
        }
      })
      .receive("error", response => {
        console.log('Error getting diffs')
      })
    });


  },


  methods: {
    push() {
      if (this.hasChanged){
        //alert("PUSH")
        console.log("PATCH MAKE")
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
      
    },

    onNewDiff(patch) {
      let wasPatchedArray
      console.log('EventBus: new_diff received')
      console.log('Patch es')
      console.log(patch)
      console.log('content es')
      console.log(this.content)
      let appliedPatchResult = dmp.patch_apply(patch, this.content)
      console.log('appliedPatchResult es')
      console.log(appliedPatchResult[0])
      this.previousContent = appliedPatchResult[0]
      this.content = appliedPatchResult[0]

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
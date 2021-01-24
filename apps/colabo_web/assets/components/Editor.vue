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
      console.log('Editor.vue: received lobby_joined event')
      
      colabo.getDiffs().receive("ok", patches => {
        
        for(var patch of patches) {
          this.apply_patch(patch)
        }
        console.log('***************')
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
        console.log('---------------')
        console.log('Making patch:')
        console.log(`from: ${this.previousContent}`)
        console.log(`to: ${this.content}`)

        // let d = dmp.diff_main(this.previousContent, this.content)
        let patch = dmp.patch_make(this.previousContent, this.content)
        console.log(patch)
        colabo.push(patch)
        console.log('---------------')

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
      console.log('Editor.vue: new_diff event received')
      this.apply_patch(patch)
      console.log('***************')
    },

    apply_patch(patch) {
      let appliedPatchResult
      console.log('***************')
      console.log('Applying patch:')
      console.log(patch)
      console.log(`over: ${this.content}`)
      appliedPatchResult = dmp.patch_apply(patch, this.content)
      console.log(`result: ${appliedPatchResult[0]}`)
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
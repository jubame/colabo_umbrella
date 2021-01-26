<template>
  <div id="editor">
    <label for="push-interval">Push interval if textarea changed (in milliseconds):</label>
    <input type="text" id="push-interval" v-model="pushInterval" @blur="resetInterval" >
    <textarea id="my-textarea" v-model="content" @input="onTextChange" :disabled="disabled"></textarea>
  </div>
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
        hasChanged: false,
        pushInterval: 1000,
        pushIntervalTimer: null,
        disabled: true
      }
  },

  created() {
    //alert("CREATED")
    
    this.pushIntervalTimer = setInterval(
      this.push,
      this.pushInterval
    );

    EventBus.$on('new_diff', 
      (patch) => {
        this.onNewDiff(patch)
      }
    );

    EventBus.$on('socket_error', 
      () => {
        this.disabled = true
      }
    );

    EventBus.$on('heartbeat_timeout', 
      () => {
        this.disabled = true
      }
    );

    EventBus.$on('lobby_joined', () => {
      console.log('Editor.vue: received lobby_joined event')
      /* 
      Reset previousContent and content in case we are rejoining after
      connection loss, because all patches are going to be reapplied,
      and that requires starting with an empty string.
      */
      this.previousContent = ''
      this.content = ''
      
      colabo.getDiffs().receive("ok", patches => {
        
        for(var patch of patches) {
          this.apply_patch(patch)
        }
        console.log('***************')
        this.disabled = false
      })
      .receive("error", response => {
        console.log('Error getting diffs')
      })
    });

    // https://stackoverflow.com/a/58294874
    document.addEventListener('selectionchange', this.handleSelection)

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

    handleSelection() {
      
      const activeElement = document.activeElement

      // make sure this is your textarea
      if (activeElement && activeElement.id === 'my-textarea') {
        console.log("SELECT")
        const range = {
          start: activeElement.selectionStart,
          end: activeElement.selectionEnd
        }
        // do something with your range
      }
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

    },

    resetInterval(){
      clearInterval(this.pushIntervalTimer)
      setInterval(
        this.push,
        this.pushInterval
      );
    }


  }

  
}
</script>

<style>

#editor {
  margin: 20px 10%;
  height: 100%;
  text-align: left;
}

#editor label {
  display: inline;
}

#push-interval {
  display: inline;
  width: 200px;
}

textarea {
    height: 90%;
    margin: 20px auto;
}

textarea:disabled {
  background: red;
}

</style>
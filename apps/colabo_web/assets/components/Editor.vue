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
        hasSelectionChanged: false,
        range: null,
        pushInterval: 1000,
        pushSelectionRangeInterval: 500,
        pushIntervalTimer: null,
        disabled: true,
        lastSelectionContentLength: 0,
        lastSelectionTime: null
      }
  },

  created() {
    //alert("CREATED")
    
    this.pushIntervalTimer = setInterval(
      this.push,
      this.pushInterval
    );

    setInterval(
      this.pushSelectedRange,
      this.pushSelectionRangeInterval
    );

    EventBus.$on('new_diff', 
      (patch) => {
        this.onNewDiff(patch)
      }
    );

    EventBus.$on('selection_range', 
      (range) => {
        console.log("received selection_range")
        let textArea = document.getElementById("my-textarea");
        /*
        https://stackoverflow.com/a/7486518
        Cambiar selección de texto
        */
        textArea.focus()
        textArea.selectionStart = range.start
        textArea.selectionEnd = range.end
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

    pushSelectedRange(){
      if(this.hasSelectionChanged){
        colabo.pushSelectionRange(this.range)
        this.hasSelectionChanged = false
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
        this.range = {
          start: activeElement.selectionStart,
          end: activeElement.selectionEnd
        }
        // do something with your range
        console.log(this.range.start)
        console.log(this.range.end)
        /*
        Avoid sending range changes when text is being added or deleted,
        because I push every this.pushInterval and new text might not have been
        sent yet to the server (and therefore to the rest of clients).
        I am not using this.hasChanged from onTextChange because both
        onTextChange and this function fire at the same time (I would
        need for onTextChange to execute first).
        */
        if(this.lastSelectionContentLength == this.content.length){
          this.hasSelectionChanged = true
        }

        this.lastSelectionContentLength = this.content.length
        
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
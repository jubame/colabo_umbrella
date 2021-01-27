<template>
  <div id="editor">
    <label for="push-interval">Push interval if textarea changed (in milliseconds):</label>
    <input type="text" id="push-interval" v-model="pushInterval" @blur="resetInterval" >
    <HilightTextArea
        v-model="content"
        :segments="segments"
        :selection="selection"
        @input="onTextChange"
        @update:selection="handleSelection($event)"
      />
    <!--<textarea id="my-textarea" v-model="content" @input="onTextChange" :disabled="disabled"></textarea>-->
    <span>Last message received: type {{lastMsgMeta.type}}, from: {{lastMsgMeta.peerData}}</span>
  </div>
</template>

<script>
import HilightTextArea from "./HilightTextArea.vue";

import diff_match_patch from "diff_match_patch"
let dmp = new diff_match_patch.diff_match_patch();
import {EventBus} from '../main.js'
import {colabo} from '../js/socket.js'

export default {
  name: 'Editor',
  components: {
    HilightTextArea
  },
  data() {
      return {
        content: '',
        previousContent: '',
        hasContentChanged: false,
        hasSelectionChanged: false,
        selection: {
          start: 0,
          end: 0,
          direction: "none"
        },
        segments: [],
        pushInterval: 1000,
        pushSelectionRangeInterval: 500,
        pushIntervalTimer: null,
        disabled: true,
        lastSelectionContentLength: 0,
        lastMsgMeta: {
          type: null,
          peerData: null
        },
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

    EventBus.$on('new_patch', 
      (msg) => {
        this.lastMsgMeta = {
          type: 'new_patch',
          peerData: msg.peer_data
        }
        
        this.onNewPatch(msg)
      }
    );

    EventBus.$on('selection_range', 
      (msg) => {
        this.lastMsgMeta = {
          type: 'selection_range',
          peerData: msg.peer_data
        }
        console.log("received selection_range")
        let textArea = document.getElementById("my-textarea");

        this.segments = []
        this.segments.push({ start: msg.range.start, end: msg.range.end, tag: { class: "blue" } });
      
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

  },


  methods: {

    test() {
      alert("HOLA")

    },
    push() {
      if (this.hasContentChanged){
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

        this.hasContentChanged = false
        this.previousContent = this.content
        
      }
    },

    pushSelectedRange(){
      if(this.hasSelectionChanged){
        colabo.pushSelectionRange(this.selection)
        this.hasSelectionChanged = false
      }
    },


    onTextChange(text) {
      this.hasContentChanged = true      
    },

    handleSelection(e) {
      this.selection = e

      /*
      Avoid sending range changes when text is being added or deleted,
      because I push every this.pushInterval and new text might not have been
      sent yet to the server (and therefore to the rest of clients).
      I am not using this.hasContentChanged from onTextChange because both
      onTextChange and this function fire at the same time (I would
      need for onTextChange to execute first).
      */
      if(
        this.lastSelectionContentLength == this.content.length){
        this.hasSelectionChanged = true
      }

      this.lastSelectionContentLength = this.content.length
             
    },

    onNewPatch(msg) {
      let wasPatchedArray
      console.log('Editor.vue: new_patch event received')
      this.apply_patch(msg.new_patch)
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
  display: flex;
  flex-direction: column;
  text-align: left;
}

#editor label {
  display: inline;
}

#push-interval {
  display: inline;
  width: 200px;
}

textarea:disabled {
  background: red;
}

.blue {
  color: blue;
  background: yellow;
}

</style>
<template>
  <textarea v-model="content" @input="onTextChange"></textarea>
</template>

<script>

import diff_match_patch from "diff_match_patch"
let dmp = new diff_match_patch.diff_match_patch();

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

  },


  methods: {
      push() {
          if (this.hasChanged){
              //alert("PUSH")
              console.log(this.previousContent)
              console.log(this.content)

              let d = dmp.diff_main(this.previousContent, this.content)
              console.log(d)

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
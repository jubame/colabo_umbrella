<template>
  <textarea v-model="content" @input="onTextChange"></textarea>
</template>

<script>
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
              this.hasChanged = false
          }
      },


      onTextChange(text) {
          //console.log(text)
          this.hasChanged = true
          //alert(this.content + "__" + this.previousContent)
          this.previousContent = this.content
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
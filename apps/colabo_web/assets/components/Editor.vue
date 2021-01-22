<template>
  <textarea v-model="content"></textarea>
</template>

<script>
export default {
  name: 'Editor',
  data() {
        return {
            content: ''
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
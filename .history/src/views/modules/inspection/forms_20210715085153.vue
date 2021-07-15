<template>
  <div class="work_title">
            <img src="~@static/static/icon.png" alt=""  @click="linkWork('inspection-missin')"/> 
          </div>
</template>
<script>
export default {

      methods: {
              linkWork(router) {
      this.$router.push({ name: router });
    },
      },
};

</script>
<style lang="scss" scoped>
 .work_title {
  
      img {
        height: 0.45rem;
        width: 0.45rem;
        margin-right: 0.25rem;
      }
   
    }

</style>
 



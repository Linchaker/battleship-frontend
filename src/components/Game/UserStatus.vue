<template>
    <div class="wrapper">
        <div class="user-status" v-if="status == 'not_ready'">
            <div v-if="onwerBlock">
                <button @click="setReady" class="btn btn-secondary btn-lg">I'm ready</button>
            </div>
            <div v-else>
                Wating second user...
            </div>
            
        </div>
        <div class="user-status looser" v-else-if="status == 'looser'">
            Looser
        </div>
        <div class="user-status winner" v-else-if="status == 'winner'">
          Winner
        </div>
        <div class="user-status" v-else-if="status == 'ready'">
          <div v-if="onwerBlock">
                You ready!
            </div>
            <div v-else>
                Oponent Ready!
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: [
    'status',
    'onwerBlock'
],
methods: {
  setReady() {
    this.$emit('setReady');
  }
}
}
</script>

<style scoped>
.wrapper {
    display: flex;
    flex: 1;
}
.user-status {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-items: center;
    font-size: 2rem;
    font-weight: 600;
    color: #6c757d;
    text-shadow: 2px 2px 2px #acacad;
}

.user-status.winner {
  color: #1787eb;
  text-shadow: 2px 3px 1px #22567b;
}
</style>
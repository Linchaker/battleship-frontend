<template>
    <div class="wrapper">
        <div class="user-status" v-if="status == 'not_ready'">
            <div v-if="ownerBlock">
                <button @click="setReady" class="btn btn-secondary btn-lg">I'm ready</button>
            </div>
            <div v-else>
                Wating second user...
            </div>
            
        </div>
        <div class="user-status loser" v-else-if="status == 'loser'">
          {{ ownerBlock ? 'You Lose!' : 'Oponent Looooooser :)' }}
        </div>
        <div class="user-status winner" v-else-if="status == 'winner'">
          {{ ownerBlock ? 'You Winner!' : 'Oponent Winner :(' }}
        </div>
        <div class="user-status" v-else-if="status == 'ready'">
          <div v-if="ownerBlock">
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
    'ownerBlock'
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
  color: #1c5d97;
  border: 36px solid;
  text-shadow: 2px 1px 14px #4d8bb7;
  animation: blinkBorder 0.7s 3;
}
.user-status.loser {
  color: #832634;
  border: 36px solid;
  text-shadow: 2px 1px 14px #df6565;
}

@keyframes blinkBorder {
  0% {
    border-color: #1c5d97;
  }
  50% {
    border-color: #1c5d97;
  }
  100% {
    border-color: white;
  }
}
</style>
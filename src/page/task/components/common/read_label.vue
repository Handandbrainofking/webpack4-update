<template>
    <div class="row">
        <div class="yellow-hall"></div>
        <text class="label-text">{{label}}</text>
    </div>
</template>

<script>
export default {
    props: {
      label: {
        type: String,
        default: ''
      }
    }
}
</script>

<style>

.row {
 flex-direction: row;
 align-items: center;
 width: 400px;
}
.yellow-hall {
  background-color: #FECA57;
  width: 6px;
  height: 30px;
  margin-right: 4px;
}
.label-text {
  font-size: 30px;
  color: #677475;
}
.icon{
    margin-top: 10px;
    margin-right: 20px;
  }
</style>



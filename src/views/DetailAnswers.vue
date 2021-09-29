<template>
  <div class="row init-div">
    <div class="col-md-12 col-sm-12 init-div">
      <table aria-busy="false" id="view_answers_table" aria-colcount="3" class="table b-table table-striped table-hover">
        <thead class="">
        <tr>
          <th aria-colindex="1" class="text-center" width="10%">Item Number</th>
          <th aria-colindex="2" class="text-center" width="75%">Controls/Articles</th>
          <th aria-colindex="3" class="text-center" width="15%">Compliance Rating</th>
        </tr>
        </thead>
        <tbody class="">
        <tr class="" v-for="(data, index) in dashboardInteractData"  v-bind:key="index">
          <td aria-colindex="1" class="text-center">{{index + 1}}</td>
          <td aria-colindex="2" class="">
            <div class="row init-div">
              <div class="col-md-12"><strong>Section: </strong>{{data.section}}</div>
              <div class="col-md-12"><strong>Title: </strong>{{data.control || data.control_objective}}</div>
              <div class="col-md-12"><strong>Question: </strong>{{data.question}}</div>
            </div>
          </td>
          <td aria-colindex="3" class="text-center">{{data.selectedAnswer.answer}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'DetailAnswers',
    computed: mapState({
      dashboardInteractData: state => state.dashboardInteractData
    }),
    mounted () {
      this.$store.dispatch('scrollToTop')
    }
  }
</script>

<style>
  #view_answers_table{
    background: #ffffff;
  }
</style>

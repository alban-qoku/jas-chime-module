<template>
  <div class="animated fadeIn">
      <b-row >
        <b-col sm="4" class="py-2" v-for="evidence in evidences" :key="evidence._id">
          <b-card class="h-70" bg-variant="transparent" >
            <i class="icon-list p-3 font-2x1 mr-3 float-left bg-success"></i>
            <b-link :href="evidence.fileLocation">
            <div class="h4 m-0" >{{ evidence.fileName }} </div>
            </b-link>
          </b-card>
        </b-col>
      </b-row>
    <b-row v-if=" evidences < 1">
       <h3 class="text-center"> No Evidences Added</h3>
    </b-row>

  </div>
</template>

<script>
export default {
  name: 'MyDocuments',
  data () {
    return {
      evidences: [

      ],
      fields: ['fileName', 'section']
    }
  },
  methods: {
    loadEvidences () {
      this.$store.dispatch('loadEvidence', {assessmentId: this.$route.params.id}).then(evidences => { console.log('eve:', evidences); this.evidences = evidences })
        .catch(err => {
          if (err.message === 'Unauthorized') {
            this.$router.push('/login')
          } else {
            this.$toastr.e('Error, please try again')
          }
          console.log(err)
        })
    }
  },
  mounted () {
    this.loadEvidences()
  }
}
</script>

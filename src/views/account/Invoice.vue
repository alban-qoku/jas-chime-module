<template>
  <div class="container">
    <b-card class="invoice-card">
      <div style="text-align: right; margin-bottom: 15px;">
        <button class="btn btn-primary" @click="downloadPdf">
          <span ><i class="icon-docs" style="margin-right: 5px"></i></span>pdf
        </button>
      </div>
      <div style="border: solid 1px;">
        <div id="invoice_pdf" style="padding-top: 60px">
          <div class="row invoice-margin" style="margin: 10px; justify-content: center;">
            <img src="static/img/JAS_Full_Logo.svg"/>
          </div>
          <div class="row invoice-margin" style="height: 50px; margin-top: 10px; border-top: solid 1px; border-bottom: solid 1px; text-align: center">
            <h1 style="width:100%; height: 100%; background: url('../../static/img/dimension.png')">I n v o i c e</h1>
          </div>
          <div class="row invoice-margin">
            <div class="col-md-1 col-sm-1" style="text-align: right; padding: 0px;">
              <h6 style="font-size: 12px">PROJECT</h6>
              <h6 style="font-size: 12px">CLIENT</h6>
              <h6 style="font-size: 12px">ADDRESS</h6>
              <h6 style="font-size: 12px">EMAIL</h6>
              <h6 style="font-size: 12px">DATE</h6>
              <h6 style="font-size: 12px">DUE DATE</h6>
            </div>
            <div class="col-md-7 col-sm-7" style="text-align: left">
              <h6 style="font-size: 12px">JAS</h6>
              <h6 style="font-size: 12px">JOE POOLE</h6>
              <h6 style="font-size: 12px">796 Silver Harbour, TX 79273, US</h6>
              <h6 style="font-size: 12px"><a href="mailto:joepoole@gmail.com">joepoole@gmail.com</a></h6>
              <h6 style="font-size: 12px">{{paymentHistory.createdAt}}</h6>
              <h6 style="font-size: 12px">{{paymentHistory.createdAt}}</h6>
            </div>
            <div class="col-md-4 col-sm-4" style="text-align: right">
              <h6 style="font-size: 12px">Company Name</h6>
              <h6 style="font-size: 12px">HPS</h6>
              <h6 style="font-size: 12px">AZ 85004, US</h6>
              <h6 style="font-size: 12px">(602) 519-0450</h6>
              <h6 style="font-size: 12px"><a href="mailto:company@example.com">company@example.com</a></h6>
              <h6 style="font-size: 12px"></h6>
            </div>
          </div>
          <div class="row invoice-margin" style="height: 50px; margin-top: 10px; border-top: solid 1px; border-bottom: solid 1px; text-align: center">
            <h1 style="width:100%; height: 100%; background: url('../../static/img/dimension.png')"></h1>
          </div>
          <div class="row invoice-margin" style="margin-top: 15px">
            <table style="border: none !important;">
              <thead>
                <tr>
                  <th style="text-align: center; height: 60px; width: 15%; border: none; background: white!important; color: black!important;">NO</th>
                  <th style="text-align: center; height: 60px; width: 40%; border: none; background: white!important; color: black!important;">DESCRIPTION</th>
                  <th style="text-align: center; height: 60px; width: 15%; border: none; background: white!important; color: black!important;">AMOUNT</th>
                  <th style="text-align: center; height: 60px; width: 10%; border: none; background: white!important; color: black!important;">QTY</th>
                  <th style="text-align: center; height: 60px; width: 20%; border: none; background: white!important; color: black!important;">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr style="text-align: center">
                  <td style="border: none;">1</td>
                  <td style="border: none;">JAS monthly pay for the <span style="color: #00aced;">{{viewDescription}}</span> membership</td>
                  <td style="border: none;">$ {{paymentHistory.amountPaid}}</td>
                  <td style="border: none;">1</td>
                  <td style="border: none;">$ {{paymentHistory.amountPaid}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row invoice-margin" style="height: 200px;">

          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
  import html2pdf from 'html2pdf.js'

  export default {
    data: function () {
      return {
        success: false,
        viewDescription: '',
        paymentHistory: ''
      }
    },
    mounted: function () {
      this.getPaymentHistoryById()
    },
    methods: {
      downloadPdf () {
        var element = document.getElementById('invoice_pdf')
        html2pdf().from(element).set({
          pagebreak: { before: '.break-down-pdf' },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).save()
      },
      getPaymentHistoryById () {
        this.$store.dispatch('getPaymentHistoryById', { id: this.$route.params.id })
          .then((response) => {
            this.paymentHistory = response
            if (this.paymentHistory.amountPaid === '299') {
              this.viewDescription = 'small'
            } else if (this.paymentHistory.amountPaid === '599') {
              this.viewDescription = 'medium'
            } else if (this.paymentHistory.amountPaid === '999') {
              this.viewDescription = 'large'
            }
          })
          .catch((err) => {
            if (err.message === 'Unauthorized') {
              this.$router.push('/login')
            } else {
              this.error = err.message
            }
            console.error(err)
          })
      }
    }
  }
</script>
<style>
  .row.invoice-margin {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }
  .card.invoice-card .card-body {
    margin-bottom: 15px;
  }
</style>

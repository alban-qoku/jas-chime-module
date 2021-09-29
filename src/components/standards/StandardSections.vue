<template>
  <NIST800171Sections v-if="standard.name === 'NIST 800-171'" :standard="standard"></NIST800171Sections>
  <ISO27001Sections v-else-if="standard.name === 'ISO 27001'" :standard="standard"></ISO27001Sections>
  <SANSTOP20Sections v-else-if="standard.name === 'SANS TOP 20'" :standard="standard"></SANSTOP20Sections>
</template>

<script>
import ISO27001Sections from './ISO_27001/ISO_27001_Sections'
import NIST800171Sections from './NIST_800-171/NIST_800-171_Sections'
import SANSTOP20Sections from './SANS_TOP-20/SANS_TOP-20_Sections'

export default {
  name: 'standardSections',
  props: {
    standard: Object
  },
  components: {
    ISO27001Sections,
    NIST800171Sections,
    SANSTOP20Sections
  }
}
</script>

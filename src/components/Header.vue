<template>
  <div class="box">
    <nav class="level">
      <div class="level-item has-text-centered">
        <div>
          <p id="valor_em_conta" class="heading">Valor em Conta</p>
          <p class="title">{{ getMaskedCurrentAccountBalance }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p id="depositos" class="heading">Depósitos</p>
          <p class="title">{{ getDepositCount }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p id="resgates" class="heading">Resgates</p>
          <p class="title">{{ getWithdrawCount }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p id="pagamentos" class="heading">Pagamentos</p>
          <p class="title">{{ getPaymentCount }}</p>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
export default defineComponent({
  name: "Header",
  computed: {
    ...mapGetters([
      "getMaskedCurrentAccountBalance",
      "getDepositCount",
      "getWithdrawCount",
      "getPaymentCount"
    ])
  }
});
</script>

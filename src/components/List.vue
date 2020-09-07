/* eslint-disable vue/no-use-v-if-with-v-for */
<template>
  <div class="container">
    <div class="box">
      <!-- PANEL -->
      <div class="panel">
        <p class="panel-tabs">
          <a
            :class="checkActiveTab(item)"
            v-for="(item, index) in tabs"
            :key="index"
            @click="selectTab(item)"
          >
            {{ item }}
          </a>
        </p>
      </div>
      <!-- PANEL BLOCKS -->
      <!-- PANEL ITEMS -->
      <div v-if="!hasNotTransactions">
        <a
          class="panel-block"
          v-for="(transaction, t) in transactions"
          :key="t"
        >
          <span class="panel-icon">
            <i class="fas fa-book" aria-hidden="true"></i>
          </span>
          <div class="columns is-multiline" style="width: 100%;">
            <span class="column">
              <span class="panel-icon">
                <i class="fas fa-book" aria-hidden="true"></i>
              </span>
              <span class="title is-5 is-pulled-left">{{
                transaction.title
              }}</span>
            </span>
            <span class="column">
              <span class="is-pulled-right">{{
                maskDate(transaction.date)
              }}</span>
            </span>
            <div class="column is-12 pt-0">
              <span class="is-pulled-left">{{ curMask(transaction.value) }}</span>
            </div>
          </div>
        </a>
      </div>
      <div class="panel-block" v-else>
        Nenhuma transação realizada ainda.
      </div>
    </div>

    <button
      class="button is-primary is-rounded"
      @click="createModal('Depósito')"
    >
      Fazer Depósito
    </button>
    <button class="button is-info is-rounded" @click="createModal('Resgate')">
      Resgatar Valor
    </button>
    <button
      class="button is-danger is-rounded"
      @click="createModal('Pagamento')"
    >
      Realizar Pagamento
    </button>

    <div :class="'modal is-clipped ' + (modal.active ? 'is-active' : '')">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ modal.title }}</p>
          <button
            class="delete"
            aria-label="close"
            @click="closeModal()"
          ></button>
        </header>
        <section class="modal-card-body">
          {{ modal.content }}
          <p class="subtitle is-5">{{ maskedModalInputValue }}</p>
          <input
            v-model="modal.inputValue"
            class="input"
            type="number"
            placeholder="Valor"
          />
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="makeTransaction()">
            Finalizar
          </button>
          <button class="button" @click="closeModal()">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Transactions, TransactionType } from "@/interfaces/List/Transactions";
import { currencyMask } from "@/helper";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import "moment/locale/pt";
moment.locale("pt");

export default defineComponent({
  name: "List",
  data() {
    return {
      selectedTab: "All",
      tabs: ["All", "Depósito", "Resgate", "Pagamento"],
      searchText: "",
      modal: {
        active: false,
        selectedTransactionType: "",
        title: "",
        content: "",
        inputValue: 0
      }
    };
  },
  computed: {
    ...mapGetters(["transactionsList", "getAvailableAccountBalance"]),
    maskedModalInputValue() {
      return currencyMask((this.$data as any).modal.inputValue);
    },
    transactions() {
      return (this as any).$store.getters.transactionsList.filter(
        (transaction: Transactions) => {
          if (this.selectedTab === transaction.type) {
            return transaction;
          } else if (this.selectedTab === "All") {
            return transaction;
          }
        }
      );
    },
    hasNotTransactions(): boolean {
      return (this as any).$store.getters.transactionsList.length === 0;
    }
  },
  methods: {
    ...mapActions(["makeDeposit", "makeWithdraw", "makePayment"]),
    selectTab(tabName: string): void {
      this.selectedTab = tabName;
      console.log("New selected tab: " + this.selectedTab);
    },
    checkActiveTab(tabName: string): string {
      return this.selectedTab === tabName ? "is-active" : "";
    },
    maskDate(timestamp: number): string {
      return moment.unix(timestamp).format("DD/MMM");
    },
    curMask(value: number): string {
      return currencyMask(value);
    },

    makeTransaction() {
      switch (this.modal.selectedTransactionType) {
        case "Depósito":
          this.makeDeposit({
            value: this.modal.inputValue
          });
          break;
        case "Resgate":
          if (
            (this as any).getAvailableAccountBalance < this.modal.inputValue
          ) {
            alert("Saldo insuficiente pra realizar esta operação.");
          }
          this.makeWithdraw({
            value: this.modal.inputValue
          });
          break;
        case "Pagamento":
          if (
            (this as any).getAvailableAccountBalance < this.modal.inputValue
          ) {
            alert("Saldo insuficiente pra realizar esta operação.");
          }
          this.makePayment({
            value: this.modal.inputValue
          });
          break;
      }
      this.closeModal();
    },
    clearModal(): void {
      this.modal = {
        active: false,
        selectedTransactionType: "",
        title: "",
        content: "",
        inputValue: 0
      };
    },
    createModal(transactionType: TransactionType): void {
      this.clearModal();
      switch (transactionType) {
        case "Depósito":
          this.modal.title = "Realizar Depósito";
          this.modal.content = "Deseja realizar depósito de que valor?";
          this.modal.selectedTransactionType = TransactionType.DEPOSIT;
          break;
        case "Resgate":
          this.modal.title = "Realizar Resgate";
          this.modal.content = "Deseja realizar o resgate de que valor?";
          this.modal.selectedTransactionType = TransactionType.WITHDRAW;
          break;
        case "Pagamento":
          this.modal.title = "Realizar Pagamento";
          this.modal.content = "Deseja realizar pagamento de que valor?";
          this.modal.selectedTransactionType = TransactionType.PAYMENT;
          break;
      }
      this.$data.modal.active = true;
    },
    closeModal(): void {
      this.$data.modal.active = false;
    }
  }
});
</script>

import { createStore, Store } from "vuex";
import { Transactions, TransactionType } from "@/interfaces/List/Transactions";
import { currencyMask } from "@/helper";
import moment from "moment";
import "moment/locale/pt";
moment.locale('pt');

export default createStore({
  state: {
    currentAccountBalance: 0,
    transactions: []
  },
  mutations: {
    makeDeposit(state, transaction): void {
      state.currentAccountBalance = state.currentAccountBalance + parseInt(transaction.value);
      state.transactions.push(transaction as never);
    },
    makeWithdraw(state, transaction): void {
      const hasNotValueToTransact: boolean = (state.currentAccountBalance < parseInt(transaction.value)) as boolean;
      if (hasNotValueToTransact) return;
      state.currentAccountBalance = state.currentAccountBalance - transaction.value;
      state.transactions.push(transaction as never);
    },
    makePayment(state, transaction): void {
      const hasNotValueToTransact: boolean = (state.currentAccountBalance < parseInt(transaction.value)) as boolean;
      if (hasNotValueToTransact) return;
      state.currentAccountBalance = state.currentAccountBalance - transaction.value;
      state.transactions.push(transaction as never);
    },
    feedState (state, newState) {
      const { transactions, currentAccountBalance } = newState;
      state.currentAccountBalance = currentAccountBalance;
      state.transactions = transactions;
    },
    updateState (state) {
      localStorage.setItem(
        "appbk:accountInfo",
        JSON.stringify(state)
      );
    }
  },
  actions: {
    makeDeposit ({ commit }, payload) {
      const transaction: Transactions = {
        type: TransactionType.DEPOSIT,
        title: "Depósito Realizado",
        date: moment().unix(),
        value: payload.value
      };
      if(payload.description) {
        transaction.description = payload.description;
      }
      commit("makeDeposit", transaction);
      commit("updateState");
    },
    makeWithdraw ({ commit }, payload) {
      const transaction: Transactions = {
        type: TransactionType.WITHDRAW,
        title: "Resgate Realizado",
        date: moment().unix(),
        value: payload.value
      };
      if(payload.description) {
        transaction.description = payload.description;
      }
      commit("makeWithdraw", transaction);
      commit("updateState");
    },
    makePayment ({ commit }, payload) {
      const transaction: Transactions = {
        type: TransactionType.PAYMENT,
        title: "Pagamento Realizado",
        date: moment().unix(),
        value: payload.value
      };
      if(payload.description) {
        transaction.description = payload.description;
      }
      commit("makePayment", transaction);
      commit("updateState");
    },
    feedState: ({ commit }, payload) => commit("feedState", payload),
    loadState: ({ commit }) => {
      const storedData: string | null = localStorage.getItem("appbk:accountInfo");
      if (storedData) {
        const { currentAccountBalance, transactions } = JSON.parse(storedData);
        // console.log(currentAccountBalance, transactions);
        commit("feedState", { currentAccountBalance, transactions });
      }
    }
  },
  modules: {},
  getters: {
    getAvailableAccountBalance: state => state.currentAccountBalance,
    getMaskedCurrentAccountBalance: state => {
      return currencyMask(state.currentAccountBalance);
    },
    getDepositCount: state => state.transactions.filter( (transaction: Transactions) => transaction.type === TransactionType.DEPOSIT ).length || 0,
    getWithdrawCount: state => state.transactions.filter( (transaction: Transactions) => transaction.type === TransactionType.WITHDRAW ).length || 0,
    getPaymentCount: state => state.transactions.filter( (transaction: Transactions) => transaction.type === TransactionType.PAYMENT ).length || 0,
    transactionsList: state => {
      return state.transactions.sort( (transactionX: Transactions, transactionY: Transactions) => {
        return transactionY.date - transactionX.date;
      });
    }
  }
});

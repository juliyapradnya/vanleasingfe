<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Purchase Order</h3>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-btn color="green" fab dark small @click="dialog = true">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table :headers="headers" :items="purchaseorder" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="blue" fab dark x-small @click="editHandler(item)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn color="red" fab dark x-small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="1000px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Purchase Order</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="form.vehicle_registration"
                    label="Vehicle No. Support"
                    outlined
                    :rules="vehicleRegistrationRules"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="form.purchase_method"
                    :items="['Hire Purchase','Cash','Rent/Return']"
                    label="Purchase Method"
                    outlined
                    :rules="purchaseMethodRules"
                    required
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="form.hp_finance_provider"
                    label="Hire Purchase Name"
                    outlined
                    :rules="hpFinanceProviderRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.hire_purchase_starting_date"
                        label="Purchase Starting Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="hirePurchaseStartingDateRules"
                      ></v-text-field>
                    </template>
                      <v-date-picker
                        v-model="form.hire_purchase_starting_date"
                        @input="menu1 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="form.hp_interest_per_annum"
                      label="Interest Rate (p.a.)"
                      outlined
                      :rules="hpInterestPerAnnumRules"
                      required
                      hint="Must be a number and use . for decimal number"
                    persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="form.hp_deposit_amount"
                      label="Deposit"
                      outlined
                      :rules="hpDepositAmountRules"
                      required
                      hint="Must be a number"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="form.hp_term"
                      label="Period Term (months)"
                      outlined
                      :rules="hpTermRules"
                      required
                      hint="Must be a number"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="form.documentation_fees_pu"
                      label="Documentation Fee"
                      outlined
                      :rules="documentationFeesRules"
                      required
                      hint="Must be a number"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="form.final_fees"
                      label="Final Fee"
                      outlined
                      :rules="finalFeesRules"
                      required
                      hint="Must be a number"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="form.other_fees"
                      label="Other Fee"
                      outlined
                      :rules="otherFeesRules"
                      required
                      hint="Must be a number"
                      persistent-hint
                    ></v-text-field>
                  </v-col>

                  <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="form.price_otr"
                    label="Price OTR (Excl VAT)"
                    outlined
                    :rules="priceOtrRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
                </v-col>

                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="form.monthly_payment"
                      label="Purchase Monthly Payment"
                      outlined
                      :rules="monthlyPaymentRules"
                      required
                      hint="Must be a number"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="form.final_payment"
                      label="Last Payment"
                      outlined
                      :rules="finalPaymentRules"
                      required
                      hint="Must be a number"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-select
                      v-model="form.hp_interest_type"
                      :items="['Variable','Non HP','Fixed']"
                      label="Interest Type"
                      outlined
                      :rules="hpInterestTypeRules"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel">
            Cancel
          </v-btn>

          <v-btn color="blue darken-1" text @click="setForm">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data purchase order ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: "List",
  data() {
    return {
      inputType: "Add",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      menu1: false,
      headers: [
        { text: "Vehicle No. Support", value: "vehicle_registration" },
        //{ text: "Agreement Number", value: "agreement_no" },
        { text: "Purchase Method", value: "purchase_method" },
        { text: "Hire Purchase Name", value: "hp_finance_provider" },
        { text: "Purchase Starting Date", value: "hire_purchase_starting_date" },
        { text: "Interest Rate (p.a.)", value: "hp_interest_per_annum" },
        { text: "Deposit", value: "hp_deposit_amount" },
        { text: "Period Term (months)", value: "hp_term" },
        { text: "Documentation Fee", value: "documentation_fees_pu" },
        { text: "Final Fee", value: "final_fees" },
        { text: "Other Fee", value: "other_fees" },
        { text: "Price OTR", value: "price_otr" },
        { text: "Purchase Monthly Payment", value: "monthly_payment" },
        { text: "Last Payment", value: "final_payment" },
        { text: "Interest Type", value: "hp_interest_type" },
        { text: "Actions", value: "actions" },
      ],
      purchaseorders: new FormData(),
      purchaseorder: [],
      salesorders: [],
      listSalesOrders: [],
      listSalesOrdersCopy: [],
      form: {
        //id_sales_order: null,
        purchase_method: null,
        vehicle_registration: null,
        hp_finance_provider: null,
        hire_purchase_starting_date: null,
        hp_interest_per_annum: null,
        hp_deposit_amount: null,
        hp_term: null,
        documentation_fees_pu: null,
        final_fees: null,
        other_fees: null,
        price_otr: null,
        monthly_payment: null,
        final_payment: null,
        hp_interest_type: null,
      },
      agreementNumberRules: [(v) => !!v || "Agreement Number must be required"],
      purchaseMethodRules: [(v) => !!v || "Purchase Number must be required"],
      vehicleRegistrationRules: [(v) => !!v || "Vehicle Registration must be required"],
      hpFinanceProviderRules: [(v) => !!v || "HP Finance Provider must be required"],
      hirePurchaseStartingDateRules: [(v) => !!v || "Starting Date must be required"],
      hpInterestPerAnnumRules: [(v) => !!v || "HP Interest per Annum must be required"],
      hpDepositAmountRules: [(v) => !!v || "HP Deposit Amount must be required"],
      hpTermRules: [(v) => !!v || "HP Term must be required"],
      documentationFeesRules: [(v) => !!v || "Documentation Fees must be required"],
      finalFeesRules: [(v) => !!v || "Final Fees must be required"],
      otherFeesRules: [(v) => !!v || "Other Fees must be required"],
      monthlyPaymentRules: [(v) => !!v || "Monthly Payment must be required"],
      finalPaymentRules: [(v) => !!v || "Final Payment must be required"],
      hpInterestTypeRules: [(v) => !!v || "HP Interest Type must be required"],
      deleteId: "",
      editId: "",
      hire_purchase_starting_date: new Date().toISOString().substr(0, 10),
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Add") {
        this.save();
      } else {
        this.update();
      }
    },
    //read data
    readData() {
      var url = this.$api + "/purchaseorder";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.purchaseorder = response.data.data;
        });
    },

    listDataSalesOrders() {
      var url = this.$api + "/salesorder";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.listSalesOrders = response.data.data;
          console.log(response.data.data)
        });
    },

    readDataSalesOrder() {
      var url = this.$api + "/showagreementnumber";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.salesorders = response.data.data;
        });
    },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        console.log(this.form.id_sales_order)
        //this.purchaseorders.append("id_sales_order", this.form.id_sales_order);
        this.purchaseorders.append("purchase_method", this.form.purchase_method);
        this.purchaseorders.append("vehicle_registration", this.form.vehicle_registration);
        this.purchaseorders.append("hp_finance_provider", this.form.hp_finance_provider);
        this.purchaseorders.append("hire_purchase_starting_date", this.form.hire_purchase_starting_date);
        this.purchaseorders.append("hp_interest_per_annum", this.form.hp_interest_per_annum);
        this.purchaseorders.append("hp_deposit_amount", this.form.hp_deposit_amount);
        this.purchaseorders.append("hp_term", this.form.hp_term);
        this.purchaseorders.append("documentation_fees_pu", this.form.documentation_fees_pu);
        this.purchaseorders.append("final_fees", this.form.final_fees);
        this.purchaseorders.append("other_fees", this.form.other_fees);
        this.purchaseorders.append("price_otr", this.form.price_otr);
        this.purchaseorders.append("monthly_payment", this.form.monthly_payment);
        this.purchaseorders.append("final_payment", this.form.final_payment);
        this.purchaseorders.append("hp_interest_type", this.form.hp_interest_type);
        
        var url = this.$api + "/purchaseorder";
        this.load = true;
        this.$http
          .post(url, this.purchaseorders, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.close();
            this.readData(); //mengambil data
            this.readDataSalesOrder();
            this.resetForm();
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }
    },
    //ubah
    update() {
      let newData = {
        //id_sales_order                : this.form.id_sales_order,
        purchase_method               : this.form.purchase_method,
        vehicle_registration          : this.form.vehicle_registration,
        hp_finance_provider           : this.form.hp_finance_provider,
        hire_purchase_starting_date   : this.form.hire_purchase_starting_date,
        hp_interest_per_annum         : this.form.hp_interest_per_annum,
        hp_deposit_amount             : this.form.hp_deposit_amount,
        hp_term                       : this.form.hp_term,
        documentation_fees_pu         : this.form.documentation_fees_pu,
        final_fees                    : this.form.final_fees,
        other_fees                    : this.form.other_fees,
        price_otr                     : this.form.price_otr,
        monthly_payment               : this.form.monthly_payment,
        final_payment                 : this.form.final_payment,
        hp_interest_type              : this.form.hp_interest_type,
      };
      var url = this.$api + "/purchaseorder/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.readDataSalesOrder(); //mengambil data
          this.resetForm();
          if(this.listSalesOrdersCopy.length > this.salesorders.length){
            this.listSalesOrdersCopy.pop();
          }
          this.inputType = "Add";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    //hapus
    deleteData() {
      //mengahapus data
      var url = this.$api + "/purchaseorder/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); 
          this.readDataSalesOrder();//mengambil data
          this.resetForm();
          this.inputType = "Add";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    editHandler(item) {
      // this.listSalesOrdersCopy = [...this.salesorders];
      
      // this.listSalesOrders.map((s)=>{
      //   if(item.id_sales_order == s.id){
      //     return this.listSalesOrdersCopy.push({'id': s.id, 'agreement_no': s.agreement_no})
      //   }
      // })
      
      this.inputType = "Update";
      this.editId = item.id;
      this.form.id_sales_order = item.id_sales_order;
      this.form.purchase_method = item.purchase_method;
      this.form.vehicle_registration = item.vehicle_registration;
      this.form.hp_finance_provider = item.hp_finance_provider;
      this.form.hire_purchase_starting_date = item.hire_purchase_starting_date;
      this.form.hp_interest_per_annum = item.hp_interest_per_annum;
      this.form.hp_deposit_amount = item.hp_deposit_amount;
      this.form.hp_term = item.hp_term;
      this.form.documentation_fees_pu = item.documentation_fees_pu;
      this.form.final_fees = item.final_fees;
      this.form.other_fees = item.other_fees;
      this.form.price_otr = item.price_otr;
      this.form.monthly_payment = item.monthly_payment;
      this.form.final_payment = item.final_payment;
      this.form.hp_interest_type = item.hp_interest_type;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = "Add";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Add";
    },
    resetForm() {
      this.$refs.form.reset();
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
    this.readDataSalesOrder();
    this.listDataSalesOrders();
  },
};
</script>

<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Compilation DB</h3>
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
      </v-card-title>
      <v-data-table :headers="headers" :items="compilationdb" :search="search">
      </v-data-table>
    </v-card>
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
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      menu1: false,
      headers: [
        

        { text: "Vehicle No. Support", value: "vehicle_registration" , width: '150px' , height: '100px'},

        { text: "Contract Type", value: "type" , width: '150px', height: '100px'},
        { text: "Agreement Number", value: "agreement_number" , width: '150px', height: '100px'},

        //{ text: "Next Step", value: "next_step" },
        { text: "Status Mobil", value: "status_next_step" , width: '150px', height: '100px'},
        { text: "Status Sales", value: "next_step_status_sales" , width: '150px'},
        
        //{ text: "New Sales Order No", value: "new_sales_order_no" },
        { text: "Vehicle Return Date", value: "vehicle_return_date" , width: '150px'},

        { text: "Hire Purchase Name", value: "hp_finance_provider" , width: '150px' },

        { text: "Customer Name", value: "cust_name" , width: '150px'},
        { text: "Prepared By", value: "sales_person" , width: '150px'},

        { text: "Purchase Starting Date", value: "hire_purchase_starting_date" , width: '150px'},
        { text: "Sales Starting Date", value: "contract_start_date" , width: '150px'},
        { text: "Vehicle Manufacturer", value: "vehicle_manufacturer" , width: '150px'},
        { text: "Vehicle Model", value: "vehicle_model" , width: '150px'},
        { text: "Vehicle Variant", value: "vehicle_variant" , width: '200px'},
        
        //{ text: "Vehicle Description", value: "vehicle_description" },
        { text: "Total Income", value: "total_income_new" , width: '150px'},
        { text: "Total Cost", value: "total_cost" , width: '150px'},
        { text: "Contract Margin", value: "contract_margin" , width: '150px'},

        { text: "Margin Term", value: "margin_term" , width: '150px'},
        { text: "Financing Amount", value: "financing_amount" , width: '150px'},
        { text: "Regular Monthly Payment", value: "regular_monthly_payment" , width: '150px'},
        { text: "First Payment", value: "first_payment" , width: '150px'},
        
        { text: "Penalty Early Settlement", value: "penalty_early_settlement" , width: '150px'},
        { text: "Settlement", value: "settlement" , width: '150px'},
        { text: "Annum Payment", value: "annum_payment" , width: '150px'},
        

        { text: "Vehicle Tracking", value: "vehicle_tracking" , width: '150px'},
        { text: "Sum Doc Deposit Other", value: "sum_docdepoth" , width: '150px'},

        { text: "Basic List Price", value: "basic_list_price" , width: '150px'},
        { text: "Residual Value Projection", value: "residual_value" , width: '150px'},

        { text: "Sold Price", value: "sold_price" , width: '150px'},

        { text: "Annual Mileage", value: "annual_mileage" , width: '150px'},
        { text: "Period Term (months)", value: "term_months" , width: '150px'},
        { text: "Rental Advance (GBP)", value: "initial_rental" , width: '150px'},
        { text: "Price Otr", value: "price_otr" , width: '150px'},
        { text: "Documentation Fee", value: "documentation_fees" , width: '150px'},
        { text: "Sales Monthly Rental", value: "monthly_rental" , width: '150px'},
        { text: "Initial Other Income", value: "other_income" , width: '150px'},
        
        
        { text: "Interest Rate (p.a.)", value: "hp_interest_per_annum" , width: '150px'},
        { text: "Deposit", value: "hp_deposit_amount" , width: '150px'},
        { text: "Period Term (months)", value: "hp_term" , width: '150px'},
        { text: "Documentation Fee", value: "documentation_fees_pu" , width: '150px'},
        { text: "Final Fee", value: "final_fees" , width: '150px'},
        { text: "Other Fee", value: "other_fees" , width: '150px'},
        { text: "Sales Monthly Payment", value: "monthly_payment" , width: '150px'},
        { text: "Last Payment", value: "final_payment" , width: '150px'},
        { text: "Interest Type", value: "hp_interest_type" , width: '150px'},

        //{ text: "Description Expenses", value: "description_expenses" },
        //{ text: "Vendor Name", value: "vendor_name" },
        //{ text: "Amount (GBP)", value: "amount_oc" },

        //{ text: "Description Income", value: "description_income" },
        //{ text: "Amount (GBP)", value: "amount_oi" },

        
        //{ text: "Total Income", value: "total_income" },
        

        //{ text: "Payment Profile", value: "payment_profile" },
      ],
      purchaseorders: new FormData(),
      purchaseorder: [],
      salesorders: [],
      listSalesOrders: [],
      listSalesOrdersCopy: [],
      compilationdb: [],
      form: {
        id_sales_order: null,
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
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    //read data
    readData() {
      var url = this.$api + "/compilationdb";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.compilationdb = response.data.data;
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

    readDataPurchaseOrders() {
      var url = this.$api + "/salesorder";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.purchaseorder = response.data.data;
          console.log(response.data.data)
        });
    },

    // readDataSalesOrder() {
    //   var url = this.$api + "/showagreementnumber";
    //   this.$http
    //     .get(url, {
    //       headers: {
    //         Authorization: "Bearer " + localStorage.getItem("token"),
    //       },
    //     })
    //     .then((response) => {
    //       this.salesorders = response.data.data;
    //     });
    // },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        console.log(this.form.id_sales_order)
        this.purchaseorders.append("id_sales_order", this.form.id_sales_order);
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
            this.readDataPurchaseOrders();
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
        id_sales_order                : this.form.id_sales_order,
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
          this.readDataPurchaseOrders();
          this.resetForm();
          if(this.listSalesOrdersCopy.length > this.salesorders.length){
            this.listSalesOrdersCopy.pop();
          }
          this.inputType = "Tambah";
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
          this.readDataPurchaseOrders();
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    editHandler(item) {
      this.listSalesOrdersCopy = [...this.salesorders];
      
      this.listSalesOrders.map((s)=>{
        if(item.id_sales_order == s.id){
          return this.listSalesOrdersCopy.push({'id': s.id, 'agreement_number': s.agreement_number})
        }
      })
      
      this.inputType = "Ubah";
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
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
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
    this.readDataPurchaseOrders();
  },
};
</script>

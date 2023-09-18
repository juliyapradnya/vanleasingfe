<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">New Vehicle </h3>

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

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Purchase Order</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <div class="black--text text-darken-1 mb-2"> A. Vehicle Info </div>
              <v-text-field
                  v-model="form.vehicle_registration"
                  label="Vehicle Registration (With Space)"
                  outlined
                  :rules="vehicleRegistrationRules"
                  required
              ></v-text-field>
              <v-text-field
                  v-model="form.vehicle_manufactur"
                  label="Vehicle Manufactur"
                  outlined
                  :rules="vehicleManufacturRules"
                  required
                  persistent-hint
              ></v-text-field>
              <v-text-field
                  v-model="form.vehicle_model"
                  label="Vehicle Model"
                  outlined
                  :rules="vehicleModelRules"
                  required
                  persistent-hint
              ></v-text-field>
              <v-text-field
                  v-model="form.vehicle_variant"
                  label="Vehicle Variant"
                  outlined
                  :rules="vehicleVariantRules"
                  required
                  persistent-hint
              ></v-text-field>
              <v-text-field
                  v-model="form.colour"
                  label="Colour"
                  outlined
                  :rules="colourRules"
                  required
                  persistent-hint
              ></v-text-field>
              <v-text-field
                  v-model="form.basic_list_price"
                  label="Basic List Price"
                  outlined
                  :rules="basicListPriceRules"
                  required
                  hint="Must be a number"
                  persistent-hint
              ></v-text-field>
              <v-text-field
                  v-model="form.price_otr"
                  label="Price OTR (Excl VAT)"
                  outlined
                  :rules="priceOtrRules"
                  required
                  hint="Must be a number"
                  persistent-hint
              ></v-text-field>
              <v-text-field
                  v-model="form.min_contract_price_satu"
                  label="Minimum Contract Price (10k MPA)"
                  outlined
                  :rules="minContractPriceSatuRules"
                  required
                  hint="Must be a number"
                  persistent-hint
              ></v-text-field>
              <v-text-field
                  v-model="form.min_contract_price_dua"
                  label="Minimum Contract Price (18k MPA)"
                  outlined
                  :rules="minContractPriceDuaRules"
                  required
                  hint="Must be a number"
                  persistent-hint
              ></v-text-field>
               <v-text-field
                  v-model="form.service_maintenance"
                  label="Servicing and Maintenance"
                  outlined
                  :rules="serviceMaintananceRules"
                  required
                  persistent-hint
               ></v-text-field>
               <v-menu
                  v-model="menuMot"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.mot_due_date"
                      label="MOT Due Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="motDueDateDateRules"
                  ></v-text-field>
                </template>
                  <v-date-picker
                      v-model="form.mot_due_date"
                      @input="menuMot = false"
                    ></v-date-picker>
                </v-menu>
                <v-menu
                  v-model="menuRfl"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.rfl_due_date"
                      label="FRL Due Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="rflDueDateDateRules"
                    ></v-text-field>
                  </template>
                    <v-date-picker
                        v-model="form.rfl_due_date"
                        @input="menuRfl = false"
                    ></v-date-picker>
                  </v-menu>
                  <v-text-field
                      v-model="form.service_schedule_miles"
                      label="Service Schedule (Miles)"
                      outlined
                      :rules="serviceScheduleMilesRules"
                      required
                      hint="Must be a number"
                      persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-model="form.service_schedule_years"
                    label="Service Schedule (Years)"
                    outlined
                    :rules="serviceScheduleYearsRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-model="form.last_service_mileage"
                    label="Last Service (Mileage)"
                    outlined
                    :rules="lastServiceMileageRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
                  <v-menu
                    v-model="menuLS"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.last_service_date"
                        label="Last Service (Date)"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="lastServiceDateRules"
                      ></v-text-field>
                    </template>
                      <v-date-picker
                        v-model="form.last_service_date"
                        @input="menuLS = false"
                      ></v-date-picker>
                    </v-menu>
                  
                  <div class="black--text text-darken-1 mb-2"> B. Purchase Info </div>
                  
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
                        label="Purchase Date"
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
                  <v-select
                    v-model="form.purchase_method"
                    :items="['Hire Purchase','Cash','Rent/Return']"
                    label="Funding Method"
                    outlined
                    :rules="purchaseMethodRules"
                    required
                  ></v-select>
                  <v-text-field
                    v-if="form.purchase_method === 'Hire Purchase'
                    || form.purchase_method === 'Rent/Return'"
                    v-model="form.hp_finance_provider"
                    label="Funder"
                    outlined
                    :rules="hpFinanceProviderRules"
                    required
                  ></v-text-field>
                  <v-select
                    v-if="form.purchase_method === 'Hire Purchase'"
                    v-model="form.hp_interest_type"
                    :items="['Variable','Non HP','Fixed']"
                    label="Interest Type"
                    outlined
                    :rules="hpInterestTypeRules"
                    required
                  ></v-select>
                  <v-text-field
                    v-if="form.purchase_method === 'Hire Purchase'"
                    v-model="form.hp_interest_per_annum"
                    label="Interest Rate P.A. (%) "
                    outlined
                    :rules="hpInterestPerAnnumRules"
                    required
                    hint="Must be a number and use . for decimal number"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-if="form.purchase_method === 'Hire Purchase'
                    || form.purchase_method === 'Rent/Return'"
                    v-model="form.hp_term"
                    label="Term (Months) "
                    outlined
                    :rules="hpTermRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-if="form.purchase_method === 'Hire Purchase'"
                    v-model="form.hp_deposit_amount"
                    label="Deposit"
                    outlined
                    :rules="hpDepositAmountRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-if="form.purchase_method === 'Hire Purchase'"
                    v-model="form.monthly_payment"
                    label="Monthly Repayment"
                    outlined
                    :rules="monthlyPaymentRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-if="form.purchase_method === 'Hire Purchase'
                    || form.purchase_method === 'Cash'"
                    v-model="form.final_payment"
                    label="Final Payment"
                    outlined
                    :rules="finalPaymentRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-if="form.purchase_method === 'Hire Purchase'
                    || form.purchase_method === 'Cash'"
                    v-model="form.documentation_fees_pu"
                    label="Documentation Fee"
                    outlined
                    :rules="documentationFeesRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-if="form.purchase_method === 'Hire Purchase'
                    || form.purchase_method === 'Cash'"
                    v-model="form.final_fees"
                    label="Final Fee"
                    outlined
                    :rules="finalFeesRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
                  <v-text-field
                    v-if="form.purchase_method === 'Hire Purchase'
                    || form.purchase_method === 'Cash'"
                    v-model="form.other_fees"
                    label="Other Fees"
                    outlined
                    :rules="otherFeesRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
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
      menuMot: false,
      menuRfl: false,
      menuLS: false,
      headers: [
        { text: "Vehicle Registration (With Space)", value: "vehicle_registration" },
        //{ text: "Agreement Number", value: "agreement_no" },
        { text: "Funding Method", value: "purchase_method" },
        { text: "Funder", value: "hp_finance_provider" },
        { text: "Purchase Date", value: "hire_purchase_starting_date" , width: '150px'},
        { text: "Interest Rate P.A. (%) ", value: "hp_interest_per_annum" },
        { text: "Deposit", value: "hp_deposit_amount" },
        { text: "Term (Months) ", value: "hp_term" },
        { text: "Documentation Fee", value: "documentation_fees_pu" },
        { text: "Final Fee", value: "final_fees" },
        { text: "Other Fees", value: "other_fees" },
        { text: "Price OTR", value: "price_otr" },
        { text: "Monthly Repayment", value: "monthly_payment" },
        { text: "Final Payment", value: "final_payment" },
        { text: "Interest Type", value: "hp_interest_type" },
        { text: "Vehicle Manufactur", value: "vehicle_manufactur" },
        { text: "Vehicle Model", value: "vehicle_model" },
        { text: "Vehicle Variant", value: "vehicle_variant" },
        { text: "Basic List Price", value: "basic_list_price" },
        { text: "Colour", value: "colour" },
        { text: "Minimum Contract Price (10k MPA)", value: "min_contract_price_satu" },
        { text: "Minimum Contract Price (18k MPA)", value: "min_contract_price_dua" },
        { text: "Servicing & Maintenance", value: "service_maintenance" },
        { text: "MOT Due Date", value: "mot_due_date" },
        { text: "RFL Due Date", value: "rfl_due_date" },
        { text: "Service Schedule (Miles)", value: "service_schedule_miles" },
        { text: "Service Schedule (Years)", value: "service_schedule_years" },
        { text: "Last Service (Mileage)", value: "last_service_mileage" },
        { text: "Last Service (Date) ", value: "last_service_date" },
        { text: "Actions", value: "actions" , width: '100px' },
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
        vehicle_manufactur: null,
        vehicle_model: null,
        vehicle_variant: null,
        basic_list_price: null,
        colour: null,
        min_contract_price_satu: null,
        min_contract_price_dua: null,
        service_maintenance: null,
        mot_due_date: null,
        rfl_due_date: null,
        service_schedule_miles: null,
        service_schedule_years: null,
        last_service_mileage: null,
        last_service_date: null,
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
      vehicleManufacturRules: [(v) => !!v || "Vehicle Manufactur must be required"],
      vehicleModelRules: [(v) => !!v || "Vehicle Model must be required"],
      vehicleVariantRules: [(v) => !!v || "Vehicle variant must be required"],
      basicListPriceRules: [(v) => !!v || "Basic List Price must be required"],
      colourRules: [(v) => !!v || "Colour must be required"],
      minContractPriceSatuRules: [(v) => !!v || "Minimum Contract Price (10k MPA) must be required"],
      minContractPriceDuaRules: [(v) => !!v || "Minimum Contract Price (18k MPA) must be required"],
      serviceMaintananceRules: [(v) => !!v || "Servicing and Maintenance must be required"],
      motDueDateDateRules: [(v) => !!v || "MOT Due Date must be required"],
      rflDueDateDateRules: [(v) => !!v || "FRL Due Date must be required"],
      serviceScheduleMilesRules: [(v) => !!v || "Service Schedule (Miles) must be required"],
      serviceScheduleYearsRules: [(v) => !!v || "Service Schedule (Years) must be required"],
      lastServiceMileageRules: [(v) => !!v || "Last Service (Mileage) must be required"],
      lastServiceDateRules: [(v) => !!v || "Last Service (Date) must be required"],
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
        console.log(this.form.hp_interest_per_annum)
        if(this.form.hp_interest_per_annum == null){
          this.form.hp_interest_per_annum = 0
        }

        if(this.form.hp_deposit_amount == null){
          this.form.hp_deposit_amount = 0
        }

        if(this.form.hp_term == null){
          this.form.hp_term = 0
        }

        if(this.form.documentation_fees_pu == null){
          this.form.documentation_fees_pu = 0
        }

        if(this.form.final_fees == null){
          this.form.final_fees = 0
        }

        if(this.form.other_fees == null){
          this.form.other_fees = 0
        }

        if(this.form.price_otr == null){
          this.form.price_otr = 0
        }
        
        if(this.form.monthly_payment == null){
          this.form.monthly_payment = 0
        }

        if(this.form.final_payment == null){
          this.form.final_payment = 0
        }

        if(this.form.hp_interest_type == null){
          this.form.hp_interest_type = "-"
        }

        if(this.form.hp_finance_provider == null){
          this.form.hp_finance_provider = "-"
        }

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
        this.purchaseorders.append("vehicle_manufactur", this.form.vehicle_manufactur);
        this.purchaseorders.append("vehicle_model", this.form.vehicle_model);
        this.purchaseorders.append("vehicle_variant", this.form.vehicle_variant);
        this.purchaseorders.append("basic_list_price", this.form.basic_list_price);
        this.purchaseorders.append("colour", this.form.colour);
        this.purchaseorders.append("min_contract_price_satu", this.form.min_contract_price_satu);
        this.purchaseorders.append("min_contract_price_dua", this.form.min_contract_price_dua);
        this.purchaseorders.append("service_maintenance", this.form.service_maintenance);
        this.purchaseorders.append("mot_due_date", this.form.mot_due_date);
        this.purchaseorders.append("rfl_due_date", this.form.rfl_due_date);
        this.purchaseorders.append("service_schedule_miles", this.form.service_schedule_miles);
        this.purchaseorders.append("service_schedule_years", this.form.service_schedule_years);
        this.purchaseorders.append("last_service_mileage", this.form.last_service_mileage);
        this.purchaseorders.append("last_service_date", this.form.last_service_date);

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
            this.form.hp_interest_per_annum = null;
            this.form.hp_deposit_amount = null;
            this.form.hp_term = null;
            this.form.documentation_fees_pu = null;
            this.form.final_fees = null;
            this.form.other_fees = null;
            this.form.price_otr = null;
            this.form.monthly_payment = null;
            this.form.final_payment = null;
            this.form.hp_interest_type = null;
            this.form.hp_finance_provider = null;
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
        vehicle_manufactur            : this.form.vehicle_manufactur,
        vehicle_model                 : this.form.vehicle_model,
        vehicle_variant               : this.form.vehicle_variant,
        basic_list_price              : this.form.basic_list_price,
        colour                        : this.form.colour,
        min_contract_price_satu       : this.form.min_contract_price_satu,
        min_contract_price_dua        : this.form.min_contract_price_dua,
        service_maintenance           : this.form.service_maintenance,
        mot_due_date                  : this.form.mot_due_date,
        rfl_due_date                  : this.form.rfl_due_date,
        service_schedule_miles        : this.form.service_schedule_miles,
        service_schedule_years        : this.form.service_schedule_years,
        last_service_mileage          : this.form.last_service_mileage,
        last_service_date             : this.form.last_service_date,

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
      this.form.vehicle_manufactur = item.vehicle_manufactur;
      this.form.vehicle_model = item.vehicle_model;
      this.form.vehicle_variant = item.vehicle_variant;
      this.form.basic_list_price = item.basic_list_price;
      this.form.colour = item.colour;
      this.form.min_contract_price_satu = item.min_contract_price_satu;
      this.form.min_contract_price_dua = item.min_contract_price_dua;
      this.form.service_maintenance = item.service_maintenance;
      this.form.mot_due_date = item.mot_due_date;
      this.form.rfl_due_date = item.rfl_due_date;
      this.form.service_schedule_miles = item.service_schedule_miles;
      this.form.service_schedule_years = item.service_schedule_years;
      this.form.last_service_mileage = item.last_service_mileage;
      this.form.last_service_date = item.last_service_date;
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

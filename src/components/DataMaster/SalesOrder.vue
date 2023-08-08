<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Sales Order</h3>

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

      <v-data-table :headers="headers" :items="salesorder" :search="search">
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
          <span class="headline">{{ formTitle }} Sales Order</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select 
                    v-model="form.id_purchase_order"
                    :items="purchaseorders"
                    item-text="vehicle_registration"
                    item-value="id"
                    label="Vehicle Registration Number"
                    outlined
                    :rules="vehicleRegistrationRules"
                    required
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="form.type"
                    :items="['Contract Hire (Unregulated)','Hire (Unregulated)']"
                    label="Contract Type"
                    outlined
                    :rules="typeRules"
                    required
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="form.agreement_number"
                    label="Agreement Number"
                    outlined
                    :rules="agreementNumberRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="form.cust_name"
                    label="Customer Name"
                    outlined
                    :rules="customerNameRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="form.sales_person"
                    label="Prepared By"
                    outlined
                    :rules="salesPersonRules"
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
                        v-model="form.contract_start_date"
                        label="Sales Starting Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="contractStartDateRules"
                      ></v-text-field>
                    </template>
                      <v-date-picker
                        v-model="form.contract_start_date"
                        @input="menu1 = false"
                      ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="form.vehicle_manufacturer"
                    label="Vehicle Manufacturer"
                    outlined
                    :rules="vehicleManufacturerRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="form.vehicle_model"
                    label="Vehicle Model"
                    outlined
                    :rules="vehicleModelRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="form.vehicle_variant"
                    label="Vehicle Variant"
                    outlined
                    :rules="vehicleVariantRules"
                    required
                  ></v-text-field>
                </v-col>
               
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="form.basic_list_price"
                    label="Basic List Price"
                    outlined
                    :rules="basicListPriceRules"
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
                    v-model="form.residual_value"
                    label="Residual Value Projection"
                    outlined
                    :rules="residualValueRules"
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
                    v-model="form.annual_mileage"
                    label="Annual Mileage"
                    outlined
                    :rules="annualMileageRules"
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
                    v-model="form.term_months"
                    label="Period Term (months)"
                    outlined
                    :rules="termMonthsRules"
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
                    v-model="form.initial_rental"
                    label="Rental Advance (GBP)"
                    outlined
                    :rules="initialRentalRules"
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
                    v-model="form.documentation_fees"
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
                    v-model="form.monthly_rental"
                    label="Sales Monthly Rental"
                    outlined
                    :rules="monthlyRentalRules"
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
                    v-model="form.other_income"
                    label="Initial Other Income"
                    outlined
                    :rules="otherIncomeRules"
                    required
                    hint="Must be a number"
                    persistent-hint
                  ></v-text-field>
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
          Anda yakin ingin menghapus data sales order ini?
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
        
        { text: "Vehicle Registration Number", value: "vehicle_registration" },
        { text: "Contract Type", value: "type" },
        //{ text: "Order Number", value: "agreement_no" },
        { text: "Agreement Number", value: "agreement_number" },
        { text: "Customer Name", value: "cust_name" , width: '100px'},
        { text: "Prepared By", value: "sales_person" , width: '100px'},
        { text: "Sales Starting Date", value: "contract_start_date" , width: '150px'},
        { text: "Vehicle Manufacturer", value: "vehicle_manufacturer" },
        { text: "Vehicle Model", value: "vehicle_model" },
        { text: "Vehicle Variant", value: "vehicle_variant" , width: '200px'},
        { text: "Basic List Price", value: "basic_list_price" },
        { text: "Residual Value Projection", value: "residual_value" },
        { text: "Annual Mileage", value: "annual_mileage" },
        { text: "Period Term (months)", value:         "term_months" },
        { text: "Rental Advance (GBP)", value: "initial_rental" },
        { text: "Documentation Fee", value: "documentation_fees" },
        { text: "Sales Monthly Rental", value: "monthly_rental" },
        { text: "Initial Other Income", value: "other_income" },
        { text: "Actions", value: "actions" , width: '100px'},
      ],
      salesorders: new FormData(),
      salesorder: [],
      purchaseorders: [],
      form: {
        id_purchase_order: null,
        type: null,
        //agreement_no: null,
        agreement_number: null,
        cust_name: null,
        sales_person: null,
        contract_start_date: null,
        vehicle_manufacturer: null,
        vehicle_model: null,
        vehicle_variant: null,
        basic_list_price: null,
        residual_value: null,
        annual_mileage: null,
        term_months: null,
        initial_rental: null,
        documentation_fees: null,
        monthly_rental: null,
        other_income: null,
      },
      typeRules: [(v) => !!v || "Type must be required"],
      agreementNumberRules: [(v) => !!v || "Customer Name must be required"],
      customerNameRules: [(v) => !!v || "Customer Name must be required"],
      salesPersonRules: [(v) => !!v || "Sales Person must be required"],
      contractStartDateRules: [(v) => !!v || "Contract Start Date must be required"],
      vehicleManufacturerRules: [(v) => !!v || "Vehicle Manufacturer must be required"],
      vehicleModelRules: [(v) => !!v || "Vehicle Model must be required"],
      vehicleVariantRules: [(v) => !!v || "Vehicle Variant must be required"],
      vehicleDescriptionRules: [(v) => !!v || "Vehicle Description must be required"],
      basicListPriceRules: [(v) => !!v || "Basic List Price must be required"],
      residualValueRules: [(v) => !!v || "Residual Value must be required"],
      annualMileageRules: [(v) => !!v || "Annual Mileage must be required"],
      termMonthsRules: [(v) => !!v || "Term Month must be required"],
      initialRentalRules: [(v) => !!v || "Initial Rental must be required"],
      priceOtrRules: [(v) => !!v || "Price OTR must be required"],
      documentationFeesRules: [(v) => !!v || "Documentation Fees must be required"],
      monthlyRentalRules: [(v) => !!v || "Monthly Rental must be required"],
      otherIncomeRules: [(v) => !!v || "Other Income must be required"],
      statusRules: [(v) => !!v || "Other Income must be required"],
      deleteId: "",
      editId: "",
      contract_start_date: new Date().toISOString().substr(0, 10),
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
      var url = this.$api + "/salesorder";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.salesorder = response.data.data;
        });
    },

    readDataPurchaseOrder() {
      var url = this.$api + "/purchaseorder";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.purchaseorders = response.data.data;
        });
    },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.salesorders.append("id_purchase_order", this.form.id_purchase_order);
        this.salesorders.append("type", this.form.type);
        this.salesorders.append("agreement_number", this.form.agreement_number);
        this.salesorders.append("cust_name", this.form.cust_name);
        this.salesorders.append("sales_person", this.form.sales_person);
        this.salesorders.append("contract_start_date", this.form.contract_start_date);
        this.salesorders.append("vehicle_manufacturer", this.form.vehicle_manufacturer);
        this.salesorders.append("vehicle_model", this.form.vehicle_model);
        this.salesorders.append("vehicle_variant", this.form.vehicle_variant);
        this.salesorders.append("basic_list_price", this.form.basic_list_price);
        this.salesorders.append("residual_value", this.form.residual_value);
        this.salesorders.append("annual_mileage", this.form.annual_mileage);
        this.salesorders.append("term_months", this.form.term_months);
        this.salesorders.append("initial_rental", this.form.initial_rental);
        this.salesorders.append("documentation_fees", this.form.documentation_fees);
        this.salesorders.append("monthly_rental", this.form.monthly_rental);
        this.salesorders.append("other_income", this.form.other_income);
        
        var url = this.$api + "/salesorder";
        this.load = true;
        this.$http
          .post(url, this.salesorders, {
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
        id_purchase_order     : this.form.id_purchase_order,
        type                  : this.form.type,
        //agreement_no          : this.form.agreement_no,
        agreement_number      : this.form.agreement_number,
        cust_name             : this.form.cust_name,
        sales_person          : this.form.sales_person,
        contract_start_date   : this.form.contract_start_date,
        vehicle_manufacturer  : this.form.vehicle_manufacturer,
        vehicle_model         : this.form.vehicle_model,
        vehicle_variant       : this.form.vehicle_variant,
        basic_list_price      : this.form.basic_list_price,
        residual_value        : this.form.residual_value,
        annual_mileage        : this.form.annual_mileage,
        term_months           : this.form.term_months,
        initial_rental        : this.form.initial_rental,
        documentation_fees    : this.form.documentation_fees,
        monthly_rental        : this.form.monthly_rental,
        other_income          : this.form.other_income,
      };
      var url = this.$api + "/salesorder/" + this.editId;
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
    //hapus
    deleteData() {
      //mengahapus data
      var url = this.$api + "/salesorder/" + this.deleteId;
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
          this.readData(); //mengambil data
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
      this.inputType = "Update";
      this.editId = item.id;
      this.form.id_purchase_order = item.id_purchase_order;
      this.form.type = item.type;
      //this.form.agreement_no = item.agreement_no;
      this.form.agreement_number = item.agreement_number;
      this.form.cust_name = item.cust_name;
      this.form.sales_person = item.sales_person;
      this.form.contract_start_date = item.contract_start_date;
      this.form.vehicle_manufacturer = item.vehicle_manufacturer;
      this.form.vehicle_model = item.vehicle_model;
      this.form.vehicle_variant = item.vehicle_variant;
      this.form.basic_list_price = item.basic_list_price;
      this.form.residual_value = item.residual_value;
      this.form.annual_mileage = item.annual_mileage;
      this.form.term_months = item.term_months;
      this.form.initial_rental = item.initial_rental;
      this.form.documentation_fees = item.documentation_fees;
      this.form.monthly_rental = item.monthly_rental;
      this.form.other_income = item.other_income;
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
    this.readDataPurchaseOrder();
  },
};
</script>

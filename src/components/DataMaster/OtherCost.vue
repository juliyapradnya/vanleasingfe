<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Other Cost</h3>

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

      <v-data-table :headers="headers" :items="othercost" :search="search">
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
          <span class="headline">{{ formTitle }} Other Cost</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">

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
                  v-model="form.date"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="dateRules"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.date"
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>

            <v-select
              v-if="inputType == 'Add'"
              v-model="form.id_purchase_order"
              :items="purchaseorders"
              item-text="vehicle_registration"
              item-value="id"
              label="Vehicle Registration"
              outlined
              :rules="vehicleRegistrationRules"
              required
            ></v-select>

            <v-select
              v-else
              v-model="form.id_purchase_order"
              :items="listPurchaseOrdersCopy"
              item-text="vehicle_registration"
              item-value="id"
              label="Vehicle Registration"
              outlined
              :rules="vehicleRegistrationRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.description_expenses"
              label="Description Expenses"
              outlined
              :rules="descriptionExpensesRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.vendor_name"
              label="Vendor Name"
              outlined
              :rules="vendorNameRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.amount_oc"
              label="Amount"
              outlined
              :rules="amountRules"
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
          Anda yakin ingin menghapus data other cost ini?
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
        { text: "Date", value: "date" },
        { text: "Vehicle Registration Number", value: "vehicle_registration" },
        { text: "Description Expenses", value: "description_expenses" },
        { text: "Vendor Name", value: "vendor_name" },
        { text: "Amount (GBP)", value: "amount_oc" },
        { text: "Actions", value: "actions" },
      ],
      othercosts: new FormData(),
      othercost: [],
      purchaseorders:[],
      listPurchaseOrders: [],
      listPurchaseOrdersCopy: [],
      form: {
        id_purchase_order: null,
        date: null,
        vehicle_registration_number: null,
        description_expenses: null,
        vendor_name: null,
        amount_oc: null,
        
      },
      dateRules: [(v) => !!v || "Date Must Be Required"],
      vehicleRegistrationRules: [(v) => !!v || "Vehicle Registration Number Must Be Required"],
      descriptionExpensesRules: [(v) => !!v || "Description Expenses Must Be Required"],
      vendorNameRules: [(v) => !!v || "Vendor Name Must Be Required"],
      amountRules: [(v) => !!v || "Amount Must Be Required"],
      deleteId: "",
      editId: "",
      start_date: new Date().toISOString().substr(0, 10),
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
      var url = this.$api + "/othercost";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.othercost = response.data.data;
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

    listDataPurchase() {
      var url = this.$api + "/purchaseorderall";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.listPurchaseOrders = response.data.data;
          console.log(response.data.data)
        });
    },
    
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.othercosts.append("date", this.form.date);
        this.othercosts.append("id_purchase_order", this.form.id_purchase_order);
        this.othercosts.append("description_expenses", this.form.description_expenses);
        this.othercosts.append("vendor_name", this.form.vendor_name);
        this.othercosts.append("amount_oc", this.form.amount_oc);

        var url = this.$api + "/othercost";
        this.load = true;
        this.$http
          .post(url, this.othercosts, {
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
            this.readDataPurchaseOrder(); //mengambil data
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
        date                        : this.form.date,
        id_purchase_order           : this.form.id_purchase_order,
        description_expenses        : this.form.description_expenses,
        vendor_name                 : this.form.vendor_name,
        amount_oc                   : this.form.amount_oc,
      };
      var url = this.$api + "/othercost/" + this.editId;
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
          this.readData();
          this.readDataPurchaseOrder(); //mengambil data
          this.resetForm();
          if(this.listPurchaseOrdersCopy.length > this.purchaseorders.length){
            this.listPurchaseOrdersCopy.pop();
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
      var url = this.$api + "/othercost/" + this.deleteId;
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
          this.readDataPurchaseOrder();//mengambil data
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
      this.listPurchaseOrdersCopy = [...this.purchaseorders];
      
      this.listPurchaseOrders.map((s)=>{
        if(item.id_purchase_order == s.id){
          return this.listPurchaseOrdersCopy.push({'id': s.id, 'vehicle_registration': s.vehicle_registration})
        }
      })

      this.inputType = "Update";
      this.editId = item.id;
      this.form.date = item.date;
      this.form.id_purchase_order = item.id_purchase_order;
      this.form.description_expenses = item.description_expenses;
      this.form.vendor_name = item.vendor_name;
      this.form.amount_oc = item.amount_oc;
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
    this.listDataPurchase();
  },
};
</script>

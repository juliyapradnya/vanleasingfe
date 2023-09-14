<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Additional Income</h3>

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

      <v-data-table :headers="headers" :items="otherincome" :search="search">
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
          <span class="headline">{{ formTitle }} Other Income</span>
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
              v-model="form.description_income"
              label="Description Income"
              outlined
              :rules="descriptionIncomeRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.amount_oi"
              label="Amount"
              outlined
              :rules="amountRules"
              required
              hint="Must be a number"
              persistent-hint
            ></v-text-field>

            <v-text-field
              v-model="form.payment_profile"
              label="Payment Profile"
              outlined
              :rules="paymentProfileRules"
              required
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
        { text: "Description Income", value: "description_income" },
        { text: "Amount (GBP)", value: "amount_oi" },
        { text: "Payment Profile", value: "payment_profile" },
        { text: "Actions", value: "actions" },
      ],
      otherincomes: new FormData(),
      otherincome: [],
      purchaseorders:[],
      listPurchaseOrders: [],
      listPurchaseOrdersCopy: [],
      form: {
        id_purchase_order: null,
        date: null,
        description_income: null,
        amount_oi: null,
        payment_profile: null,
      },
      dateRules: [(v) => !!v || "Date Must Be Required"],
      vehicleRegistrationRules: [(v) => !!v || "Vehicle Registration Number Must Be Required"],
      descriptionIncomeRules: [(v) => !!v || "Description Income Must Be Required"],
      amountRules: [(v) => !!v || "Amount Must Be Required"],
      paymentProfileRules: [(v) => !!v || "Check Must Be Required"],
      deleteId: "",
      editId: "",
      date: new Date().toISOString().substr(0, 10),
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
      var url = this.$api + "/otherincome";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.otherincome = response.data.data;
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
        this.otherincomes.append("date", this.form.date);
        this.otherincomes.append("id_purchase_order", this.form.id_purchase_order);
        this.otherincomes.append("description_income", this.form.description_income);
        this.otherincomes.append("amount_oi", this.form.amount_oi);
        this.otherincomes.append("payment_profile", this.form.payment_profile);

        var url = this.$api + "/otherincome";
        this.load = true;
        this.$http
          .post(url, this.otherincomes, {
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
        description_income          : this.form.description_income,
        amount_oi                   : this.form.amount_oi,
        payment_profile             : this.form.payment_profile,
      };
      var url = this.$api + "/otherincome/" + this.editId;
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
      var url = this.$api + "/otherincome/" + this.deleteId;
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
          this.readDataPurchaseOrder(); //mengambil data
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
      this.form.description_income = item.description_income;
      this.form.amount_oi = item.amount_oi;
      this.form.payment_profile = item.payment_profile;
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

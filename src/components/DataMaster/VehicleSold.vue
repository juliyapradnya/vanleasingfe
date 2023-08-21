<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Vehicle Sold</h3>
    <v-breadcrumbs
      :items="items"
      divider="-"
    ></v-breadcrumbs>
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

      <v-data-table :headers="headers" :items="vehiclesold" :search="search">
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
          <span class="headline">{{ formTitle }} Vehicle Sold</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-if="inputType == 'Add'"
              v-model="form.id_sales_order"
              :items="salesorders"
              item-text="agreement_number"
              item-value="id"
              label="Original Sales Order Number"
              outlined
              :rules="originalSalesOrderNoRules"
            ></v-select>

            <v-select
              v-else
              v-model="form.id_sales_order"
              :items="listSalesOrdersCopy"
              item-text="agreement_number"
              item-value="id"
              label="Original Sales Order Number"
              outlined
              :rules="originalSalesOrderNoRules"
            ></v-select>

            <v-select
              v-if="inputType == 'Add'"
              v-model="form.id_purchase_order"
              :items="purchaseorders"
              item-text="vehicle_registration"
              item-value="id"
              label="Vehicle Registration Number"
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
              label="Vehicle Registration Number"
              outlined
              :rules="vehicleRegistrationRules"
              required
            ></v-select>

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
                  v-model="form.vehicle_sold_date"
                  label="Vehicle Sold Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="vehicleReturnDateRules"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.vehicle_sold_date"
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>

            <v-text-field
              v-model="form.sold_price"
              label="Sold Price"
              outlined
              :rules="soldPriceRules"
              required
              hint="Must be a number"
              persistent-hint
            ></v-text-field>

          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data vehicle sold ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
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
      //showSold: false,
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      menu1: false,
      items: [
        {
          text: 'Return',
          disabled: false,
          href: '/rehiringorder',
        },
        {
          text: 'Sold',
          disabled: false,
          href: '/vehiclesold',
        },
      ],
      headers: [
        { text: "Original Sales Order Number", value: "agreement_number" },
        { text: "Vehicle Registration Number", value: "vehicle_registration" },
        { text: "Sold Vehicle Return Date", value: "vehicle_sold_date" },
        { text: "Sold Price", value: "sold_price" },
        { text: "Actions", value: "actions" },
      ],
      vehiclesolds: new FormData(),
      vehiclesold: [],
      purchaseorders: [],
      salesorders: [],
      
      listSalesOrders: [],
      listSalesOrdersCopy: [],
      listPurchaseOrders: [],
      listPurchaseOrdersCopy: [],
      form: {
        id_sales_order: null,
        id_purchase_order: null,
        vehicle_sold_date: null,
        sold_price: null,
      },
      //nextStepRules: [(v) => !!v || "Next Step Be Required"],
      soldPriceRules: [(v) => !!v || "Sold Price Must Be Required"],
      vehicleReturnDateRules: [(v) => !!v || "Vehicle Sold Date Must Be Required"],
      deleteId: "",
      editId: "",
      vehicle_sold_date: new Date().toISOString().substr(0, 10),
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
      var url = this.$api + "/vehiclesold";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.vehiclesold = response.data.data;
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

    readDataVehicleSold() {
      var url = this.$api + "/vehiclesold";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.vehiclesold = response.data.data;
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

    readDataSalesOrder() {
      var url = this.$api + "/showagreementnumberinvehiclesold";
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
        this.vehiclesolds.append("id_sales_order", this.form.id_sales_order);
        this.vehiclesolds.append("id_purchase_order",this.form.id_purchase_order);
        this.vehiclesolds.append("vehicle_sold_date",this.form.vehicle_sold_date);
        this.vehiclesolds.append("sold_price", this.form.sold_price);

        var url = this.$api + "/vehiclesold";
        this.load = true;
        this.$http
          .post(url, this.vehiclesolds, {
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
            this.readDataPurchaseOrder();
            this.readDataSalesOrder();
            this.readDataVehicleSold(); //mengambil data
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
        id_sales_order: this.form.id_sales_order,
        id_purchase_order: this.form.id_purchase_order,
        vehicle_sold_date: this.form.vehicle_sold_date,
        sold_price: this.form.sold_price,
      };
      var url = this.$api + "/vehiclesold/" + this.editId;
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
          this.readDataPurchaseOrder();
          this.readDataSalesOrder();
          this.readDataVehicleSold(); //mengambil data
          this.resetForm();
          if(this.listSalesOrdersCopy.length > this.salesorders.length){
            this.listSalesOrdersCopy.pop();
          } else {
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
      var url = this.$api + "/vehiclesold/" + this.deleteId;
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
          this.readDataPurchaseOrder();
          this.readDataSalesOrder();
          this.readDataVehicleSold(); //mengambil data
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
      this.listSalesOrdersCopy = [...this.salesorders];
      
      this.listSalesOrders.map((s)=>{
        if(item.id_sales_order == s.id){
          return this.listSalesOrdersCopy.push({'id': s.id, 'agreement_number': s.agreement_number})
        }
      })

      this.listPurchaseOrdersCopy = [...this.purchaseorders];
      
      this.listPurchaseOrders.map((s)=>{
        if(item.id_purchase_order == s.id){
          return this.listPurchaseOrdersCopy.push({'id': s.id, 'vehicle_registration': s.vehicle_registration})
        }
      })

      this.inputType = "Update";
      this.editId = item.id;
      this.form.id_sales_order = item.id_sales_order;
      this.form.id_purchase_order = item.id_purchase_order;
      this.form.vehicle_sold_date = item.vehicle_sold_date;
      this.form.sold_price = item.sold_price;
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
    this.readDataSalesOrder();
    this.readDataVehicleSold();
    this.listDataSalesOrders();
    this.listDataPurchase();
  },
};
</script>

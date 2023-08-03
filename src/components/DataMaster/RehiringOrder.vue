<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Return Order</h3>
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

      <v-data-table :headers="headers" :items="rehiringorder" :search="search">
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
          <span class="headline">{{ formTitle }} Rehiring Order</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="form.next_step"
              :items="['Rehiring']"
              label="Re-hire Next Step"
              :rules="nextStepRules"
              outlined
              required
            ></v-select>

            <v-select
              v-if="inputType == 'Add'"
              v-model="form.id_sales_order"
              :items="salesorders"
              item-text="agreement_no"
              item-value="id"
              label="Original Sales Order Number"
              outlined
              :rules="originalSalesOrderNoRules"
            ></v-select>

            <v-select
              v-else
              v-model="form.id_sales_order"
              :items="listSalesOrdersCopy"
              item-text="agreement_no"
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
                  v-model="form.vehicle_return_date"
                  label="Re-hire Vehicle Return Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="vehicleReturnDateRules"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.vehicle_return_date"
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
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
          Anda yakin ingin menghapus data rehiring order ini?
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
        { text: "Re-hire Next Step", value: "next_step" },
        { text: "Original Sales Order Number", value: "agreement_no" },
        //{ text: "New Sales Order No. (If Re-Hire)", value: "new_sales_order_no" },
        { text: "Vehicle Registration Number", value: "vehicle_registration" },
        { text: "Re-hire Vehicle Return Date", value: "vehicle_return_date" },
        { text: "Actions", value: "actions" },
      ],
      rehiringorders: new FormData(),
      rehiringorder: [],
      purchaseorders: [],
      salesorders: [],
      listSalesOrders: [],
      listSalesOrdersCopy: [],
      listPurchaseOrders: [],
      listPurchaseOrdersCopy: [],
      form: {
        next_step: null,
        id_sales_order: null,
        new_sales_order_no: null,
        id_purchase_order: null,
        vehicle_return_date: null,
        sold_price: null,
      },
      nextStepRules: [(v) => !!v || "Next Step Be Required"],
      originalSalesOrderNoRules: [
        (v) => !!v || "Original Sales Order Number Must Be Required",
      ],
      newSalesOrderNoRules: [
        (v) => !!v || "New Sales Order Number Must Be Required",
      ],
      vehicleRegistrationRules: [
        (v) => !!v || "Vehicle Registration Number Must Be Required",
      ],
      vehicleReturnDateRules: [
        (v) => !!v || "Vehicle Return Date Must Be Required",
      ],
      soldPriceRules: [(v) => !!v || "Sold Price Must Be Required"],
      deleteId: "",
      editId: "",
      vehicle_return_date: new Date().toISOString().substr(0, 10),
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
      var url = this.$api + "/rehiringorder";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.rehiringorder = response.data.data;
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
      var url = this.$api + "/showagreementnumberinrehiring";
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
      console.log(this.form.new_sales_order_no)
      if (this.$refs.form.validate()) {
        this.rehiringorders.append("next_step", this.form.next_step);
        this.rehiringorders.append("id_sales_order", this.form.id_sales_order);
        //this.rehiringorders.append("new_sales_order_no",this.form.new_sales_order_no);
        this.rehiringorders.append("id_purchase_order",this.form.id_purchase_order);
        this.rehiringorders.append("vehicle_return_date",this.form.vehicle_return_date);
        //this.rehiringorders.append("sold_price", this.form.sold_price);

        var url = this.$api + "/rehiringorder";
        this.load = true;
        this.$http
          .post(url, this.rehiringorders, {
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
            this.readDataSalesOrder();
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
        next_step: this.form.next_step,
        id_sales_order: this.form.id_sales_order,
        new_sales_order_no: this.form.new_sales_order_no,
        id_purchase_order: this.form.id_purchase_order,
        vehicle_return_date: this.form.vehicle_return_date,
        sold_price: this.form.sold_price,
      };
      var url = this.$api + "/rehiringorder/" + this.editId;
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
          this.readDataSalesOrder();
          this.readDataPurchaseOrder(); //mengambil data
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
      var url = this.$api + "/rehiringorder/" + this.deleteId;
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
          this.readDataSalesOrder();
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
      this.listSalesOrdersCopy = [...this.salesorders];
      
      this.listSalesOrders.map((s)=>{
        if(item.id_sales_order == s.id){
          return this.listSalesOrdersCopy.push({'id': s.id, 'agreement_no': s.agreement_no})
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
      this.form.next_step = item.next_step;
      this.form.id_sales_order = item.id_sales_order;
      this.form.new_sales_order_no = item.new_sales_order_no;
      this.form.id_purchase_order = item.id_purchase_order;
      this.form.vehicle_return_date = item.vehicle_return_date;
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
    this.listDataSalesOrders();
    this.listDataPurchase();
  },
};
</script>

<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Vehicle Number</h3>

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

      <v-data-table
        :headers="headers"
        :items="vehiclepurchaseorder"
        :search="search"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="#8abfa7" dark small @click="listVehicleById(item.id)
          listTotalFormulaById(item.id)
          ">
            Show
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogShowVehicle" fullscreen persistent>
      <v-card>
        <v-toolbar dark color="#25a244">
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialogShowVehicle = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div>
          <v-container>
            <v-row dense>
              <v-col
                v-for="item in listVehicleInVehicleCard"
                :key="item.id"
                cols="3"
              >
                <v-card color="#7ae582" class="mt-2">
                  <v-card-title class="text-h5 font-weight-black">
                    {{ item.vehicle_registration }}
                  </v-card-title>
                  <hr style="height: 2px" />
                  <v-card-subtitle class="font-weight-black">
                    <p>Original Sales Order Number : {{ item.agreement_number }}</p>
                    <p>Contract Status : {{ item.next_step_status_sales }}</p>
                    <p>Fleet Status : {{ item.status_next_step }}</p>
                    <p>Contract Start Date : {{ item.contract_start_date }}</p>
                    <p>Contract End Date : {{ item.vehicle_return_date }}</p>
                    <p v-if="item.next_step_status_sales == 'Sold'" >Sold Date : {{ item.vehicle_sold_date }}</p>
                    <p v-else>Sold Date : - </p>
                    <p>Annual Mileage : {{ item.annual_mileage }}</p>
                    <p>Monthly Rental : {{ item.monthly_rental }}</p>
                    <p>Total Income : {{ item.total_income_new }}</p>
                    <p>Total Cost : {{ item.total_cost }}</p>
                    <p>Contract Margin : {{ item.contract_margin }}</p>
                    <p>Rental Income : {{ item.rental_income }}</p>
                    <p>Monthly Rental : {{ item.monthly_rental }}</p>
                    <p>Term Period : {{ item.margin_term }}</p>
                    <p v-if="item.next_step_status_sales == 'Sold'">
                      Sold Price : {{ item.sold_price }}
                    </p>
                    <p>Financing Amount : {{ item.financing_amount }}</p>
                    <p>Deposit : {{ item.hp_deposit_amount }}</p>
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <div>
          <v-container>
            <v-row dense>
              <v-col
                v-for="item in listTotalInCard"
                :key="item.id"
                cols="3"
              >
                <v-card color="#7ae582" class="mt-2">
                  <v-card-title class="text-h5 font-weight-black">
                    {{ item.vehicle_registration }}
                  </v-card-title>
                  <hr style="height: 2px" />
                  <v-card-subtitle class="font-weight-black">
                    <p>Total Income         : {{ item.sum_total_income }}</p>
                    <p>Total Cost           : {{ item.sum_total_cost }}</p>
                    <p>Fleet Margin         : {{ item.margin }}</p>
                    <p>Total Rental Income  : {{ item.sum_rental_income }}</p>
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-card-actions class="justify-end"> </v-card-actions>
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
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      dialogShowVehicle: false,
      id: null,
      vehicle_registration: null,
      agreement_number: null,
      next_step: null,
      new_sales_order_no: null,
      vehicle_return_date: null,
      sold_price: null,
      headers: [
        { text: "Vehicle Registration", value: "vehicle_registration" },
        { text: "Actions", value: "actions" },
      ],
      //purchaseorders: new FormData(),
      //purchaseorder: [],
      //vehiclerehiringorder: [],
      vehiclepurchaseorder: [],
      listVehicleInVehicleCard: [],
      listTotalInCard: [],
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
    // readData() {
    //   var url = this.$api + "/purchaseorder";
    //   this.$http
    //     .get(url, {
    //       headers: {
    //         Authorization: "Bearer " + localStorage.getItem("token"),
    //       },
    //     })
    //     .then((response) => {
    //       this.purchaseorder = response.data.data;
    //     });
    // },

    readDataVehicle() {
      var url = this.$api + "/purchaseorder";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.vehiclepurchaseorder = response.data.data;
        });
    },

    listVehicleById(id) {
      var url = this.$api + "/listvehicleinvehiclecard/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.listVehicleInVehicleCard = response.data.data;
          this.dialogShowVehicle = true;
        });
    },

    listTotalFormulaById(id) {
      var url = this.$api + "/listtotalincard/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.listTotalInCard = response.data.data;
          this.dialogShowVehicle = true;
        });
    },

    // listHandler(item) {
    //   this.id = item.id;
    //   this.listVehicleInVehicleCard = response.data.data;
    //   this.listTotalInCard = response.data.data;
    //   this.dialogShowVehicle = true;
    // },

    // readDataVehicleRehiringOrder() {
    //   var url = this.$api + "/showvehiclerehiringorder";
    //   this.$http
    //     .get(url, {
    //       headers: {
    //         Authorization: "Bearer " + localStorage.getItem("token"),
    //       },
    //     })
    //     .then((response) => {
    //       this.vehiclerehiringorder = response.data.data;
    //     });
    // },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
    console: () => console,
  },
  mounted() {
    //this.readData();
    this.readDataVehicle();
  },
};
</script>

<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Vehicle Card</h3>

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
          <v-btn color="#8abfa7" dark small class="mr-3" @click="listVehicleById(item.id)">
            Sales
          </v-btn>
          <v-btn color="#8abfa7" dark small class="mr-3" @click="listCostById(item.id)">
            Cost
          </v-btn>
          <v-btn color="#8abfa7" dark small mx-2 @click="
          listTotalFormulaById(item.id)
          listTotalIncomeById(item.id)
          listTotalCostById(item.id)
          listTotalRentalIncomeById(item.id)
          listTotalOtherIncomeById(item.id)
          listTotalOtherCostById(item.id)
          listTotalSoldPriceById(item.id)
          listTotalResidualValueById(item.id)"
          >
            Fleet Margin
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
                    <p>Customer Name : {{ item.cust_name }}</p>
                    <p>Contract Status : {{ item.next_step_status_sales }}</p>
                    <p>Fleet Status : {{ item.status_next_step }}</p>
                    <p>Contract Start Date : {{ item.contract_start_date }}</p>
                    <p>Contract End Date : {{ item.vehicle_return_date }}</p>
                    <p v-if="item.next_step_status_sales == 'Sold'" >Sold Date : {{ item.vehicle_sold_date }}</p>
                    <p v-else>Sold Date : - </p>
                    <p>Annual Mileage : {{ item.annual_mileage }}</p>
                    <p>Monthly Rental : {{ item.monthly_rental }}</p>
                    <p>Total Income : {{ item.total_income }}</p>
                    <p>Rental Income : {{ item.rental_income }}</p>
                    <p>Monthly Rental : {{ item.monthly_rental }}</p>
                    <p>Term Period : {{ item.margin_term }}</p>
                    <p v-if="item.next_step_status_sales == 'Sold'">
                      Sold Price : {{ item.sold_price }}
                    </p>
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-card-actions class="justify-end"> </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogShowCostVehicle" fullscreen persistent>
      <v-card>
        <v-toolbar dark color="#25a244">
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialogShowCostVehicle = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div>
          <v-container>
            <v-row dense>
              <v-col
                v-for="item in listCostInCard"
                :key="item.id"
                cols="3"
              >
                <v-card color="#7ae582" class="mt-2">
                  <v-card-title class="text-h5 font-weight-black">
                    {{ item.vehicle_registration }}
                  </v-card-title>
                  <hr style="height: 2px" />
                  <v-card-subtitle class="font-weight-black">
                    <p>Hire Purchase Name : {{ item.hp_finance_provider }}</p>
                    <p>Purchase Starting Date : {{ item.hire_purchase_starting_date }}</p>
                    <p>Interest Rate (p.a.) : {{ item.hp_interest_per_annum }}</p>
                    <p>Deposit : {{ item.hp_deposit_amount }}</p>
                    <p>Period Term (months) : {{ item.hp_term }}</p>
                    <p>Documentation Fee : {{ item.documentation_fees_pu }}</p>
                    <p>Final Fee : {{ item.final_fees }}</p>
                    <p>Other Fee : {{ item.other_fees }}</p>
                    <p>Price OTR : {{ item.price_otr }}</p>
                    <p>Purchase Monthly Payment : {{ item.monthly_payment }}</p>
                    <p>Last Payment : {{ item.final_payment }}</p>
                    <p>Interest Type : {{ item.hp_interest_type }}</p>
                    <p>Total Cost : {{ item.total_cost }}</p>
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-card-actions class="justify-end"> </v-card-actions>
      </v-card>
    </v-dialog>

     <v-dialog v-model="dialogShowMarginVehicle" fullscreen persistent>
      <v-card>
        <v-toolbar dark color="#25a244">
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialogShowMarginVehicle = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div>
          <v-container>
            <v-row dense>
              <v-col
                cols="3"
              >
                <v-card color="#7ae582" class="mt-2">
                  <v-card-title class="text-h5 font-weight-black">
                    {{ listVehicleNumber }}
                  </v-card-title>
                  <hr style="height: 2px" />
                  <v-card-subtitle class="font-weight-black">
                    <p v-if="listTotalIncome == null" >Total Income  : {{ 0 }}</p>
                    <p v-else-if="listTotalOtherIncome == null" >Total Income  : {{ listTotalIncome }}</p>
                    <p v-else-if="listTotalOtherIncome != null" > Total Income  : {{ parseFloat(listTotalIncome) + parseFloat(listTotalOtherIncome) }}</p>
                    
                    <p v-if="listTotalCost == null" >Total Cost  : {{ 0 }}</p>
                    <p v-else-if="listTotalOtherCost == null" >Total Cost  : {{ listTotalCost }}</p>
                    <p v-else-if="listTotalOtherCost != null">Total Cost  : {{ parseFloat(listTotalCost) + parseFloat(listTotalOtherCost)}}</p>
                    
                    <p v-if="listTotalIncome == null && listTotalCost == null" >Fleet Margin  : {{ 0 }}</p>
                    <p v-else-if="listTotalIncome == null" >Fleet Margin  : {{ listTotalCost }}</p>
                    <p v-else-if="listTotalCost == null" >Fleet Margin  : {{ listTotalIncome }}</p>
                    <p v-else-if="listTotalOtherIncome == null && listTotalOtherCost == null" >Fleet Margin  : {{ parseFloat(listTotalIncome) - parseFloat(listTotalCost) }}</p>
                    <p v-else-if="listTotalOtherIncome == null"> Fleet Margin  : {{ parseFloat(listTotalIncome) - (parseFloat(listTotalCost) + parseFloat(listTotalOtherCost)) }}</p>
                    <p v-else-if="listTotalOtherCost == null"> Fleet Margin  : {{ (parseFloat(listTotalIncome) + parseFloat(listTotalOtherIncome)) - parseFloat(listTotalCost) }}</p>
                    <p v-else-if="listTotalOtherIncome != null && listTotalOtherCost != null"> Fleet Margin  : {{ (parseFloat(listTotalIncome) + parseFloat(listTotalOtherIncome)) - (parseFloat(listTotalCost) + parseFloat(listTotalOtherCost)) }}</p>
                    
                    <p v-if="listTotalRentalIncome == null" >Total Rental Income  : {{ 0 }}</p>
                    <p v-else>Total Rental Income  : {{ listTotalRentalIncome }}</p>
                    
                    <p v-if="listTotalSoldPrice == null" >Sold Price  : {{ 0 }}</p>
                    <p v-else>Sold Price  : {{ listTotalSoldPrice }}</p>

                    <p v-if="listTotalResidualValue == null" >Total Residual Value Projection  : {{ 0 }}</p>
                    <p v-else>Total Residual Value Projection  : {{ listTotalResidualValue }}</p>

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
      dialogShowCostVehicle: false,
      dialogShowMarginVehicle: false,
      id: null,
      vehicle_registration: null,
      agreement_number: null,
      next_step: null,
      new_sales_order_no: null,
      vehicle_return_date: null,
      sold_price: null,
      headers: [
        { text: "Vehicle Registration", value: "vehicle_registration"},
        { text: "Actions", value: "actions" , align: 'center' },
      ],
      //purchaseorders: new FormData(),
      //purchaseorder: [],
      //vehiclerehiringorder: [],
      vehiclepurchaseorder: [],
      listVehicleInVehicleCard: [],
      listCostInCard: [],
      listTotalInCard: [],
      listTotalIncome: null,
      listTotalCost: null,
      listTotalRentalIncome: null,
      listTotalOtherIncome: null,
      listTotalOtherCost: null,
      listTotalSoldPrice: null,
      listTotalResidualValue: null,
      listVehicleNumber: null,
      //listTotalInCard: null,
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

    listCostById(id) {
      var url = this.$api + "/listcostincard/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.listCostInCard = response.data.data;
          this.dialogShowCostVehicle = true;
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
          this.dialogShowMarginVehicle = true;
        });
    },

    listTotalIncomeById(id) {
      this.dialogShowMarginVehicle = true;
      var url = this.$api + "/listtotalincome/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data.data.sum_total_income)
          this.listTotalIncome = response.data.data.sum_total_income;
          this.listVehicleNumber = response.data.data.vehicle_registration;
        });
    },

    listTotalCostById(id) {
      this.dialogShowMarginVehicle = true;
      var url = this.$api + "/listtotalcost/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data.data.sum_total_cost)
          this.listTotalCost = response.data.data.sum_total_cost;
          
        });
    },

    listTotalRentalIncomeById(id) {
      this.dialogShowMarginVehicle = true;
      var url = this.$api + "/listrentalincome/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data.data.sum_rental_income)
          this.listTotalRentalIncome = response.data.data.sum_rental_income;
          
        });
    },

    listTotalOtherIncomeById(id) {
      this.dialogShowMarginVehicle = true;
      var url = this.$api + "/listotherincome/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data.data.sum_other_income)
          this.listTotalOtherIncome = response.data.data.sum_other_income;
          
        });
    },

    listTotalOtherCostById(id) {
      this.dialogShowMarginVehicle = true;
      var url = this.$api + "/listothercost/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data.data.sum_other_cost)
          this.listTotalOtherCost = response.data.data.sum_other_cost;
          
        });
    },

    listTotalSoldPriceById(id) {
      this.dialogShowMarginVehicle = true;
      var url = this.$api + "/listsoldprice/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data.data.sum_sold_price)
          this.listTotalSoldPrice = response.data.data.sum_sold_price;
          
        });
    },

    listTotalResidualValueById(id) {
      this.dialogShowMarginVehicle = true;
      var url = this.$api + "/listresidualvalue/" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data.data.sum_residual_value)
          this.listTotalResidualValue = response.data.data.sum_residual_value;
          
        });
    },



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



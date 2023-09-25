<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Mileage</h3>

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

      <v-data-table :headers="headers" :items="mileage" :search="search">
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
          <span class="headline">{{ formTitle }} Mileage </span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">

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
                  v-model="form.tgl_mileage"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="dateRules"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.tgl_mileage"
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>

            <v-text-field
              v-model="form.jumlah_mileage"
              label="Mileage"
              outlined
              :rules="jumlahMileageRules"
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
          Anda yakin ingin menghapus data mileages ini?
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
      dialogShowData: false,
      menu1: false,
      headers: [
        { text: "Date", value: "tgl_mileage" },
        { text: "Vehicle Registration Number", value: "vehicle_registration" },
        { text: "Mileage", value: "jumlah_mileage" },
        { text: "Actions", value: "actions" },
      ],
      mileages: new FormData(),
      mileage: [],
      form: {
        id_purchase_order: null,
        tgl_mileage: null,
        vehicle_registration_number: null,
        jumlah_mileage: null,
        
      },
      dateRules: [(v) => !!v || "Date Must Be Required"],
      vehicleRegistrationRules: [(v) => !!v || "Vehicle Registration Number Must Be Required"],
      jumlahMileageRules: [(v) => !!v || "Mileage Must Be Required"],
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
      var url = this.$api + "/mileage";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mileage = response.data.data;
        });
    },
    
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.mileages.append("id_purchase_order", this.form.id_purchase_order);
        this.mileages.append("tgl_mileage", this.form.tgl_mileage);
        this.mileages.append("jumlah_mileage", this.form.jumlah_mileage);

        var url = this.$api + "/mileage";
        this.load = true;
        this.$http
          .post(url, this.mileages, {
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
        tgl_mileage           : this.form.tgl_mileage,
        jumlah_mileage        : this.form.jumlah_mileage,
      };
      var url = this.$api + "/mileage/" + this.editId;
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
      var url = this.$api + "/mileage/" + this.deleteId;
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
      this.form.tgl_mileage = item.tgl_mileage;
      this.form.jumlah_mileage = item.jumlah_mileage;
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
  },
};
</script>

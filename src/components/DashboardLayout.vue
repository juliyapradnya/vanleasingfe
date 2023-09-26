<template>
  <div class="dashboard">
    <v-navigation-drawer
      color="#ffffff"
      v-model="drawer"
      class="fullheight"
      width="250"
      border
      app
    >
      <v-list-item>
        <v-list-item-content>
          <img id="logoLogin" src="../assets/vanleasing.png" width="50" height="65" alt="Kitten">
        </v-list-item-content>
      </v-list-item>
          <v-list dense>
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              link
              tag="router-link"
              :to="item.to"
            >
            <v-list-item-icon>
            <v-icon color="green" >{{ item.icon }}</v-icon>
            </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        <template v-slot:append>
        <div class="pa-2">
          <v-btn class="white--text" color="#2dc653" @click="logout" block>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="#1a7431" app fixed height="80px">
      <v-app-bar-nav-icon
        color="#eff1ed"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        
      </v-toolbar-items>
    </v-app-bar>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dashboard",
  data() {
    return {
      drawer: true,
      error_message: "",
      snackbar: false,
      items: [
        { text: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },
        { text: "Available Stock", icon: "mdi-car-multiple", to: "/availablestock" },
        { text: "New Vehicle", icon: "mdi-car-arrow-left", to: "/purchaseorder" },
        { text: "New Contract", icon: "mdi-car-arrow-right", to: "/salesorder" },
        { text: "End of Contract", icon: "mdi-check-all", to: "/rehiringorder" },
        { text: "Additional Cost", icon: "mdi-cash", to: "/othercost" },
        { text: "Additional Income", icon: "mdi-cash", to: "/otherincome" },
        { text: "Vehicle Performance", icon: "mdi-card-text", to: "/vehiclecard" },
        { text: "Full Contract View", icon: "mdi-database", to: "/compilationdb" },
        { text: "Mileage", icon: "mdi-car-info", to: "/mileage" },
      ],
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");

      this.$router.push({
        name: "Login",
      });
    },
  },
};
</script>

<style scoped>
.fullheight {
  min-height: 100vh !important;
}

.router {
  text-decoration: none;
  color: rgb(255, 255, 255);
}

.v-list-item__title {
  color: rgb(255, 190, 71);
  font-size: 30px;
}
</style>
